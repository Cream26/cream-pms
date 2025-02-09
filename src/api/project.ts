import axios from 'axios';
import { Project, CodeStoreItem } from '@/type/project';

// 创建项目
export function createProject(data: Project) {
  return axios.post('/project/createProject', {
    ...data,
  });
}

// 获取所有项目
export function getAllProject() {
  return axios.get('/project/getAllProject');
}

// 获取项目详情
export function getProjectById(projectId: string) {
  return axios.get('/project/getProjectDetailById', {
    params: {
      projectId,
    },
  });
}

// 更新项目详情
export function updateProjectById(
  projectId: string,
  data: {
    name: string;
    departId: string;
    projectPMId: string;
    frontendLeadId: string;
    backendLeadId: string;
    env?: string;
  }
) {
  return axios.post('/project/updateProjectById', {
    projectId,
    ...data,
  });
}

export function addCodeStoreById(data: {
  projectId: string;
  codeStoreItem: CodeStoreItem;
}) {
  return axios.post('/project/addCodeStoreById', {
    ...data,
  });
}

// 更新项目仓库
export function updateCodeStoreById(data: {
  projectId: string;
  codeStoreItem: CodeStoreItem;
}) {
  return axios.post('/project/updateCodeStoreById', {
    ...data,
  });
}

export function getProjectPageList() {
  return axios.get('/project/get', {
    params: {},
  });
}
