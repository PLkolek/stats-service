import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { CourseLifetimeStatsDto } from './dto/course-lifetime-stats.dto';
import { SessionStudyEventDto } from './dto/session-study-event.dto';
import { CourseService } from './course.service';
import { CourseInputDto, CourseOutputDto } from './dto/course-input.dto';
import { toDto } from '../helpers/dto';
import { StudySessionDto } from './dto/study-session.dto';

@Controller('courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post()
  async createCourse(
    @Headers('X-User-Id') userId: string,
    @Body() course: CourseInputDto,
  ): Promise<CourseOutputDto> {
    const savedCourse = await this.courseService.createCourse(course);
    return toDto(CourseOutputDto, savedCourse);
  }

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
    const studySession = await this.courseService.addStudySession(
      userId,
      courseId,
      sessionStudyEvent,
    );
    return toDto(StudySessionDto, studySession);
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
