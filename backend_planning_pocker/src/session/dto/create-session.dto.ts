import { SessionMode } from '../../common/models/session.model';

export class CreateSessionDto {
  userStoryId: number;
  playerIds: number[]; // users avec role = employee
  mode: SessionMode;   // 'strict' | 'moyenne'
}
