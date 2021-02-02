import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';
import { StudySession } from './model/study-session.model';
import { Course } from './model/course.model';

@Module({
  imports: [
    SequelizeModule.forFeature([StudySession]),
    SequelizeModule.forFeature([Course]),
  ],
  controllers: [CourseController],
  providers: [CourseService],
})
export class CourseModule {}
