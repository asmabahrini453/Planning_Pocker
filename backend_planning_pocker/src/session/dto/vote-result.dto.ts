import { SessionStatus } from '../../common/models/session.model';

export class VoteResultDto {
  status: SessionStatus;
  round: number;
  votes: {};
}
