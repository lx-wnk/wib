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
    options = [];

    execute(): string {
      const tableData ={
          '4_worklogs': (new WorklogCollection()).getPrintData(),
          '3_notes': (new NoteCollection()).getPrintData()
        },
        start = (new StartStruct(null)).fromSavedData(),
        stop = (new StopStruct(null)).fromSavedData();

      if (null !== start.time) {
        tableData['0_start'] = start.getPrintData();
      }

      if (null !== stop.time) {
        tableData['1_stop'] = stop.getPrintData();
      }

      if (null !== start.time && null !== stop.time) {
        tableData['2_workDuration'] = (new WorkDurationHelper).getWorkDuration();
      }

      return (new FormatHelper().toTable(
          Object.keys(tableData).sort().reduce((r, k) => (r[k] = tableData[k], r), {})
      ));
    }
}
