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
}
