import { adminApi } from './api';

export const loginApi = (loginData) => {
  return adminApi.post(`/admin/signin`, loginData);
};
