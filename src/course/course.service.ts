import {
  IStudySession,
  StudySession,
  StudySessionData,
} from './study-session.model';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Course, CourseData, SavedCourseData } from './course.model';
import { InjectModel } from '@nestjs/sequelize';
import sequelize, { Sequelize, Transaction } from 'sequelize';
import { CourseLifetimeStatistics } from './course-lifetime-statistics.model';

@Injectable()
export class CourseService {
  constructor(
    @InjectModel(Course)
    private readonly courseModel: typeof Course,
    @InjectModel(StudySession)
    private readonly studySessionModel: typeof StudySession,
    private readonly sequelize: Sequelize,
  ) {}

  public async addStudySession(
    userId: string,
    courseId: string,
    studySession: StudySessionData,
  ): Promise<IStudySession> {
    return this.sequelize.transaction(async (transaction) => {
      await this.getCourseOrThrow(courseId, transaction);
      return this.studySessionModel.create({
        ...studySession,
        courseId,
        userId,
      });
    });
  }

  public async createCourse(course: CourseData): Promise<SavedCourseData> {
    return this.sequelize.transaction(
      async (transaction) =>
        await this.courseModel.create(course, { transaction }),
    );
  }

  public async getCourseLifetimeStats(
    userId: string,
    courseId: string,
  ): Promise<CourseLifetimeStatistics> {
    await this.getCourseOrThrow(courseId);
    const computedStats = await this.studySessionModel.findOne({
      //TODO: this should utilize field not column names
      //TODO: move to repository/model
      //TODO: simplify
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

  public async getStudySession(
    userId: string,
    courseId: string,
    sessionId: string,
  ) {
    await this.getCourseOrThrow(courseId);
    //TODO: indexes
    const studySession = await this.studySessionModel.findOne({
      where: {
        id: sessionId,
        courseId,
        userId,
      },
    });
    if (!studySession) {
      throw new NotFoundException(
        `Study session (id=${sessionId}) in course (id=${courseId}) not found`,
      );
    }
    return studySession;
  }

  //TODO: user auth
  private async getCourseOrThrow(courseId: string, transaction?: Transaction) {
    const course = await this.courseModel.findByPk(courseId, { transaction });
    if (!course) {
      throw new NotFoundException(`Course (id=${courseId}) not found`);
    }
    return course;
  }
}
