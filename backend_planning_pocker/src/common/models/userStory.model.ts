export type UserStoryStatus = 'Pending' | 'Estimated' | 'Paused';

export class UserStory {
  id: number;
  title: string;
  description: string;
  status: UserStoryStatus;
  estimation?: number | null;
}
