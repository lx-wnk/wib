import AbstractCommand from './AbstractCommand';

export default class ListCommand extends AbstractCommand {
    name = 'list';
    aliases = [
      'l', 'status', 'report'
    ];
    description = 'Show the list of notes and tracked times';
    options = [];

    execute(): void {
      // TODO
      console.log('listCommand');
    }
}
