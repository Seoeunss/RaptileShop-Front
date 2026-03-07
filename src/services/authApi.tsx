import api from '../lib/api';

export interface SignupData { email: string; password: string; nickname: string; phone?: string; carrier?: string; }
export interface LoginData  { email: string; password: string; }

export const authApi = {
  signup: (data: SignupData) =>
    api.post('/auth/signup', data).then((r) => r.data.data),

  login: (data: LoginData) =>
    api.post('/auth/login', data).then((r) => r.data.data),

  me: () =>
    api.get('/auth/me').then((r) => r.data.data),

  sendSmsCode: (phone: string, carrier: string) =>
    api.post('/auth/sms/send', { phone, carrier }).then((r) => r.data.data),

  verifySmsCode: (phone: string, code: string) =>
    api.post('/auth/sms/verify', { phone, code }).then((r) => r.data.data),
};
