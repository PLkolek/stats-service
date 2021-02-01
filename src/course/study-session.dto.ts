import { Expose } from 'class-transformer';

export class StudySessionDto {
  @Expose()
  id: string;
  @Expose()
  totalModulesStudied: number;
  @Expose()
  averageScore: number;
  @Expose()
  timeStudied: number;
}
