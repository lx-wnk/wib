import {ConnectionOptions} from 'typeorm';
import {homedir} from 'os';

const config: ConnectionOptions = {
  type: 'sqlite',
  database: homedir + '/.wib/' + 'database.sqlite',
  logging: 'all',
  entities: [__dirname + '/**/**.entity{.ts,.js}'],
  migrationsTableName: 'migrations',
  migrations: [__dirname + '/orm/migrations/*-*{.ts,.js}'],
  cli: {
    migrationsDir: 'src/orm/migrations'
  }
};

export = config;
