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
export function getDepartTreeById(id?: string) {
  return axios.get<Depart[]>('/depart/getDepartTreeById', {
    params: {
      id: id?.trim(),
    },
  });
}

// 更新部门信息
export function updateDepart(data: Depart) {
  return axios.post('/depart/updateDepart', data);
}

// 调整部门上级
export function adjustDepartment(data: { departId: string; parentId: string }) {
  return axios.post('/depart/adjustDepartment', data);
}

// 删除部门
export function deleteDepart(id: string) {
  return axios.get('/depart/deleteDepart', {
    params: {
      departId: id,
    },
  });
}
