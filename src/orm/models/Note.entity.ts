import {Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne} from 'typeorm';
import {DayEntity} from './Day.entity';

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

  @ManyToOne((type) => DayEntity, (day) => day.notes)
  day: DayEntity;
}
