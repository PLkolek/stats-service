import { IsNotEmpty } from 'class-validator';
import { Expose } from 'class-transformer';

export class CourseInputDto {
  @IsNotEmpty()
  name!: string;
}

export class CourseOutputDto {
  @Expose()
  id!: string;
  @Expose()
  name!: string;
}
