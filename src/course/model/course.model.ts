import {
  Column,
  DataType,
  HasMany,
  Model,
  ModelCtor,
  Table,
} from 'sequelize-typescript';
import { StudySession } from './study-session.model';
import { WithId } from '../../helpers/types';

//TODO: fight that boilerplate
export interface CourseData {
  name: string;
}

export type SavedCourseData = WithId<CourseData>;

@Table({ underscored: true })
export class Course extends Model<CourseData> implements CourseData {
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
