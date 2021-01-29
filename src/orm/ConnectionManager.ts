import {injectable} from 'inversify';
import {Connection, createConnection, getConnectionManager} from 'typeorm';
import {homedir} from 'os';

@injectable()
export class ConnectionManager {
  public connection: Connection;
  public entityManager;

  public async create() {
    return await createConnection({
      type: 'sqlite',
      database: homedir + '/.wib/' + 'database.sqlite',
      entities: [__dirname + '/../**/**.entity{.ts,.js}'],
      migrationsTableName: 'migrations',
      migrations: [__dirname + '/../**/**.migration{.ts,.js}'],
      cli: {
        migrationsDir: 'migration'
      }
    });
  }

  private getHomeDir(): string {
    return homedir + '/.wib/';
  }
}
