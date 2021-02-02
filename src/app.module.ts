import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CourseController } from './course/course.controller';
import { APP_FILTER, APP_GUARD, APP_PIPE } from '@nestjs/core';
import { XUserIdHeaderGuard } from './auth/x-user-id-header.guard';
import MySequelizeModule from './db/sequelize.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { StudySession } from './course/study-session.model';
import { Course } from './course/course.model';
import { CourseService } from './course/course.service';
import { UniqueConstraintExceptionFilter } from './exception-filters/unique-constraint-exception.filter';

//TODO: separate module for courses
@Module({
  imports: [
    MySequelizeModule,
    SequelizeModule.forFeature([StudySession]),
    SequelizeModule.forFeature([Course]),
  ],
  controllers: [AppController, CourseController],
  providers: [
    AppService,
    CourseService,
    {
      provide: APP_GUARD,
      useClass: XUserIdHeaderGuard,
    },
    {
      provide: APP_FILTER,
      useClass: UniqueConstraintExceptionFilter,
    },
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}
