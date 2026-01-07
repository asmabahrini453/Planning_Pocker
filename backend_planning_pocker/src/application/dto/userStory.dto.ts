import { IsString } from 'class-validator';

export class UserStoryDto {
  @IsString()
  title: string;

  @IsString()
  description: string;
}
