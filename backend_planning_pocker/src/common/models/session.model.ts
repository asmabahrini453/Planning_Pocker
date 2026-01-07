
export type SessionMode = 'strict' | 'moyenne';
export type SessionStatus = 'enCours' | 'terminee' | 'pause';



export class Session {
  id: number;
  userStoryId: number;
  players: number[];
  mode: SessionMode;
  votes: Record<number, number | 'cafe'>;
  status: SessionStatus;
  round: number
}
