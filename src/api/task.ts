import axios from 'axios';
import qs from 'query-string';

export function createTask(data: {
  projectId: string;
  name: string;
  type: string;
  jira: string;
  expectDate?: string;
  feUserList?: string[];
  beUserList?: string[];
}) {
  return axios.post('/task/add', {
    ...data,
  });
}

export function updateTaskById(
  id: string,
  data: {
    name: string;
    type: string;
    jira: string;
    expectDate?: string;
    feUserList?: string[];
    beUserList?: string[];
  }
) {
  return axios.post('/task/updateById', {
    ...data,
    id,
  });
}

export function getTaskByPage({ projectId }: { projectId: string }) {
  return axios.get('/task/get', {
    params: {
      projectId,
    },
  });
}

export function getByProjectId({ projectId }: { projectId: string }) {
  return axios.get('/task/getByProjectId', {
    params: {
      projectId,
    },
  });
}

export function getTaskById(projectId: string) {
  return axios.get('/task/getById', {
    params: {
      projectId,
    },
  });
}

export function getByDevId(devId: string) {
  return axios.get('/task/getByDevId', {
    params: {
      devId,
    },
  });
}

export function deleteTaskById(taskId: string) {
  return axios.get('/task/deleteById', {
    params: {
      taskId,
    },
  });
}

export function pmConfirmed(taskId: string) {
  return axios.post('/task/pmConfirmed', {
    taskId,
  });
}

export function devConfirmed(
  taskId: string,
  data: {
    startDate: number;
    inputRatio: number;
  }
) {
  return axios.post('/task/devConfirm', {
    taskId,
    ...data,
  });
}

export function startDev(taskId: string) {
  return axios.post('/task/startDev', {
    taskId,
  });
}

export function devDone(taskId: string) {
  return axios.post('/task/devDone', {
    taskId,
  });
}
