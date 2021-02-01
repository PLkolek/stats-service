import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { CourseLifetimeStatsDto } from './course-lifetime-stats.dto';
import { SessionStudyEventDto } from './session-study-event.dto';
import { CourseService } from './course.service';
import { CourseInputDto, CourseOutputDto } from './course-input.dto';
import { toDto } from '../helpers/dto';
import { StudySessionDto } from './study-session.dto';

@Controller('courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  //TODO: add swagger?

  @Post()
  async createCourse(
    @Headers('X-User-Id') userId: string,
    @Body() course: CourseInputDto,
  ): Promise<CourseOutputDto> {
    const savedCourse = await this.courseService.createCourse(course);
    return toDto(CourseOutputDto, savedCourse);
  }

  //TODO: add parameter in exception
  //TODO: custom type for user and course id?
  @Get(':courseId')
  async getCourseLifetimeStatistics(
    @Param('courseId', ParseUUIDPipe) courseId: string,
    @Headers('X-User-Id') userId: string,
  ): Promise<CourseLifetimeStatsDto> {
    const courseLifetimeStats = await this.courseService.getCourseLifetimeStats(
      userId,
      courseId,
    );
    return toDto(CourseLifetimeStatsDto, courseLifetimeStats);
  }

  @Post(':courseId')
  async saveStudySession(
    @Param('courseId', ParseUUIDPipe) courseId: string,
    @Headers('X-User-Id') userId: string,
    @Body() sessionStudyEvent: SessionStudyEventDto,
  ): Promise<StudySessionDto> {
    return await this.courseService.addStudySession(
      userId,
      courseId,
      sessionStudyEvent,
    );
  }

  @Get(':courseId/sessions/:sessionId')
  async getStudySession(
    @Param('courseId', ParseUUIDPipe) courseId: string,
    @Param('sessionId', ParseUUIDPipe) sessionId: string,
    @Headers('X-User-Id') userId: string,
  ): Promise<StudySessionDto> {
    const studySession = await this.courseService.getStudySession(
      userId,
      courseId,
      sessionId,
    );
    return toDto(StudySessionDto, studySession);
  }
}
