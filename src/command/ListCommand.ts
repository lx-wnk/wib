import AbstractCommand from './AbstractCommand';
import StartStruct from '../struct/start';
import StopStruct from '../struct/stop';
import FormatHelper from '../lib/helper/FormatHelper';
import WorklogCollection from '../struct/collection/WorklogCollection';
import WorkDurationHelper from '../lib/helper/WorkDurationHelper';
import NoteCollection from '../struct/collection/NoteCollection';

export default class ListCommand extends AbstractCommand {
    name = 'list';
    aliases = ['l', 'status', 'report'];
    description = 'Show the report';
    options = [
      {
        flag: '-d, --day <day>',
        description: 'List a specific date'
      },
      {
        flag: '-m, --month <month>',
        description: 'Date from specific month'
      }
    ];

    execute(args): string {
      let date = (new Date()).getTime();

      if (undefined !== args.day) {
        date = (new Date(date)).setDate(args.day);
      }

      if (undefined !== args.month) {
        date = (new Date(date)).setMonth(args.month);
      }

      return (new ListCommand()).getTableData(date);
    }

    getTableData(date?: number): string {
      const start = (new StartStruct(null)),
        stop = (new StopStruct(null)),
        notes = (new NoteCollection()),
        worklogs = (new WorklogCollection()),
        tableData = {};

      if (date === undefined) {
        start.fromSavedData();
        stop.fromSavedData();
        notes.fromSavedData();
        worklogs.fromSavedData();
      } else {
        start.fromSavedData(date);
        stop.fromSavedData(date);
        notes.fromSavedData(date);
        worklogs.fromSavedData(date);
      }

      if (null !== start.time) {
        tableData['0_start'] = start.getPrintData();
      }

      if (null !== stop.time) {
        tableData['1_stop'] = stop.getPrintData();
      }

      if (null !== notes.entries) {
        tableData['3_notes'] = notes.getPrintData();
      }

      if (null !== worklogs.entries) {
        tableData['4_worklogs'] = worklogs.getCalculatedPrintData(start);
      }

      if (null !== start.time && null !== stop.time && null !== worklogs.entries) {
        tableData['2_workDuration'] = (new WorkDurationHelper).getWorkDuration(start, stop, worklogs);
      }

      return (new FormatHelper().toTable(
          Object.keys(tableData).sort().reduce((r, k) => (r[k] = tableData[k], r), {})
      ));
    }
}
