import { User } from './user';
import { Depart } from './depart';

export interface Project {
  id?: string;
  name: string;
  departId: string;
  projectPMId: string;
  frontendLeadId: string;
  backendLeadId: string;
  ownerId?: string;
  env: string;
}

export interface ProjectDetail extends Project {
  projectPMInfo: User;
  frontendLeadInfo: User;
  backendLeadInfo: User;
  ownerInfo: User;
  departInfo: Depart;
  taskList: any[];
}
