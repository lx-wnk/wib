import AbstractCommand from './AbstractCommand';
import { Formatter, MessageService, WorklogService } from '../components';
import { inject, injectable } from 'inversify';
import { ServiceIdentifiers } from '../identifiers';

@injectable()
export class RestCommand extends AbstractCommand {
    public name = 'rest';
    public aliases = ['b', 'break'];
    public options = [
        {
            flag: 'command.rest.option.time.flag',
            description: 'command.rest.option.time.description'
        }
    ];
    public description = 'command.rest.description';

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

    exec(options: any): void {
        const trackTime = this.parseTimeOption(options.time);
        this.createRest(trackTime);
    }

    private parseTimeOption(timeOption: string): Date | undefined {
        if (!timeOption) {
            return undefined;
        }

        const trackTime = new Date();
        const timeArgs = timeOption.split(':');

        trackTime.setHours(parseInt(timeArgs[0], 10));
        trackTime.setMinutes(parseInt(timeArgs[1], 10));

        if (trackTime.toString() === 'Invalid Date') {
            console.log(this.message.translation('command.rest.execution.invalidTime'));
            return undefined;
        }

        return trackTime;
    }

    private createRest(time?: Date): void {
        this.worklogService
            .createRest(time)
            .then((res) => {
                console.log(this.formatter.applyFormat(res, 'command.rest.execution', 'create'));
            })
            .catch((error) => {
                console.error('Error creating rest entry:', error);
            });
    }
}
