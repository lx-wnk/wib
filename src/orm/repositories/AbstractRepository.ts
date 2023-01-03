import {inject, injectable} from 'inversify';
import {IDENTIFIERS} from '../../identifiers';
import {ConnectionManager} from '../ConnectionManager';

@injectable()
export abstract class AbstractRepository {
  protected connectionManager: ConnectionManager;

  constructor(@inject(IDENTIFIERS.ORM.Connection) connectionManager: ConnectionManager) {
    this.connectionManager = connectionManager;
  }
}
