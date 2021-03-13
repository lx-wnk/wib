import {injectable} from 'inversify';
import {Connection, createConnection} from 'typeorm';
import config from '../ormconfig';

@injectable()
export class ConnectionManager {
  public connection: Connection;
  public entityManager;

  public async create() {
    return await createConnection(config);
  }
}
