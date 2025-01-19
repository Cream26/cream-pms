import axios from 'axios';
import { Depart } from '@/type/depart';

// 添加上下级部门

export function addDepartByType(data: {
  currentDepartId: string;
  addDepart: {
    name: string;
    description?: string;
  };
  type: 'up' | 'down';
}) {
  return axios.post('/depart/addDepartByType', {
    ...data,
    currentDepartId: data.currentDepartId.trim(),
  });
}

// 获取部门树
export function getDepartTree() {
  return axios.get('/depart/getDepartTree');
}

// 更新部门信息
export function updateDepart(data: Depart) {
  return axios.post('/depart/updateDepart', data);
}

// 调整部门上级
export function adjustDepartParent(data: {
  departId: string;
  parentId: string;
}) {
  return axios.post('/depart/adjustDepartParent', data);
}
