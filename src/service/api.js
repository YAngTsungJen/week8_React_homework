import axios from 'axios';
import store from '../store';
import { createAsyncMessage } from '../slices/ToastSlice';
const API_BASE = import.meta.env.VITE_BASE_URL;

export const API_PATH = import.meta.env.VITE_API_PATH;

export const api = axios.create({
  baseURL: API_BASE,
});

export const adminApi = axios.create({
  baseURL: API_BASE,
});

adminApi.interceptors.request.use(
  (config) => {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)onion\s*=\s*([^;]*).*$)|^.*$/,
      '$1',
    );
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;

    if (response?.status === 401) {
      store.dispatch(createAsyncMessage(response.data));
    } else if (response?.status >= 500) {
      store.dispatch(
        createAsyncMessage({
          success: false,
          message: '伺服器錯誤，請稍後再試',
        }),
      );
    }
    return Promise.reject(error);
  },
);
