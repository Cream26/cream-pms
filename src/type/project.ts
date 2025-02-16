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

export interface CodeStoreItem {
  storeName: string;
  uid: string;
  storeAddress: string;
  mainBranch: string;
  nodeVersion: string;
  remark?: string;
  jenkins?: string;
}

export interface ProjectDetail extends Project {
  projectPMInfo: User | null;
  frontendLeadInfo: User | null;
  backendLeadInfo: User | null;
  ownerInfo: User | null;
  departInfo: Depart | null;
  taskList?: any[];
  codeStoreList?: CodeStoreItem[];
}
