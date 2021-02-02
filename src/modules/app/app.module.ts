import { Module, ValidationPipe } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_PIPE } from '@nestjs/core';
import { XUserIdHeaderGuard } from './x-user-id-header.guard';
import MySequelizeModule from '../db/sequelize.module';
import { UniqueConstraintExceptionFilter } from './unique-constraint-exception.filter';
import { CourseModule } from '../course/course.module';

@Module({
  imports: [MySequelizeModule, CourseModule],
  controllers: [],
  providers: [
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
