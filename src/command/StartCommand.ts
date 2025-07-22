import AbstractCommand from './AbstractCommand';
import { inject, injectable } from 'inversify';
import { Formatter, MessageService } from '../components';
import { ServiceIdentifiers, ORMIdentifiers } from '../identifiers';
import { DayRepository } from '../orm/repositories';
import { DateHelper } from '../helper';

@injectable()
export class StartCommand extends AbstractCommand {
    name = 'start';
    aliases = ['hi'];
    options = [];
    description = 'command.start.description';

    private dayRepository: DayRepository;
    private formatter: Formatter;

    constructor(
        @inject(ServiceIdentifiers.MessageService) messages: MessageService,
        @inject(ORMIdentifiers.Repositories.DayRepository) dayRepository: DayRepository,
        @inject(ServiceIdentifiers.Formatter) formatter: Formatter
    ) {
        super(messages);

        this.dayRepository = dayRepository;
        this.formatter = formatter;
    }

    exec(options: any, args?: any[]): void {
        const time = this.parseTimeFromArgs(args);

        this.startDay(time);
    }

    private parseTimeFromArgs(args: any): Date {
        const now = new Date();

        if (!args || !args[0] || !args[0].includes(':')) {
            return now;
        }

        return DateHelper.parseTimeString(args[0], now);
    }

    private startDay(startTime: Date): void {
        this.dayRepository
            .getByDate(startTime)
            .then((result) => {
                result.start = startTime;

                this.dayRepository.upsert(result);

                return result;
            })
            .then((currentDay) => {
                console.log(this.formatter.applyFormat(currentDay, 'format.commandResponse', 'start'));
            });
    }
}
