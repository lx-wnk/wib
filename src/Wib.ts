import * as Command from 'commander';
import ListCommand from './command/ListCommand';
import StartCommand from './command/StartCommand';
import StopCommand from './command/StopCommand';
import RestCommand from './command/RestCommand';
import WorklogCommand from './command/WorklogCommand';

class Wib {
    public program: Command.Command;
    private version: string

    constructor() {
      this.program = new Command.Command();
      this.version = require('../package.json').version;

      this.init();
    }

    init(): void {
      this.program.version(`v${this.version}`, '-v, --vers', 'output the current version');

      this.getCommands();
    }

    getCommands(): void {
      this.program.addCommand((new StartCommand()).init());
      this.program.addCommand((new StopCommand()).init());
      this.program.addCommand((new ListCommand()).init());
      this.program.addCommand((new RestCommand()).init());
      this.program.addCommand((new WorklogCommand()).init());
    }
}
export default new Wib().program;
