import { inject, injectable } from 'inversify';
import { Between, Equal, UpdateResult, FindOperator } from 'typeorm';
import { ConnectionManager } from '../ConnectionManager';
import { TYPES } from '../../identifiers';
import { NoteEntity } from '../entities/Note.entity';
import { DateHelper } from '../../helper';

@injectable()
export class NoteRepository {
    constructor(@inject(TYPES.ORM.ConnectionManager) protected readonly connectionManager: ConnectionManager) {}

    public async create(value: string): Promise<NoteEntity> {
        const connection = await this.connectionManager.getConnection();
        const note = new NoteEntity();

        note.value = value;
        note.time = new Date();
        note.iterator = await this.getIteratorNumber();

        return connection.getRepository(NoteEntity).save(note);
    }

    public async read(iteratorNumber?: number): Promise<NoteEntity | NoteEntity[]> {
        const connection = await this.connectionManager.getConnection();
        const repository = connection.getRepository(NoteEntity);

        if (iteratorNumber !== undefined && iteratorNumber.toString().length > 0) {
            const result = await repository.findOne({
                where: { iterator: Equal(iteratorNumber) }
            });
            return result || [];
        }

        return repository.find();
    }

    public async update(iteratorNumber: number, text: string): Promise<UpdateResult> {
        const connection = await this.connectionManager.getConnection();

        return connection.getRepository(NoteEntity).update({ iterator: Equal(iteratorNumber) }, { value: text });
    }

    public async delete(iteratorNumber: number): Promise<UpdateResult> {
        const connection = await this.connectionManager.getConnection();

        return connection.getRepository(NoteEntity).update({ iterator: Equal(iteratorNumber) }, { deleted: true });
    }

    public async getIteratorNumber(): Promise<number> {
        const connection = await this.connectionManager.getConnection();
        return await connection.getRepository(NoteEntity).count();
    }

    public async getUndeletedList(date?: Date): Promise<NoteEntity[]> {
        const connection = await this.connectionManager.getConnection();
        const where: Record<string, FindOperator<any>> = {
            deleted: Equal(false)
        };

        if (date) {
            const startOfDay = DateHelper.setTimeToStartOfDay(date);
            const endOfDay = DateHelper.setTimeToEndOfDay(date);

            where.time = Between(startOfDay, endOfDay);
        }

        return await connection.getRepository(NoteEntity).find({
            where,
            order: { time: 'ASC' }
        });
    }
}
