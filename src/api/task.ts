import axios from 'axios';
import { Task } from '@/type/task';

// 创建任务
export function createTask(data: Task) {
  return axios.post('/task/createTask', {
    ...data,
  });
}

// 获取任务列表
export function getTaskList(projectId: string) {
  return axios.get('/task/getTaskList', {
    params: {
      projectId,
    },
  });
}
// 更新任务
export function updateTaskById(data: Task) {
  return axios.post('/task/updateTaskById', {
    ...data,
  });
}

// 删除任务
export function deleteTaskById(id: string) {
  return axios.get('/task/deleteTaskById', {
    params: {
      id,
    },
  });
}

// 获取任务信息通过id
export function getTaskInfoById(taskId: string) {
  return axios.get('/task/getTaskInfoById', {
    params: {
      taskId,
    },
  });
}

// PM确认
export function pmConfirmed(taskId: string) {
  return axios.get('/task/pmConfirmed', {
    params: {
      taskId,
    },
  });
}

// 开发确认
export function devConfirmed(
  taskId: string,
  data: {
    startDate: number;
    inputRatio: number;
  }
) {
  return axios.post('/task/devConfirmed', {
    taskId,
    ...data,
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
