import {Entity, PrimaryGeneratedColumn, Column} from 'typeorm';

@Entity('NoteEntity')
export class NoteEntity {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  value: Date;

  @Column()
  time: Date;

  @Column({default: false})
  deleted: boolean;
}
