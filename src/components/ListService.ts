import { injectable, inject } from 'inversify';
import { ServiceIdentifiers, ORMIdentifiers } from '../identifiers';
import { Formatter } from './Formatter';
import { ListItemFormatter } from './ListItemFormatter';
import { DayRepository, WorklogRepository, NoteRepository } from '../orm/repositories';
import { ListData } from '../interfaces/ListData.interface';

@injectable()
export class ListService {
    private noteRepository: NoteRepository;
    private worklogRepository: WorklogRepository;
    private dayRepository: DayRepository;
    private formatter: Formatter;
    private listItemFormatter: ListItemFormatter;
    constructor(
        @inject(ORMIdentifiers.Repositories.NoteRepository) noteRepository: NoteRepository,
        @inject(ORMIdentifiers.Repositories.WorklogRepository) worklogRepository: WorklogRepository,
        @inject(ORMIdentifiers.Repositories.DayRepository) dayRepository: DayRepository,
        @inject(ServiceIdentifiers.Formatter) formatter: Formatter,
        @inject(ServiceIdentifiers.ListItemFormatter) listItemFormatter: ListItemFormatter
    ) {
        this.noteRepository = noteRepository;
        this.worklogRepository = worklogRepository;
        this.dayRepository = dayRepository;
        this.formatter = formatter;
        this.listItemFormatter = listItemFormatter;
    }

    public init(
        noteRepository: NoteRepository,
        worklogRepository: WorklogRepository,
        dayRepository: DayRepository,
        formatter: Formatter,
        listItemFormatter: ListItemFormatter
    ): void {
        this.noteRepository = noteRepository;
        this.worklogRepository = worklogRepository;
        this.dayRepository = dayRepository;
        this.formatter = formatter;
        this.listItemFormatter = listItemFormatter;
    }

    public async getList(targetDate: Date, order?: string, fullOutput?: string): Promise<string> {
        const listData: ListData = {
            day: null,
            start: null,
            finish: null,
            notes: [],
            worklogs: []
        };

        const day = await this.dayRepository.getByDate(targetDate);
        const notes = await this.noteRepository.getUndeletedList(targetDate);
        let worklogs = await this.worklogRepository.getUndeletedByDateIterator(targetDate);

        if (order && order.toLowerCase() === 'desc') {
            worklogs = worklogs.reverse();
        }

        const showFullOutput = fullOutput === 'true';

        listData.day = this.listItemFormatter.formatDayItem(day, 'day');
        listData.start = this.listItemFormatter.formatDayItem(day, 'start');
        listData.finish = this.listItemFormatter.formatDayItem(day, 'stop');

        listData.notes = this.listItemFormatter.formatNotes(notes);
        listData.worklogs = this.listItemFormatter.formatWorklogs(worklogs, day.start);

        return this.formatter.toTable(listData, showFullOutput);
    }
}
