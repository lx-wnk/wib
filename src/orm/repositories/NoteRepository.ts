import {AbstractRepository} from './AbstractRepository';
import {injectable} from 'inversify';
import {Between, Equal, UpdateResult} from 'typeorm';
import {NoteEntity} from '../entities/Note.entity';

@injectable()
export class NoteRepository extends AbstractRepository {
  public async create(value: string): Promise<NoteEntity> {
    const connection = await this.connectionManager.getConnection();

    const note = new NoteEntity();
    note.value = value;
    note.time = new Date();
    note.iterator = await this.getIteratorNumber();

    return connection.getRepository(NoteEntity).save(note);
  }

  public async read(iteratorNumber?: number): Promise<NoteEntity|NoteEntity[]> {
    const connection = await this.connectionManager.getConnection();

    if (iteratorNumber.toString().length > 0) {
      return connection.getRepository(NoteEntity).findOne({'iterator': Equal(iteratorNumber)});
    }

    return connection.getRepository(NoteEntity).find();
  }

  public async update(iteratorNumber: number, text: string): Promise<UpdateResult> {
    const connection = await this.connectionManager.getConnection();

    return connection.getRepository(NoteEntity).update(
        {'iterator': Equal(iteratorNumber)},
        {'value': text}
    );
  }

  public async delete(iteratorNumber: number): Promise<UpdateResult> {
    const connection = await this.connectionManager.getConnection();

    return connection.getRepository(NoteEntity).update(
        {'iterator': Equal(iteratorNumber)},
        {'deleted': true}
    );
  }

  public async getIteratorNumber(): Promise<number> {
    const connection = await this.connectionManager.getConnection();

    return await connection.getRepository(NoteEntity).count();
  }

  public async getByDateIterator(date: Date = new Date(), iterator: number): Promise<NoteEntity[]> {
    const connection = await this.connectionManager.getConnection();
    const tmp = new Date(date.setHours(0, 0, 0, 0));

    return await connection.getRepository(NoteEntity).find({
      where: [
        {'day.start': Between(tmp.toISOString(), new Date(date.setHours(24, 59, 59, 0)).toISOString())},
        {iterator: iterator}
      ]
    });
  }

  public async getUndeletedList(): Promise<NoteEntity[]> {
    const connection = await this.connectionManager.getConnection();

    return await connection.getRepository(NoteEntity).find({
      where: [{'deleted': Equal(false)}]
    });
  }
}
