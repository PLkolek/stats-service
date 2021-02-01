import { Expose } from 'class-transformer';

export class CourseLifetimeStatsDto {
  //TODO: class level expose operator?
  @Expose()
  totalModulesStudied!: number;
  @Expose()
  averageScore!: number;
  @Expose()
  timeStudied!: number;
}
