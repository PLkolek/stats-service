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
import sequelize from 'sequelize';
import { CourseLifetimeStatistics } from './course-lifetime-statistics.model';

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

@Table({ underscored: true })
//TODO: WithId vs Omit, custom class for this?
export class StudySession
  extends Model<IStudySession, Omit<IStudySession, 'id'>>
  implements IStudySession {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  id!: string;

  @ForeignKey(() => Course as ModelCtor)
  courseId!: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  userId!: string;

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

  public static async getCourseLifetimeStats(
    userId: string,
    courseId: string,
  ): Promise<CourseLifetimeStatistics> {
    const computedStats = await this.findOne({
      attributes: [
        [
          sequelize.fn('SUM', sequelize.col('total_modules_studied')),
          'totalModulesStudied',
        ],
        [sequelize.fn('AVG', sequelize.col('average_score')), 'averageScore'],
        [sequelize.fn('SUM', sequelize.col('time_studied')), 'timeStudied'],
      ],
      where: {
        userId,
        courseId,
      },
    });

    const totalModulesStudied = computedStats?.get('totalModulesStudied');
    const averageScore = computedStats?.get('averageScore');
    const timeStudied = computedStats?.get('timeStudied');
    return {
      totalModulesStudied: totalModulesStudied ? +totalModulesStudied : 0,
      averageScore: averageScore ? +averageScore : null,
      timeStudied: timeStudied ? +timeStudied : 0,
    };
  }
}
