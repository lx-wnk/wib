import {AbstractRepository} from './AbstractRepository';
import {DayEntity} from '../entities/Day.entity';
import {AbstractEntity} from '../entities/Abstract.entity';
import {injectable} from 'inversify';
import {Between} from 'typeorm';

@injectable()
export class DayRepository extends AbstractRepository {
  public async create(entity: AbstractEntity) {
    const connection = await this.connectionManager.getConnection();

    return connection.getRepository(DayEntity).save(entity);
  }

  public async read(id?: string) {
    this.connectionManager.getConnection().then((con) => {
      if (id.length > 0) {
        // TODO
        // con.getRepository(DayEntity).findOne(id)
      } else {
        // TODO
      }
    });
  }

  public async update(entity: AbstractEntity) {
    const connection = await this.connectionManager.getConnection();

    return connection.getRepository(DayEntity).save(entity);
  }

  public async delete(id: string) {
    const connection = await this.connectionManager.getConnection();

    return connection.getRepository(DayEntity).delete(id);
  }

  public async getByDate(date: Date = new Date()) {
    const connection = await this.connectionManager.getConnection();
    const tmp = new Date(date.setHours(0, 0, 0, 0));

    return await connection.getRepository(DayEntity).find({
      where: [
        {start: Between(tmp.toISOString(), new Date(date.setHours(24, 59, 59, 0)).toISOString())}
      ]
    });
  }
}
