import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  ModelCtor,
  Table,
} from 'sequelize-typescript';
import { Course } from './course.model';

export interface StudySessionData {
  totalModulesStudied: number;
  averageScore: number;
  timeStudied: number;
}

//TODO: fight that boilerplate
export interface IStudySession extends StudySessionData {
  id: string;
  userId: string;
  courseId: string;
}

//TODO: custom decorator
@Table({ underscored: true })
//TODO: WithId vs Omit, custom class for this?
export class StudySession
  extends Model<IStudySession, Omit<IStudySession, 'id'>>
  implements IStudySession {
  //TODO: additional decorators

  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  id!: string;

  //TODO: cast
  @ForeignKey(() => Course as ModelCtor)
  courseId!: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  userId!: string;

  //TODO: cast
  @BelongsTo(() => Course as ModelCtor)
  course!: Course;

  @Column(DataType.INTEGER)
  totalModulesStudied!: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    get() {
      // TODO: Workaround until sequelize issue #8019 is fixed
      const value = this.getDataValue('averageScore');
      return value === null ? null : parseFloat(value);
    },
  })
  averageScore!: number;

  @Column(DataType.INTEGER)
  timeStudied!: number;
}
