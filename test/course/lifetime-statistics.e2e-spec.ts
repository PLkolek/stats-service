import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { authTests } from '../helpers/auth';
import { initApp } from './course.common';
import { idTests } from '../helpers/id';
import { Factory } from '../helpers/factory';

describe('Course', () => {
  let app: INestApplication;
  let factory: Factory;

  beforeAll(async () => {
    app = await initApp();
    factory = new Factory(app);
  });

  describe(`GET /course/:id`, () => {
    const makeReq = (courseId: string) =>
      request(app.getHttpServer()).get(`/courses/${courseId}`);

    const makeAuthorizedReq = (courseId: string) =>
      makeReq(courseId).set(
        'X-User-Id',
        '0be82b06-7ec2-425c-89dd-3e3325eaf4b8',
      );

    authTests(() => makeReq('0be82b06-7ec2-425c-89dd-3e3325eaf4b8'));
    idTests('course', makeReq);

    it('returns sensible results for no sessions', async () => {
      const courseId = await factory.course();

      return makeAuthorizedReq(courseId).expect(200).expect({
        totalModulesStudied: 0,
        averageScore: null,
        timeStudied: 0,
      });
    });

    it('returns aggregates values from all user sessions', async () => {
      const courseId = await factory.course();

      await factory.studySession(courseId, {
        totalModulesStudied: 1,
        averageScore: 5,
        timeStudied: 120,
      });

      await factory.studySession(courseId, {
        totalModulesStudied: 2,
        averageScore: 2,
        timeStudied: 60,
      });

      return makeAuthorizedReq(courseId).expect(200).expect({
        totalModulesStudied: 3,
        averageScore: 3,
        timeStudied: 180,
      });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
