import { Expose } from 'class-transformer';

export class CourseLifetimeStatsDto {
  @Expose()
  totalModulesStudied!: number;
  @Expose()
  averageScore!: number;
  @Expose()
  timeStudied!: number;
}
