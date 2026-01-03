import { BacklogDto } from "backlog/dto/backlog.dto";
import { IsString } from "class-validator";

export class CreateApplicationDto {
  @IsString()
  name: string;

  backlog: BacklogDto; // le backlog importé depuis JSON
}
