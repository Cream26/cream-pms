import axios from 'axios';
import { TaskInfo } from '@/type/task_info';

// 创建任务详情
export function createTaskInfo(data: TaskInfo) {
  return axios.post('/taskInfo/createTaskInfo', {
    ...data,
  });
}

// 更新任务明细
export function updateTaskInfoById(id: string, data: TaskInfo) {
  return axios.post('/taskInfo/updateTaskInfoById', {
    id,
    ...data,
  });
}

// 获取任务明细列表
export function getTaskDetailList(taskId: string) {
  return axios.get('/taskInfo/getTaskDetailList', {
    params: {
      taskId,
    },
  });
}
// 更新任务明细的状态
export function updateTaskInfoStatus(
  id: string,
  status: 'todo' | 'doing' | 'done'
) {
  return axios.post('/taskInfo/updateTaskInfoStatus', {
    id,
    status,
  });
}

export function getTaskInfoById(taskId: string) {
  return axios.get('/taskInfo/getById', {
    params: {
      taskId,
    },
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
