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
import { CourseLifetimeStatistics } from './course-lifetime-statistics.model';
import { Saved } from '../../../helpers/types';
import { QueryTypes } from 'sequelize';

export interface StudySessionData {
  totalModulesStudied: number;
  averageScore: number;
  timeStudied: number;
}

export interface IStudySession extends StudySessionData {
  userId: string;
  courseId: string;
}

@Table({ underscored: true })
export class StudySession
  extends Model<Saved<IStudySession>, IStudySession>
  implements Saved<IStudySession> {
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
    const results = await this.sequelize?.query(
      {
        query: `
      SELECT SUM(total_modules_studied) AS total_modules_studied,
             SUM(average_score*total_modules_studied) / SUM(total_modules_studied) AS average_score,
             SUM(time_studied) AS time_studied
      FROM study_sessions
      WHERE user_id = ? AND course_id = ?`,
        values: [userId, courseId],
      },
      { type: QueryTypes.SELECT },
    );
    const computedStats = results?.[0] as any;

    const totalModulesStudied = computedStats?.total_modules_studied;
    const averageScore = computedStats?.average_score;
    const timeStudied = computedStats?.time_studied;
    return {
      totalModulesStudied: totalModulesStudied ? +totalModulesStudied : 0,
      averageScore: averageScore ? +averageScore : null,
      timeStudied: timeStudied ? +timeStudied : 0,
    };
  }
}
