import { Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { Application } from '../common/models/application.model';
import { VoteSessionDto } from './dto/vote-session.dto';
import { SessionResponseDto } from './dto/session-response.dto';
import { User } from '../common/models/user.model';
import { VoteResultDto } from './dto/vote-result.dto';

@Injectable()
export class SessionService {
  private appFile = path.join(process.cwd(), 'data', 'applications.json');
  private userFile = path.join(process.cwd(), 'data', 'users.json');

  private readApplications(): Application[] {
    if (!fs.existsSync(this.appFile)) return [];
    return JSON.parse(fs.readFileSync(this.appFile, 'utf-8'));
  }

  private writeApplications(apps: Application[]) {
    fs.writeFileSync(this.appFile, JSON.stringify(apps, null, 2));
  }

  private readUsers(): User[] {
    if (!fs.existsSync(this.userFile)) return [];
    return JSON.parse(fs.readFileSync(this.userFile, 'utf-8'));
  }

  // ---------- vote ----------
 vote(appId: number, sessionId: number, dto: VoteSessionDto): VoteResultDto {
  const apps = this.readApplications();
  const app = apps.find(a => a.id === appId);
  if (!app) throw new NotFoundException('Application not found');

  const session = app.sessions.find(s => s.id === sessionId);
  if (!session) throw new NotFoundException('Session not found');

  if (!session.players.includes(dto.userId)) {
    throw new Error('User not allowed in this session');
  }

  session.votes[dto.userId] = dto.vote;

  // ☕ pause café
  if (
    Object.keys(session.votes).length === session.players.length &&
    Object.values(session.votes).every(v => v === 'cafe')
  ) {
    session.status = 'pause';
  }

  this.writeApplications(apps);

  return {
    status: session.status,
    round: session.round,
    votes: {},
  };
}


  // ---------- mapping ----------
  private mapToResponse(session): SessionResponseDto {
    const users = this.readUsers();

    const players = session.players.map(id => {
      const user = users.find(u => u.id === id);
      return { id, pseudo: user?.pseudo || 'Unknown' };
    });

    const votes: Record<string, number | 'cafe'> = {};
    Object.entries(session.votes).forEach(([uid, vote]) => {
      const user = users.find(u => u.id === Number(uid));
      if (user) votes[user.pseudo] != vote;
    });

    return {
      id: session.id,
      userStoryId: session.userStoryId,
      players,
      mode: session.mode,
      votes,
      status: session.status,
    };
  }
}
