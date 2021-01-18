import AbstractCommand from './AbstractCommand';
import FormatHelper from '../helper/FormatHelper';
import WorklogCollection from '../struct/DataStructs/collection/WorklogCollection';
import WorkDurationHelper from '../helper/WorkDurationHelper';
import Messages from '../messages';
import ListDataHelper from '../helper/ListDataHelper';

export default class ListCommand extends AbstractCommand {
  name = 'list';
  aliases = ['l', 'status', 'report'];
  description = Messages.translation('command.list.description');
  options = [
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
    {
      flag: Messages.translation('command.list.option.day.flag'),
      description: Messages.translation('command.list.option.day.description')
    }
  ];

  private formatHelper: FormatHelper;
  private dateTime: number;
  private workDurationHelper: WorkDurationHelper;
  private listDataHelper: ListDataHelper;

  constructor() {
    super();
    this.formatHelper = new FormatHelper();
    this.dateTime = new Date(Date.now()).getTime();
    this.workDurationHelper = new WorkDurationHelper();
    this.listDataHelper = new ListDataHelper();
  }

  execute(args): string {
    if (args.order === undefined) {
      args.order = WorklogCollection.possibleOrderKeys.time;
    }

    if (!Object.values(WorklogCollection.possibleOrderKeys).includes(args.order)) {
      return Messages.translation('command.list.execution.invalidOrder') + args.order;
    }

    if (args.yesterday) {
      this.dateTime = new Date(this.dateTime).setDate(
          (new Date(this.dateTime)).getDate() - 1
      );
    }

    if (args.day) {
      this.dateTime = (new Date(this.dateTime)).setDate(args.day);
    }

    if (args.full) {
      this.formatHelper.showFullOutput = args.full;
    }

    return this.getDayData(args.order);
  }

  getDayData(order: string): string {
    const tableData = this.listDataHelper.getDataForTime(this.dateTime),
      printableData = tableData.getPrintData(order);

    return this.formatHelper.toTable(
        Object.keys(printableData).sort().reduce((r, k) => (r[k] = printableData[k], r), {})
    );
  }
}
