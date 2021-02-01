import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { authTests } from '../helpers/auth';

import * as faker from 'faker';
import { initApp } from './course.common';
import { uuidV4Pattern } from '../../src/helpers/uuid';

describe('Course', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await initApp();
  });

  describe('POST /course', () => {
    const makeReq = () => request(app.getHttpServer()).post('/courses');
    const makeAuthorizedReq = () =>
      makeReq().set('X-User-Id', '0be82b06-7ec2-425c-89dd-3e3325eaf4b8');

    authTests(makeReq);

    it('requires non-null name', () => {
      return makeAuthorizedReq()
        .send({})
        .expect(400)
        .expect({
          statusCode: 400,
          message: ['name should not be empty'],
          error: 'Bad Request',
        });
    });

    it('requires non-empty name', () => {
      return makeAuthorizedReq()
        .send({ name: '' })
        .expect(400)
        .expect({
          statusCode: 400,
          message: ['name should not be empty'],
          error: 'Bad Request',
        });
    });

    it('does not allow duplicate names', async () => {
      const name = faker.name.title();
      const sendRequest = () => makeAuthorizedReq().send({ name });

      await sendRequest().expect(201);
      return sendRequest().expect(409).expect({
        statusCode: 409,
        message: 'name must be unique',
      });
    });

    it('creates the course', () => {
      const name = faker.name.title();
      return makeAuthorizedReq()
        .send({ name })
        .expect(201)
        .expect(({ body }) => {
          const { id, ...bodyWithoutId } = body;
          expect(bodyWithoutId).toEqual({
            name,
          });
          expect(id).toMatch(uuidV4Pattern);
        });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
