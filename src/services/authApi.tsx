import api from '../lib/api';

export const authApi = {
  /**
   * 회원가입
   * POST /api/v1/auth/signup
   * body: { email, password, nickname, phoneNumber, carrier? }
   */
  signup: async (body: {
    email: string;
    password: string;
    nickname: string;
    phoneNumber?: string;
    carrier?: string;
  }) => {
    const res = await api.post('/auth/signup', body);
    return res.data.data; // { accessToken, user: { id, nickname } }
  },

  /**
   * 로그인
   * POST /api/v1/auth/login
   * body: { email, password }
   */
  login: async (body: { email: string; password: string }) => {
    const res = await api.post('/auth/login', body);
    return res.data.data;
  },

  /**
   * 내 정보 조회
   * GET /api/v1/auth/me
   *
   * @param token - 선택적. signup/login 직후 localStorage 저장 전에 호출할 때 직접 토큰 전달
   *                생략하면 api 인터셉터가 localStorage에서 자동으로 읽음
   */
  me: async (token?: string) => {
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
    const res = await api.get('/auth/me', { headers });
    return res.data.data;
  },

  /**
   * 휴대폰 인증번호 발송
   * POST /api/v1/auth/phone/send
   * body: { phoneNumber }
   */
  sendSmsCode: async (phoneNumber: string) => {
    const res = await api.post('/auth/phone/send', { phoneNumber });
    return res.data.data; // { code } — 개발환경 전용, 운영에서 제거 예정
  },

  /**
   * 휴대폰 인증번호 검증
   * POST /api/v1/auth/phone/verify
   * body: { phoneNumber, code }
   */
  verifySmsCode: async (phoneNumber: string, code: string) => {
    const res = await api.post('/auth/phone/verify', { phoneNumber, code });
    return res.data.data;
  },

  /**
   * 이메일 인증번호 발송
   * POST /api/v1/auth/email/send
   * body: { email }
   */
  sendEmailCode: async (email: string) => {
    const res = await api.post('/auth/email/send', { email });
    return res.data.data;
  },

  /**
   * 이메일 인증번호 검증
   * POST /api/v1/auth/email/verify
   * body: { email, code }
   */
  verifyEmailCode: async (email: string, code: string) => {
    const res = await api.post('/auth/email/verify', { email, code });
    return res.data.data;
  },

  /**
   * 닉네임 중복 확인
   * GET /api/v1/auth/check-nickname?nickname=xxx
   */
  checkNickname: async (nickname: string): Promise<{ available: boolean }> => {
    const res = await api.get('/auth/check-nickname', { params: { nickname } });
    return res.data.data;
  },
};
