import { inject, injectable } from 'inversify';
import { Between, Equal, FindOperator } from 'typeorm';
import { ConnectionManager } from '../ConnectionManager';
import { TYPES } from '../../identifiers';
import { WorklogEntity } from '../entities/Worklog.entity';
import { DateHelper } from '../../helper';

@injectable()
export class WorklogRepository {
    constructor(@inject(TYPES.ORM.ConnectionManager) protected readonly connectionManager: ConnectionManager) {}

    public async create(entity: WorklogEntity): Promise<WorklogEntity> {
        const connection = await this.connectionManager.getConnection();
        return connection.getRepository(WorklogEntity).save(entity);
    }
    public async read(id?: string): Promise<WorklogEntity | WorklogEntity[]> {
        const connection = await this.connectionManager.getConnection();
        const repository = connection.getRepository(WorklogEntity);

        if (id && id.length > 0) {
            const result = await repository.findOne({
                where: { id }
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
    public async getUndeletedByDateIterator(
        date: Date = new Date(),
        iterator: null | number = null
    ): Promise<WorklogEntity[]> {
        const connection = await this.connectionManager.getConnection();
        const dayStart = DateHelper.setTimeToStartOfDay(date);
        const dayEnd = DateHelper.setTimeToEndOfDay(date);

        const query: Record<string, FindOperator<any>> = {
            deleted: Equal(false),
            time: Between(dayStart, dayEnd)
        };
        let order: Record<string, 'ASC' | 'DESC'> = { time: 'ASC' };

        if (iterator) {
            query.iterator = Equal(iterator);
            order = { iterator: 'ASC' };
        }

        return await connection.getRepository(WorklogEntity).find({
            where: [query],
            order: order
        });
    }
}
