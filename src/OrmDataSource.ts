import { DataSource, DataSourceOptions } from 'typeorm';
import { homedir } from 'os';
import * as path from 'path';
import * as fs from 'fs';

// Ensure the .wib directory exists
const wibDir = path.join(homedir(), '.wib');
if (!fs.existsSync(wibDir)) {
    fs.mkdirSync(wibDir, { recursive: true });
}

const config: DataSourceOptions = {
    type: 'sqlite',
    database: path.join(homedir(), '.wib', 'database.sqlite'),
    logging: ['error', 'schema'],
    entities: [__dirname + '/**/**.entity{.ts,.js}'],
    migrationsTableName: 'migrations',
    migrations: [__dirname + '/orm/migrations/*-*{.ts,.js}'],
    migrationsRun: false,
    synchronize: true
};

// Create and export the DataSource instance
const dataSource = new DataSource(config);

export default dataSource;
