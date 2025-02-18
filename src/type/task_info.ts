import { User } from './user';

export interface TaskInfo {
  id?: string;
  taskId?: string;
  name: string;
  desc: string;
  time: number;
  implementer: string;
  status: 'todo' | 'doing' | 'done';
  confirmed?: boolean;
  implementerInfo?: User;
}
