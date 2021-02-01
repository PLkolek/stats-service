import * as supertest from 'supertest';
import { capitalize } from 'sequelize-typescript/dist/shared/string';

export const idTests = <Req extends supertest.Test>(
  modelName: string,
  makeReq: (id: string) => Req,
) => {
  it(`validates if ${modelName}Id is an uuid`, () => {
    return makeReq('1234')
      .set('X-User-Id', '0be82b06-7ec2-425c-89dd-3e3325eaf4b8')
      .expect(400)
      .expect({
        statusCode: 400,
        message: 'Validation failed (uuid  is expected)',
        error: 'Bad Request',
      });
  });

  it(`returns NotFound when ${modelName} does not exist`, async () => {
    return makeReq('0be82b06-7ec2-425c-89dd-3e3325eaf4b8')
      .set('X-User-Id', '0be82b06-7ec2-425c-89dd-3e3325eaf4b8')
      .expect(404)
      .expect({
        statusCode: 404,
        //TODO: own capitalize
        message: `${capitalize(
          modelName,
        )} (id=0be82b06-7ec2-425c-89dd-3e3325eaf4b8) not found`,
        error: 'Not Found',
      });
  });
};
