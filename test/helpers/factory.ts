import { StudySessionData } from '../../src/course/model/study.session.model';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import * as faker from 'faker';

export class Factory {
  constructor(private readonly app: INestApplication) {}

  public async course(courseName = faker.name.title()): Promise<string> {
    const courseResponse = await request(this.app.getHttpServer())
      .post('/courses')
      .set('X-User-Id', '0be82b06-7ec2-425c-89dd-3e3325eaf4b8')
      .send({ name: courseName });
    return courseResponse.body.id;
  }

  public async studySession(
    courseId: string,
    data: StudySessionData,
  ): Promise<string> {
    const studySessionResponse = await request(this.app.getHttpServer())
      .post(`/courses/${courseId}`)
      .set('X-User-Id', '0be82b06-7ec2-425c-89dd-3e3325eaf4b8')
      .send(data);
    return studySessionResponse.body.id;
  }
}
