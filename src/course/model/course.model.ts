import {
  Column,
  DataType,
  HasMany,
  Model,
  ModelCtor,
  Table,
} from 'sequelize-typescript';
import { StudySession } from './study.session.model';
import { Saved } from '../../helpers/types';

export interface ICourse {
  name: string;
}

@Table({ underscored: true })
export class Course
  extends Model<Saved<ICourse>, ICourse>
  implements Saved<ICourse> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  id!: string;

  @Column({ type: DataType.STRING, unique: true })
  name!: string;

  @HasMany(() => StudySession as ModelCtor)
  studySessions!: StudySession[];
}
