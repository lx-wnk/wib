import {Entity, PrimaryGeneratedColumn, Column, OneToMany} from 'typeorm';
import {NoteEntity} from './Note.entity';
import {WorklogEntity} from './Worklog.entity';

@Entity('DayEntity')
export class DayEntity {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  start: Date;

  @Column()
  finish?: Date;

  @OneToMany((type) => NoteEntity, (worklog) => worklog.day)
  notes: NoteEntity;

  @OneToMany((type) => WorklogEntity, (worklog) => worklog.day)
  worklogs: WorklogEntity;
}
