import api from '../lib/api';

export interface SignupData { email: string; password: string; nickname: string; }
export interface LoginData  { email: string; password: string; }

export const authApi = {
  signup: (data: SignupData) =>
    api.post('/auth/signup', data).then((r) => r.data.data),

  login: (data: LoginData) =>
    api.post('/auth/login', data).then((r) => r.data.data),

  me: () =>
    api.get('/auth/me').then((r) => r.data.data),
};
