import {injectable, inject} from 'inversify';
import {ConnectionManager} from '../ConnectionManager';
import {AbstractEntity} from '../entities/Abstract.entity';
import {TYPES} from '../../identifiers';

@injectable()
export abstract class AbstractRepository<T extends AbstractEntity> {
  constructor(
    @inject(TYPES.ORM.ConnectionManager) protected readonly connectionManager: ConnectionManager
  ) {}
}
