import {Entity, PrimaryGeneratedColumn, Column, ManyToOne} from 'typeorm';
import {DayEntity} from './Day.entity';

@Entity('WorklogEntity')
export class WorklogEntity {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  key: string;

  @Column()
  value: string;

  @Column()
  time: Date;

  @Column({default: false})
  deleted: boolean;

  @Column({default: false})
  rest: boolean;

  @ManyToOne((type) => DayEntity, (day) => day.worklogs)
  day: DayEntity;
}
