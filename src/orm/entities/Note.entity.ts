import {Entity, Column} from 'typeorm';
import {AbstractEntity} from './Abstract.entity';

@Entity('NoteEntity')
export class NoteEntity extends AbstractEntity {
  @Column('int')
  iterator: number;

  @Column('varchar')
  value: string;

  @Column('datetime')
  time: Date;

  @Column('boolean', {default: false})
  deleted: boolean;
}
