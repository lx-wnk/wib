import {injectable} from 'inversify';
import {Connection, createConnection, getConnection} from 'typeorm';
import config from '../ormconfig';

@injectable()
export class ConnectionManager {
  public connection: Connection;
  public entityManager;

  public async getConnection(): Promise<Connection> {
    try {
      return await getConnection();
    } catch (ConnectionNotFoundError) {
      return await this.createConnection();
    }
  }

  protected async createConnection(): Promise<Connection> {
    return await createConnection(config);
  }
}
