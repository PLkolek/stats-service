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

  describe('GET /courses/:courseId/sessions/:sessionId', () => {
    const makeReq = (courseId: string, sessionId: string) =>
      request(app.getHttpServer()).get(
        `/courses/${courseId}/sessions/${sessionId}`,
      );

    const makeAuthorizedReq = (courseId: string, sessionId: string) =>
      makeReq(courseId, sessionId).set(
        'X-User-Id',
        '0be82b06-7ec2-425c-89dd-3e3325eaf4b8',
      );

    authTests(() =>
      makeReq(
        '0be82b06-7ec2-425c-89dd-3e3325eaf4b8',
        '93bf3db7-f9ff-4fce-9a5e-123c159af16f',
      ),
    );
    idTests('course', (courseId) =>
      makeReq(courseId, '93bf3db7-f9ff-4fce-9a5e-123c159af16f'),
    );

    it(`validates if studySessionId is an uuid`, () => {
      return makeReq('0be82b06-7ec2-425c-89dd-3e3325eaf4b8', '1234')
        .set('X-User-Id', '0be82b06-7ec2-425c-89dd-3e3325eaf4b8')
        .expect(400)
        .expect({
          statusCode: 400,
          message: 'Validation failed (uuid  is expected)',
          error: 'Bad Request',
        });
    });

    it(`returns NotFound when studySession belongs to a different course`, async () => {
      const courseId1 = await factory.course();
      const courseId2 = await factory.course();
      const sessionId = await factory.studySession(courseId1, {
        totalModulesStudied: 2,
        averageScore: 2,
        timeStudied: 60,
      });

      return makeReq(courseId2, sessionId)
        .set('X-User-Id', '0be82b06-7ec2-425c-89dd-3e3325eaf4b8')
        .expect(404)
        .expect({
          statusCode: 404,
          message: `Study session (id=${sessionId}) in course (id=${courseId2}) not found`,
          error: 'Not Found',
        });
    });

    it(`returns NotFound when studySession belongs to a different user`, async () => {
      const courseId = await factory.course();
      const sessionId = await factory.studySession(courseId, {
        totalModulesStudied: 2,
        averageScore: 2,
        timeStudied: 60,
      });

      return makeReq(courseId, sessionId)
        .set('X-User-Id', '93bf3db7-f9ff-4fce-9a5e-123c159af16f')
        .expect(404)
        .expect({
          statusCode: 404,
          message: `Study session (id=${sessionId}) in course (id=${courseId}) not found`,
          error: 'Not Found',
        });
    });

    it('retrieves study session', async () => {
      const inputData = {
        totalModulesStudied: 2,
        averageScore: 2,
        timeStudied: 60,
      };

      const courseId = await factory.course();
      const sessionId = await factory.studySession(courseId, inputData);

      console.log(courseId, sessionId);
      return makeAuthorizedReq(courseId, sessionId)
        .expect(200)
        .expect({ id: sessionId, ...inputData });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
