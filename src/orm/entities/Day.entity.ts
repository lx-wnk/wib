import {Entity, Column, OneToMany} from 'typeorm';
import {WorklogEntity} from './Worklog.entity';
import {AbstractEntity} from './Abstract.entity';

@Entity('DayEntity')
export class DayEntity extends AbstractEntity {
  @Column('date', {unique: true, nullable: false})
    date: Date;

  @Column('datetime', {nullable: false})
    start: Date;

  @Column('datetime', {nullable: true, default: null})
    finish?: Date;

  @OneToMany(() => WorklogEntity, (worklog) => worklog.day, {cascade: true})
    worklogs: WorklogEntity[];
}
