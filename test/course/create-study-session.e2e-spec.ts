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

  describe('POST /courses/:courseId', () => {
    const makeReq = (courseId: string) =>
      request(app.getHttpServer()).post(`/courses/${courseId}`);

    const makeAuthorizedReq = (courseId: string) =>
      makeReq(courseId).set(
        'X-User-Id',
        '0be82b06-7ec2-425c-89dd-3e3325eaf4b8',
      );

    authTests(() => makeReq('0be82b06-7ec2-425c-89dd-3e3325eaf4b8'));
    idTests('course', (courseId) =>
      makeReq(courseId).send({
        totalModulesStudied: 2,
        averageScore: 2,
        timeStudied: 60,
      }),
    );

    it('requires properly filled object', async () => {
      const courseId = await factory.course();

      return makeAuthorizedReq(courseId)
        .send({})
        .expect(400)
        .expect({
          statusCode: 400,
          message: [
            'totalModulesStudied should not be null or undefined',
            'totalModulesStudied must not be less than 0',
            'averageScore should not be null or undefined',
            'averageScore must not be less than 0',
            'timeStudied should not be null or undefined',
            'timeStudied must not be less than 0',
          ],
          error: 'Bad Request',
        });
    });

    it('creates the study session', async () => {
      const courseId = await factory.course();

      return makeAuthorizedReq(courseId)
        .send({
          totalModulesStudied: 2,
          averageScore: 2,
          timeStudied: 60,
        })
        .expect(201);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
