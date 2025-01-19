import axios from 'axios';
import type { RouteRecordNormalized } from 'vue-router';
import { UserState } from '@/store/modules/user/types';

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
