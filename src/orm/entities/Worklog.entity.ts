import {Entity, PrimaryGeneratedColumn, Column, ManyToOne} from 'typeorm';
import {DayEntity} from './Day.entity';

@Entity('WorklogEntity')
export class WorklogEntity {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column('varchar')
  key: string;

  @Column('varchar')
  value: string;

  @Column('date')
  time: Date;

  @Column('boolean', {default: false})
  deleted: boolean;

  @Column('boolean', {default: false})
  rest: boolean;

  @ManyToOne((type) => DayEntity, (day) => day.worklogs)
  day: DayEntity;
}
