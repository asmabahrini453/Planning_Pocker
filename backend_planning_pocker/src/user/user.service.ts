import { Injectable } from '@nestjs/common';
import { User } from '../common/models/user.model';
import { UserDto } from './dto/user.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UserService {
  private filePath = path.join(process.cwd(), 'data', 'users.json');

  private readUsers(): User[] {
    if (!fs.existsSync(this.filePath)) return [];
    const data = fs.readFileSync(this.filePath, 'utf-8');
    return JSON.parse(data) as User[];
  }

  private writeUsers(users: User[]): void {
    fs.writeFileSync(this.filePath, JSON.stringify(users, null, 2));
  }
  createUser(dto: UserDto): User {
    const users = this.readUsers();
    const newUser: User = {
      id: users.length ? users[users.length - 1].id + 1 : 1, // auto increment id
      ...dto,
    };
    users.push(newUser);
    this.writeUsers(users);
    return newUser;
  }
  findAll(): User[] {
    return this.readUsers();
  }

  findById(id: number): User | null {
    return this.readUsers().find((u) => u.id === id) || null;
  }
}
