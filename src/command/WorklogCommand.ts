import { inject, injectable } from 'inversify';
import AbstractCommand from './AbstractCommand';
import { Formatter, MessageService, WorklogService } from '../components';
import { ServiceIdentifiers } from '../identifiers';
import { DateHelper } from '../helper';

@injectable()
export class WorklogCommand extends AbstractCommand {
    public name = 'worklog';
    public aliases = ['w', 't'];
    public options = [
        {
            flag: 'command.worklog.option.delete.flag',
            description: 'command.worklog.option.delete.description'
        },
        {
            flag: 'command.worklog.option.edit.flag',
            description: 'command.worklog.option.edit.description'
        },
        {
            flag: 'command.worklog.option.time.flag',
            description: 'command.worklog.option.time.description'
        },
        {
            flag: 'command.worklog.option.unexpected.flag',
            description: 'command.worklog.option.unexpected.description'
        }
    ];
    public description = 'command.worklog.description';

    private worklogService: WorklogService;
    private formatter: Formatter;

    constructor(
        @inject(ServiceIdentifiers.MessageService) messages: MessageService,
        @inject(ServiceIdentifiers.WorklogService) worklogService: WorklogService,
        @inject(ServiceIdentifiers.Formatter) formatter: Formatter
    ) {
        super(messages);
        this.worklogService = worklogService;
        this.formatter = formatter;
    }

    exec(options: any, args?: any[]): void {
        const commandValues: string[] = args || [];
        const unexpected = options.unexpected ?? '';
        const trackTime = this.parseTimeOption(options.time);

        if (options.delete) {
            this.handleDelete(options.delete);
            return;
        }

        if (options.edit) {
            this.handleEdit(options.edit, commandValues, unexpected, trackTime);

            return;
        }

        this.handleCreate(commandValues, unexpected, trackTime);
    }

    private parseTimeOption(timeOption: string): Date | undefined {
        // Parse time option (format HH:MM) into a Date object or undefined if not provided
        if (!timeOption) {
            return undefined;
        }

        return DateHelper.parseTimeString(timeOption);
    }

    private handleDelete(iteratorId: number): void {
        this.worklogService.delete(iteratorId);

        console.log(this.formatter.applyFormat({ id: iteratorId }, 'command.worklog.execution', 'delete'));
    }

    private handleEdit(iteratorId: number, commandValues: string[], unexpected: string, trackTime?: Date): void {
        this.worklogService.update(iteratorId, commandValues, unexpected, trackTime);

        if (commandValues.length >= 2) {
            console.log(
                this.formatter.applyFormat(
                    { iterator: iteratorId, key: commandValues[0], value: commandValues[1] },
                    'command.worklog.execution',
                    'updated'
                )
            );

            return;
        }

        console.log(this.message.translation('command.worklog.execution.couldNotEdit') + iteratorId);
    }

    private handleCreate(commandValues: string[], unexpected: string, trackTime?: Date): void {
        if (commandValues.length < 2) {
            console.log(this.message.translation('command.worklog.execution.invalidArguments'));

            return;
        }

        this.worklogService.create(commandValues, unexpected, trackTime).then((res) => {
            console.log(this.formatter.applyFormat(res, 'command.worklog.execution', 'create'));
        });
    }
}
