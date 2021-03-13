import {Entity, PrimaryGeneratedColumn, Column} from 'typeorm';

@Entity('NoteEntity')
export class NoteEntity {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column('varchar')
  value: string;

  @Column('date')
  time: Date;

  @Column('boolean', {default: false})
  deleted: boolean;
}
