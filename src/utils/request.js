import axios from 'axios';
import { AxiosQueueManager } from 'axios-queue-js';

import { toast } from 'react-hot-toast';
import { getBaseApiUrl } from 'src/config';

const baseClient = axios.create({
  baseURL: getBaseApiUrl(),
});

baseClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `${token}`;
    }

    Object.entries(config.params || {})
      // eslint-disable-next-line no-unused-vars
      .filter(([_, value]) => value === null || value === undefined || value === "")
      .forEach(([key]) => {
        delete config.params[key];
      });

    return config;
  },
  error => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

baseClient.interceptors.response.use(
  response => {
    return response.data;
  },
  error => {
    if (error.response) {
      console.error('Response error:', error.response.data);
      console.error('Status code:', error.response.status);
      if (error?.response?.status === 401) {
        toast("Not authenticated!");
        window.location.replace(window.location.origin + '/auth/login');
        localStorage.removeItem("token");
        localStorage.removeItem("company_id");
        localStorage.removeItem("account_id");
        localStorage.removeItem("chat_account_id");
        localStorage.removeItem("company");
        localStorage.removeItem("last_beat_time");
        console.error('error 401');
      }
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

const apiClient = new AxiosQueueManager({ 
  queueSize: 10, 
  client: baseClient
});

export default apiClient;

export const fetcher = async (args) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await apiClient.get(url, { ...config });

  return res;
};
