import { IsDefined, Min } from 'class-validator';

export class SessionStudyEventDto {
  @IsDefined()
  @Min(0)
  totalModulesStudied: number;

  @Min(0)
  @IsDefined()
  averageScore: number;

  @Min(0)
  @IsDefined()
  timeStudied: number;
}
