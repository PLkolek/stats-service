import * as supertest from 'supertest';

export const authTests = <Req extends supertest.Test>(makeReq: () => Req) => {
  it('requires X-User-Id header', () => {
    return makeReq().expect(401).expect({
      statusCode: 401,
      message: 'X-User-Id header is required',
      error: 'Unauthorized',
    });
  });

  it('validates if X-User-Id header is an uuid', () => {
    return makeReq().set('X-User-Id', '1234').expect(401).expect({
      statusCode: 401,
      message: "X-User-Id header must be a valid user's UUID",
      error: 'Unauthorized',
    });
  });
};
