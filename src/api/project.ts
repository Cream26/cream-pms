import axios from 'axios';
import qs from 'query-string';

export function createProject(data: {
  name: string;
  pmUser: string;
  feUser?: string;
  beUser?: string;
  envLink?: string;
}) {
  return axios.post('/project/add', {
    ...data,
  });
}

export function updateProjectById(
  id: string,
  data: {
    name: string;
    pmUser: string;
    feUser?: string;
    beUser?: string;
    envLink?: string;
  }
) {
  return axios.post('/project/updateById', {
    ...data,
    id,
  });
}

export function addCodeStoreById(data: {
  projectId: string;
  codeStoreItem: {
    storeName: string;
    storeAddress: string;
    mainBranch: string;
  };
}) {
  return axios.post('/project/addCodeStoreById', {
    ...data,
  });
}

export function getProjectById(projectId: string) {
  return axios.get('/project/getById', {
    params: {
      projectId,
    },
  });
}

export function getProjectPageList() {
  return axios.get('/project/get', {
    params: {},
  });
}
