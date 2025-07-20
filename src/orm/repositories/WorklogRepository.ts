import {inject, injectable} from 'inversify';
import {Between, Equal, UpdateResult} from 'typeorm';
import {ConnectionManager} from '../ConnectionManager';
import {TYPES} from '../../identifiers';
import {WorklogEntity} from '../entities/Worklog.entity';

@injectable()
export class WorklogRepository {
  constructor(
    @inject(TYPES.ORM.ConnectionManager) protected readonly connectionManager: ConnectionManager
  ) {}

  public async create(entity: WorklogEntity): Promise<WorklogEntity> {
    const connection = await this.connectionManager.getConnection();
    return connection.getRepository(WorklogEntity).save(entity);
  }
  public async read(id?: string): Promise<WorklogEntity | WorklogEntity[]> {
    const connection = await this.connectionManager.getConnection();
    const repository = connection.getRepository(WorklogEntity);

    if (id && id.length > 0) {
      const result = await repository.findOne({
        where: {id}
      });
      return result || new WorklogEntity();
    } else {
      return repository.find();
    }
  }

  /**
   * Update a worklog entity
   * @param entity - The entity with updated values
   * @return Promise resolving to the updated WorklogEntity
   */
  public async update(entity: WorklogEntity): Promise<WorklogEntity> {
    const connection = await this.connectionManager.getConnection();
    return connection.getRepository(WorklogEntity).save(entity);
  }

  /**
   * Get worklogs by date and iterator
   * @param date - The date to filter by
   * @param iterator - The iterator number to filter by
   * @return Promise resolving to array of matching worklogs
   */
  public async getByDateIterator(date: Date = new Date(), iterator: number): Promise<WorklogEntity[]> {
    const connection = await this.connectionManager.getConnection();
    const dayStart = new Date(date.setHours(0, 0, 0, 0));
    const dayEnd = new Date(date.setHours(24, 59, 59, 0));

    return await connection.getRepository(WorklogEntity).find({
      where: [
        {
          iterator: Equal(iterator),
          deleted: Equal(false),
          time: Between(dayStart, dayEnd)
        }
      ],
      order: {iterator: 'ASC'}
    });
  }

  /**
   * Get all non-deleted worklogs for a specific date
   * @param date - The date to filter by
   * @return Promise resolving to array of non-deleted worklogs
   */
  public async getUndeletedListForDate(date: Date = new Date()): Promise<WorklogEntity[]> {
    const connection = await this.connectionManager.getConnection();
    const dayStart = new Date();
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date();
    dayEnd.setHours(24, 59, 59, 0);

    return await connection.getRepository(WorklogEntity).find({
      where: [
        {
          deleted: Equal(false),
          time: Between(dayStart, dayEnd)
        }
      ],
      order: {time: 'ASC'}
    });
  }
}
