import {Entity, Column, ManyToOne} from 'typeorm';
import {DayEntity} from './Day.entity';
import {AbstractEntity} from './Abstract.entity';

@Entity('WorklogEntity')
export class WorklogEntity extends AbstractEntity {
  @Column('int')
  iterator: number;

  @Column('varchar')
  key: string;

  @Column('varchar')
  value: string;

  @Column('datetime')
  time: Date;

  @Column('boolean', {default: false})
  deleted: boolean;

  @Column('boolean', {default: false})
  rest: boolean;

  @ManyToOne((type) => DayEntity, (day) => day.worklogs)
  day: DayEntity;
}
