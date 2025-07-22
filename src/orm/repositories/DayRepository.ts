import { inject, injectable } from 'inversify';
import { ConnectionManager } from '../ConnectionManager';
import { TYPES } from '../../identifiers';
import { DayEntity } from '../entities/Day.entity';

@injectable()
export class DayRepository {
    constructor(@inject(TYPES.ORM.ConnectionManager) protected readonly connectionManager: ConnectionManager) {}

    public async upsert(entity: DayEntity): Promise<DayEntity> {
        const connection = await this.connectionManager.getConnection();

        return connection.getRepository(DayEntity).save(entity);
    }

    public async read(id?: string): Promise<DayEntity | DayEntity[]> {
        const connection = await this.connectionManager.getConnection();
        const repository = connection.getRepository(DayEntity);

        if (id && id.length > 0) {
            return await repository.findOneOrFail({ where: { id } });
        }

        return repository.find();
    }

    public async delete(id: string): Promise<void> {
        const connection = await this.connectionManager.getConnection();
        await connection.getRepository(DayEntity).delete(id);
    }

    // Get a day by date, creating a new one if it doesn't exist
    // All dates are stored in UTC
    public async getByDate(date: Date = new Date()): Promise<DayEntity> {
        const connection = await this.connectionManager.getConnection();

        const dayEntity = await connection
            .getRepository(DayEntity)
            .createQueryBuilder('day')
            .where('day.date = :date', {
                date:
                    date.getFullYear() +
                    '-' +
                    String(date.getMonth() + 1).padStart(2, '0') +
                    '-' +
                    String(date.getDate()).padStart(2, '0')
            })
            .getOne();

        if (dayEntity instanceof DayEntity) {
            return dayEntity;
        }

        // Create a new day entity since none was found for the given date
        const newDay = new DayEntity();
        newDay.date = date;

        return newDay;
    }
}
