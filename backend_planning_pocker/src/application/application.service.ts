import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { Application } from 'common/models/application.model';
import { User } from 'common/models/user.model';
import { CreateSessionDto } from 'session/dto/create-session.dto';
import { Session } from 'common/models/session.model';

@Injectable()
export class ApplicationService {
  private appFile = path.join(process.cwd(), 'data', 'applications.json');
  private userFile = path.join(process.cwd(), 'data', 'users.json');

  // ---------- utils ----------
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

  // ---------- IMPORT BACKLOG ----------
  importApplicationFromFile(file: Express.Multer.File): Application {
    if (!file) {
      throw new BadRequestException('Fichier JSON requis');
    }

    let data: any;
    try {
      data = JSON.parse(file.buffer.toString());
    } catch {
      throw new BadRequestException('Fichier JSON invalide');
    }

    if (!data.name || !Array.isArray(data.backlog?.userStories)) {
      throw new BadRequestException('Structure du backlog invalide');
    }

    const apps = this.readApplications();

    const newApp: Application = {
      id: apps.length ? apps[apps.length - 1].id + 1 : 1,
      name: data.name,
      backlog: {
        id: Date.now(), // 👈 id unique
        userStories: data.backlog.userStories.map((us, i) => ({
          id: i + 1,
          title: us.title,
          description: us.description,
          status: 'Pending',
          estimation: null,
        })),
      },
      sessions: [],
      createdAt: new Date().toISOString(),
    };

    apps.push(newApp);
    this.writeApplications(apps);

    return newApp;
  }

  // ---------- lecture ----------
  findAll(): Application[] {
    return this.readApplications();
  }

  findById(id: number): Application {
    const app = this.readApplications().find(a => a.id === id);
    if (!app) throw new NotFoundException('Application not found');
    return app;
  }

  // ---------- SESSION ----------
  createSession(appId: number, dto: CreateSessionDto): Session {
    const apps = this.readApplications();
    const app = apps.find(a => a.id === appId);

    if (!app) {
      throw new NotFoundException('Application not found');
    }

    // 🔎 vérifier user story
    const userStory = app.backlog.userStories.find(
      us => us.id === dto.userStoryId,
    );

    if (!userStory) {
      throw new BadRequestException('User story inexistante');
    }

    if (userStory.status !== 'Pending') {
      throw new BadRequestException(
        'Une session existe déjà pour cette user story',
      );
    }

    // 🔎 vérifier joueurs
    const users = this.readUsers();
    const validPlayers = users.filter(
      u => dto.playerIds.includes(u.id) && u.role === 'employee',
    );

    if (validPlayers.length !== dto.playerIds.length) {
      throw new BadRequestException(
        'Tous les joueurs doivent être des employees valides',
      );
    }

    if (dto.playerIds.length < 2) {
      throw new BadRequestException(
        'Une session nécessite au moins deux joueurs',
      );
    }

    const session: Session = {
      id: app.sessions.length
        ? app.sessions[app.sessions.length - 1].id + 1
        : 1,
      userStoryId: dto.userStoryId,
      players: dto.playerIds,
      mode: dto.mode, // strict | moyenne
      votes: {},
      status: 'enCours',
      round: 1, // 🔥 toujours 1 au départ
    };

    app.sessions.push(session);
    userStory.status = 'Pending'; // explicite

    this.writeApplications(apps);
    return session;
  }
}
