import { Backlog } from "./backlog.model";
import { Session } from "./session.model";

export class  Application {
    id: number;
  name: string;
  backlog: Backlog;
  sessions: Session[];
  createdAt: string;
}