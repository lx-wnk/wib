import { inject, injectable, optional } from 'inversify';
import AbstractCommand from './AbstractCommand';
import process from 'process';
import { homedir } from 'os';
import * as fs from 'fs';
import * as path from 'path';
import { DayEntity } from '../orm/entities/Day.entity';
import { WorklogEntity } from '../orm/entities/Worklog.entity';
import { NoteEntity } from '../orm/entities/Note.entity';
import { ConnectionManager } from '../orm';
import { ServiceIdentifiers, ORMIdentifiers } from '../identifiers';
import { MessageService } from '../components';
import { QueryFailedError } from 'typeorm';

interface DataDay {
    start?: { time: string };
    stop?: { time: string };
    notes?: Record<string, unknown>;
    worklogs?: Record<string, unknown>;
}

interface MigrationData {
    [key: string]: DataDay;
}

@injectable()
export class MigrateCommand extends AbstractCommand {
    public name = 'migrate';
    public aliases = ['m'];
    public options = [
        {
            flag: 'command.migrate.option.data.flag',
            description: 'command.migrate.option.data.description'
        }
    ];
    public description = 'command.migrate.description';

    private days: MigrationData = {};
    private connectionManager: ConnectionManager;

    constructor(
        @inject(ServiceIdentifiers.MessageService) @optional() messages: MessageService,
        @inject(ORMIdentifiers.ConnectionManager) connectionManager: ConnectionManager
    ) {
        super(messages);
        this.connectionManager = connectionManager;
    }

    exec(options: any): void {
        const sleep = async (milliseconds: number) => {
            await new Promise((resolve) => {
                return setTimeout(resolve, milliseconds);
            });
        };

        console.log(this.message.translation('command.migrate.execution.start'));

        console.log(this.message.translation('command.migrate.execution.stepStart', { step: 'missing migrations' }));
        this.executeMissingMigrations();
        console.log(this.message.translation('command.migrate.execution.stepDone', { step: 'missing migrations' }));
        console.log(''); // Add an empty line for better readability

        if (options.data) {
            (async () => {
                console.log(
                    this.message.translation('command.migrate.execution.waitingSeconds', {
                        step: 'data migration',
                        seconds: 5
                    })
                );
                await sleep(5000);

                this.migrateData();

                console.log(this.message.translation('command.migrate.execution.stepDone', { step: 'data migration' }));
            })();
        }
    }

    private executeMissingMigrations(): void {
        try {
            this.connectionManager
                .getConnection()
                .then((connection) => {
                    connection.runMigrations({ transaction: 'all' }).catch((err: Error) => {
                        console.error(this.message.translation('command.migrate.execution.error'));
                        console.error(err);
                    });
                })
                .catch((err: Error) => {
                    console.error(this.message.translation('command.migrate.execution.error'));
                    console.error(err);
                });
        } catch (err) {
            console.error(this.message.translation('command.migrate.execution.error'));
            console.error(err);
        }
    }

    private migrateData(): void {
        this.extractTypeData();

        this.connectionManager
            .getConnection()
            .then((connection) => {
                connection.runMigrations({ transaction: 'none' }).then(() => {
                    this.migrateToSqlite();
                });
            })
            .finally(() => {
                console.log(this.message.translation('command.migrate.execution.finish'));
            });
    }

    private extractTypeData(): void {
        const files = this.getFiles();

        files.forEach((file) => {
            const filePath = this.getHomeDir() + file;
            let parsed;

            try {
                parsed = this.parseFileToJson(filePath);
            } catch (e) {
                return;
            }

            if (!parsed) {
                return;
            }

            const typedParsed = parsed as any;
            const dayKey = file.replace('.json', '');

            this.days[dayKey] = {} as DataDay;

            if (typedParsed.start) {
                this.days[dayKey].start = typedParsed.start;
            }

            if (typedParsed.stop) {
                this.days[dayKey].stop = typedParsed.stop;
            }

            if (typedParsed.notes) {
                this.days[dayKey].notes = typedParsed.notes;
            }

            if (typedParsed.worklogs) {
                this.days[dayKey].worklogs = typedParsed.worklogs;
            }
        });
    }

    private migrateToSqlite(): void {
        const migratedData = {
            days: 0,
            worklogs: 0,
            notes: 0
        };

        this.connectionManager
            .getConnection()
            .then(async (connection) => {
                const dayRepository = connection.getRepository(DayEntity);
                const noteRepository = connection.getRepository(NoteEntity);
                const days: DayEntity[] = [];
                const notes: NoteEntity[] = [];

                for (const date in this.days) {
                    const day = new DayEntity();

                    const dayData = this.days[date];
                    if (dayData && dayData.start && dayData.start.time) {
                        day.start = new Date(dayData.start.time);
                    }

                    if (dayData && dayData.stop && dayData.stop.time) {
                        day.finish = new Date(dayData.stop.time);
                    }

                    if (dayData && dayData.worklogs) {
                        day.worklogs = [];

                        const worklogs = dayData.worklogs;
                        if (worklogs) {
                            Object.values(worklogs).forEach((entry: any) => {
                                const worklog = new WorklogEntity();
                                worklog.iterator = entry['id'];
                                worklog.key = entry['key'];
                                worklog.value = entry['value'];
                                worklog.time = new Date(entry['time']);
                                worklog.deleted = entry['deleted'];
                                worklog.rest = entry['dataKey'] === 'rest';

                                if (!worklog.key || !worklog.value) {
                                    return;
                                }

                                migratedData.worklogs++;
                                day.worklogs!.push(worklog);
                            });
                        }
                    }

                    if (dayData && dayData.notes) {
                        const noteEntries = dayData.notes;
                        if (noteEntries) {
                            Object.values(noteEntries).forEach((entry: any) => {
                                const note = new NoteEntity();
                                note.iterator = notes.length;
                                note.value = entry['value'];
                                note.time = new Date(entry['time']);
                                note.deleted = entry['deleted'];

                                migratedData.notes++;
                                notes.push(note);
                            });
                        }
                    }

                    if (!day.start && day.worklogs && day.worklogs[0]) {
                        day.start = day.worklogs[0].time;
                    }

                    if (day.start) {
                        day.date = day.start;

                        migratedData.days++;
                        days.push(day);
                    }
                }

                try {
                    await dayRepository.save(days);

                    return await noteRepository.save(notes);
                } catch (err) {
                    console.error('Could not save data to database for due to error:', err);

                    process.exit(1);
                }
            })
            .catch((err: Error) => {
                console.error(err);
                process.exit(1);
            })
            .finally(() => {
                console.log(this.message.translation('command.migrate.execution.dataMigrated', migratedData));
                console.log(this.message.translation('command.migrate.execution.done'));
            });
    }

    private getFiles(): string[] {
        const files = fs.readdirSync(this.getHomeDir());
        return files.filter((el) => /[0-9]{4}_[0-9]{2}_[0-9]{2}.json$/gm.test(el));
    }

    private parseFileToJson(file: string): any {
        return JSON.parse(fs.readFileSync(file, 'utf8'));
    }

    public getHomeDir(): string {
        return homedir() + '/.wib/';
    }
}
