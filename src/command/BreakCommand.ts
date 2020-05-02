import AbstractCommand from './AbstractCommand';
import DataHelper from '../lib/helper/DataHelper';
import RestCollection from '../struct/collection/RestCollection';
import RestStruct from '../struct/rest';

export default class BreakCommand extends AbstractCommand {
    name = 'rest';
    aliases = ['b'];
    options = [];
    description = 'Add a new rest';

    public execute(): void {
      const restCollection = new RestCollection(),
        rest = new RestStruct(restCollection.getAmount());

      restCollection.addEntry(rest);

      (new DataHelper).writeData(restCollection.getWriteData(), 'stop');

      console.log(rest.time.getHours() + ':' + rest.time.getMinutes());
    }
}
