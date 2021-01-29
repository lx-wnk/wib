import container from '../config/inversify.config';
import {IDENTIFIERS_MIGRATION} from '../constants/identifiers.migration';
import {injectable} from 'inversify';
import AbstractCommand from './AbstractCommand';
import MigrationInterface from '../migrations/MigrationInterface';

@injectable()
export class MigrateCommand extends AbstractCommand {
  public name = 'migrate';
  public names = ['migrate', 'm']
  public aliases = ['m'];
  public options = [];
  public description = 'TODO';

  exec(): void {
    console.log('START: migration');

    for (const identifier in IDENTIFIERS_MIGRATION) {
      container.get<MigrationInterface>(IDENTIFIERS_MIGRATION[identifier]).migrate();
    }

    console.log('FINISH: migrations');
  }
}
