
export type Role = 'productOwner' | 'employee';

export class User {
  id: number;
  pseudo: string;
  role: Role;
}