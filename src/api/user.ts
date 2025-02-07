import axios from 'axios';
import type { RouteRecordNormalized } from 'vue-router';
import { UserState } from '@/store/modules/user/types';
import { User } from '@/type/user';

export interface LoginData {
  account: string;
  username: string;
  password: string;
}

export interface LoginRes {
  token: string;
}
export function login(data: LoginData) {
  // return axios.post<LoginRes>('/user/login', data);
  return axios.post<LoginRes>('/auth/login', data);
}

export function logout() {
  // return axios.post<LoginRes>('/user/logout');
  return axios.post<LoginRes>('/auth/logout');
}

export function getUserInfo() {
  return axios.post<UserState>('/user/info');
}

export function getMenuList() {
  return axios.post<RouteRecordNormalized[]>('/user/menu');
}

// 创建用户
export function createUser(data: User) {
  return axios.post('/user/createUser', data);
}

// 获取用户列表
export function getUserList(data: {
  search?: string;
  page: number;
  pageSize: number;
  departId?: string | null;
}) {
  return axios.get('/user/getUserList', {
    params: {
      ...data,
      departId: data.departId?.trim(),
    },
  });
}

// 改变用户状态
export function updateUserStatus(id: string, status: number) {
  return axios.post('/user/updateUserStatus', { id, status });
}

// 删除用户
export function deleteUser(id: string) {
  return axios.post('/user/deleteUser', { id });
}

// 更新用户信息
export function updateUser(id: string, data: Omit<User, 'password'>) {
  return axios.post('/user/updateUser', { ...data, id });
}

// 获取所有用户
export function getAllUser() {
  return axios.get('/user/getAllUser');
}
