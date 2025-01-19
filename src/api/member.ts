import axios from 'axios';
import qs from 'query-string';

export function createMember(data: { name: string; describe?: string }) {
  return axios.post('/member/add', {
    ...data,
  });
}
export function getMemberByPage() {
  if (window.getMemberPromise) {
    return window.getMemberPromise;
  }
  (window as any).getMemberPromise = axios.get('/member/get', {
    params: {},
  });
  return window.getMemberPromise;
}

export async function getMemberMap() {
  const { data } = await getMemberByPage();
  return data.list.reduce((map, item) => {
    map[item.id] = item;
    return map;
  }, {});
}
