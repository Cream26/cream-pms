import { TaskInfo } from './task_info';
import { User } from './user';

export interface Task {
  id?: string;
  projectId?: string;
  taskName: string;
  taskType: 'feature' | 'bug' | 'hotfix' | 'other' | undefined;
  jiraAddress: string;
  prdAddress: string;
  frontEndDevelopsIds: string[];
  backEndDevelopsIds: string[];
  expectLaunchTime: string;
  developerMap?: any;
  taskInfoList?: TaskInfo[];
}
export interface TaskDetail extends Task {
  frontEndDevelops: User[];
  backEndDevelops: User[];
}
