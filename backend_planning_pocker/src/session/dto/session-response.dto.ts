import { SessionMode, SessionStatus } from '../../common/models/session.model';
import { PlayerResponseDto } from './player-response.dto';

export class SessionResponseDto {
  id: number;
  userStoryId: number;
  players: PlayerResponseDto[];
  mode: SessionMode;
  votes: Record<string, number | 'cafe'>; // pseudo -> vote
  status: SessionStatus;
}
