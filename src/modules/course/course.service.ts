import {
  IStudySession,
  StudySessionData,
  StudySession,
} from './model/study.session.model';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ICourse, Course } from './model/course.model';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize, Transaction } from 'sequelize';
import { CourseLifetimeStatistics } from './model/course-lifetime-statistics.model';
import { Saved } from '../../helpers/types';

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
  ): Promise<Saved<IStudySession>> {
    return this.sequelize.transaction(async (transaction) => {
      await this.getCourseOrThrow(courseId, transaction);
      return this.studySessionModel.create({
        ...studySession,
        courseId,
        userId,
      });
    });
  }

  public async createCourse(course: ICourse): Promise<Saved<ICourse>> {
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
    return this.studySessionModel.getCourseLifetimeStats(userId, courseId);
  }

  public async getStudySession(
    userId: string,
    courseId: string,
    sessionId: string,
  ): Promise<Saved<IStudySession>> {
    await this.getCourseOrThrow(courseId);
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

  private async getCourseOrThrow(
    courseId: string,
    transaction?: Transaction,
  ): Promise<Saved<ICourse>> {
    const course = await this.courseModel.findByPk(courseId, { transaction });
    if (!course) {
      throw new NotFoundException(`Course (id=${courseId}) not found`);
    }
    return course;
  }
}
