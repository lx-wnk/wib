import * as Command from 'commander';

class Wib {
    public program: Command.Command;
    private version: string

    constructor() {
      this.program = new Command.Command();
      this.version = require('../package.json').version;

      this.init();
    }

    init(): void {
      this.program.version(`v${this.version}`, '-v, --vers', 'Outputs the current version');

      this.getCommands();
    }

    getCommands(): void {
    }
}
export default new Wib().program;
