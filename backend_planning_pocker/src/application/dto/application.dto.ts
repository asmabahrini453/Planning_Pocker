import { IsString } from "class-validator";
import { BacklogDto } from "./backlog.dto";

export class ApplicationDto {
  @IsString()
  name: string;

  backlog: BacklogDto; // le backlog importé depuis JSON
}
