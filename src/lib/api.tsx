import axios from 'axios';

// Vite proxy(/api → http://localhost:8082)를 통해 백엔드 호출
// baseURL을 상대경로로 설정 → vite.config의 proxy 설정이 포트를 처리
const api = axios.create({
  baseURL: '/api/v1',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// 요청 인터셉터 - JWT 자동 주입
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터 - 공통 에러 처리
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const url = error.config?.url ?? '';
      const isPublicProduct = /^\/products(\/\d+)?$/.test(url);
      if (!isPublicProduct) {
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
