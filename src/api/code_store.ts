import axios from 'axios';

import { CodeStoreBase } from '@/type/code_store';

export function createCodeStore(data: CodeStoreBase) {
  return axios.post('/codeStore/create', {
    ...data,
  });
}

// 获取代码仓库列表
export function getCodeStore() {
  return axios.get('/codeStore/list', {
    params: {},
  });
}

// 删除代码仓库
export function deleteCodeStore(id: string) {
  return axios.post(`/codeStore/delete/${id}`);
}

// 更新代码仓库
export function updateCodeStore(id: string, data: CodeStoreBase) {
  return axios.post(`/codeStore/update/${id}`, {
    ...data,
  });
}
