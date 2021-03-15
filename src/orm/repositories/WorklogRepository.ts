import {AbstractRepository} from './AbstractRepository';
import {WorklogEntity} from '../entities/Worklog.entity';
import {AbstractEntity} from '../entities/Abstract.entity';
import {injectable} from 'inversify';
import {DayEntity} from '../entities/Day.entity';
import {Between} from 'typeorm';
import {start} from 'repl';

@injectable()
export class WorklogRepository extends AbstractRepository {
  public async create(entity: AbstractEntity) {
    const connection = await this.connectionManager.getConnection();

    return connection.getRepository(WorklogEntity).save(entity);
  }

  public read(id?: string) {
    this.connectionManager.getConnection().then((con) => {
      if (id.length > 0) {
        // TODO
        // con.getRepository(WorklogEntity).findOne(id)
      } else {
        // TODO
      }
    });
  }

  public async update(entity: AbstractEntity) {
    const connection = await this.connectionManager.getConnection();

    return connection.getRepository(WorklogEntity).save(entity);
  }

  public async delete(id: string) {
  //  TODO
  }

  public async getByDateIterator(date: Date = new Date(), iterator: number) {
    const connection = await this.connectionManager.getConnection();
    const tmp = new Date(date.setHours(0, 0, 0, 0));

    return await connection.getRepository(WorklogEntity).find({
      where: [
        {'day.start': Between(tmp.toISOString(), new Date(date.setHours(24, 59, 59, 0)).toISOString())},
        {iterator: iterator}
      ]
    });
  }
}
