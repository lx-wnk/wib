import {ConnectionOptions} from 'typeorm';
import {homedir} from 'os';

const config: ConnectionOptions = {
  type: 'sqlite',
  database: homedir + '/.wib/' + 'database.sqlite',
  entities: [__dirname + '/../**/**.entity{.ts,.js}'],
  migrationsTableName: 'migrations',
  migrations: [__dirname + '/../**/**.migration{.ts,.js}'],
  cli: {
    migrationsDir: 'src/orm/migrations'
  }
};

export = config;
