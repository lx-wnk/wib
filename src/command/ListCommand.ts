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

    constructor() {
      super();
      this.formatHelper = new FormatHelper();
      this.dateTime = new Date(Date.now()).getTime();
      this.workDurationHelper = new WorkDurationHelper();
    }

    execute(args): string {
      if (args.order === undefined) {
        args.order = WorklogCollection.possibleOrderKeys.time;
      }

      if (!Object.values(WorklogCollection.possibleOrderKeys).includes(args.order)) {
        return Messages.translation('command.list.execution.invalidOrder') + args.order;
      }

      if (undefined !== args.yesterday) {
        this.dateTime = new Date(this.dateTime).setDate(
            (new Date(this.dateTime)).getDate() - 1
        );
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

      return this.getTableData(args.order);
    }

    getTableData(order: string): string {
      const tableData = {},
        start = new StartStruct(null),
        stop = new StopStruct(null),
        notes = new NoteCollection(this.dateTime),
        worklogs = new WorklogCollection(this.dateTime);

      start.fromSavedData(this.dateTime);
      stop.fromSavedData(this.dateTime);

      if (null !== start.time) {
        tableData['0_start'] = start.getPrintData();
      }

      if (null !== stop.time) {
        tableData['1_stop'] = stop.getPrintData();
      } else if (null !== start.time) {
        tableData['1_stop'] = this.workDurationHelper.getEstimatedClockOut(start, worklogs);
      }

      if (null !== start.time && 0 < worklogs.getAmount()) {
        tableData['2_workDuration'] = this.workDurationHelper.getWorkDuration(start, worklogs);
      }

      if (null !== notes.entries) {
        tableData['3_notes'] = notes.getPrintData();
      }

      if (null !== worklogs.entries) {
        tableData['4_worklogs'] = worklogs.getCalculatedPrintData(start, order);
      }

      return this.formatHelper.toTable(
          Object.keys(tableData).sort().reduce((r, k) => (r[k] = tableData[k], r), {}),
      );
    }
}
