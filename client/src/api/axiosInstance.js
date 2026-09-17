import axios from 'axios';

const axiosInstance = axios.create({ baseURL: '/api' });
axiosInstance.interceptors.request.use((config) => {
  const token = config.url?.startsWith('/member') ? localStorage.getItem('member_token') : localStorage.getItem('loyalty_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
axiosInstance.interceptors.response.use(response => response, error => {
  if (error.response?.status === 401 && localStorage.getItem('loyalty_token')) {
    localStorage.removeItem('loyalty_token');
    localStorage.removeItem('loyalty_user');
  }
  return Promise.reject(error);
});

export const tiers = [
  { name: 'Bronze', threshold: 0, multiplier: '1x', color: 'bronze' },
  { name: 'Silver', threshold: 500, multiplier: '1.25x', color: 'silver' },
  { name: 'Gold', threshold: 1500, multiplier: '1.5x', color: 'gold' }
];
export default axiosInstance;
