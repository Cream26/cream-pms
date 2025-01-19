import axios from 'axios';
import qs from 'query-string';

export function createTaskInfo(data: {
  taskId: string;
  name: string;
  time: number;
  desc: string;
  implementer: string;
  status?: 'todo' | 'doing' | 'done';
}) {
  return axios.post('/taskInfo/add', {
    ...data,
  });
}

export function getTaskInfoById(taskId: string) {
  return axios.get('/taskInfo/getById', {
    params: {
      taskId,
    },
  });
}

export function updateTaskInfoById(
  id: string,
  doc: {
    name?: string;
    time?: number;
    desc?: string;
    status?: 'todo' | 'doing' | 'done';
    confirmed?: boolean;
  }
) {
  return axios.post('/taskInfo/updateById', {
    id,
    ...doc,
  });
}

export function deleteTaskInfoById(id: string) {
  return axios.post('/taskInfo/deleteById', {
    id,
  });
}

export function getTaskInfoByTaskId(taskId: string) {
  return axios.get('/taskInfo/getByTaskId', {
    params: {
      taskId,
    },
  });
}

export function getDoneTaskAnalysis(data: {
  type?: 'done' | 'unDone';
  memberList: string[];
  startTime: number;
  endTime: number;
}) {
  return axios.post('/taskInfo/getDoneTaskAnalysis', {
    ...data,
  });
}
