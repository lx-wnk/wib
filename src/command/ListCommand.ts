import AbstractCommand from './AbstractCommand';
import StartStruct from '../struct/start';
import StopStruct from '../struct/stop';
import FormatHelper from '../helper/FormatHelper';
import WorklogCollection from '../struct/collection/WorklogCollection';
import WorkDurationHelper from '../helper/WorkDurationHelper';
import NoteCollection from '../struct/collection/NoteCollection';
import Messages from '../messages';

export default class ListCommand extends AbstractCommand {
    name = 'list';
    aliases = ['l', 'status', 'report'];
    description = Messages.translation('command.list.description');
    options = [
      {
        flag: Messages.translation('command.list.option.day.flag'),
        description: Messages.translation('command.list.option.day.description')
      },
      {
        flag: Messages.translation('command.list.option.month.flag'),
        description: Messages.translation('command.list.option.month.description')
      },
      {
        flag: Messages.translation('command.list.option.yesterday.flag'),
        description: Messages.translation('command.list.option.yesterday.description')
      },
      {
        flag: Messages.translation('command.list.option.full.flag'),
        description: Messages.translation('command.list.option.full.description')
      },
      {
        flag: Messages.translation('command.list.option.order.flag'),
        description: Messages.translation('command.list.option.order.description'),
        defaultValue: WorklogCollection.possibleOrderKeys.time,
      },
    ];

    private formatHelper: FormatHelper;
    private dateTime: number;
    private workDurationHelper: WorkDurationHelper;
    private start: StartStruct;
    private stop: StopStruct;
    private notes: NoteCollection;
    private worklogs: WorklogCollection;

    constructor() {
      super();
      this.formatHelper = new FormatHelper();
      this.dateTime = new Date(Date.now()).getTime();
      this.workDurationHelper = new WorkDurationHelper();
      this.start = (new StartStruct(null));
      this.stop = (new StopStruct(null));
      this.notes = (new NoteCollection());
      this.worklogs = (new WorklogCollection());
    }

    execute(args): string {
        if(args.order === undefined) {
            args.order = WorklogCollection.possibleOrderKeys.time;
        }

      if (!Object.values(WorklogCollection.possibleOrderKeys).includes(args.order)) {
        return Messages.translation('command.list.execution.invalidOrder') + args.order;
      }

      if (undefined !== args.yesterday) {
        args.day = (new Date(this.dateTime)).getDate() - 1;
      }

      if (undefined !== args.day) {
        this.dateTime = (new Date(this.dateTime)).setDate(args.day);
      }

      if (undefined !== args.month) {
        this.dateTime = (new Date(this.dateTime)).setMonth(args.month);
      }

      if (undefined !== args.full) {
        this.formatHelper.showFullOutput = args.full;
      }

      return (new ListCommand()).getTableData(args.order);
    }

    getTableData(order: string): string {
      const tableData = {};

      this.start.fromSavedData(this.dateTime);
      this.stop.fromSavedData(this.dateTime);
      this.notes.fromSavedData(this.dateTime);
      this.worklogs.fromSavedData(this.dateTime);

      if (null !== this.start.time) {
        tableData['0_start'] = this.start.getPrintData();
      }

      if (null !== this.stop.time) {
        tableData['1_stop'] = this.stop.getPrintData();
      } else if (null !== this.start.time) {
        tableData['1_stop'] = (new WorkDurationHelper).getEstimatedClockOut(this.start, this.worklogs);
      }

      if (null !== this.start.time && 0 < this.worklogs.getAmount()) {
        tableData['2_workDuration'] = this.workDurationHelper.getWorkDuration(this.start, this.worklogs);
      }

      if (null !== this.notes.entries) {
        tableData['3_notes'] = this.notes.getPrintData();
      }

      if (null !== this.worklogs.entries) {
        tableData['4_worklogs'] = this.worklogs.getCalculatedPrintData(this.start, order);
      }

      return this.formatHelper.toTable(
          Object.keys(tableData).sort().reduce((r, k) => (r[k] = tableData[k], r), {}),
      );
    }
}
