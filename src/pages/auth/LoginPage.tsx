import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../../services/authApi';
import { useAuthStore } from '../../store/authStore';
import './style/LoginPage.css';

export default function LoginPage() {
  const navigate  = useNavigate();
  const setAuth   = useAuthStore((s) => s.setAuth);

  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('이메일과 비밀번호를 모두 입력해주세요.'); return; }

    setLoading(true);
    try {
      const data  = await authApi.login({ email, password });
      const token = data.accessToken as string;
      localStorage.setItem('accessToken', token);
      const me = await authApi.me();
      setAuth(me, token);
      navigate('/');
    } catch (err: unknown) {
      const code = (err as any)?.response?.data?.error?.code;
      setError(code === 'AUTH_REQUIRED'
        ? '이메일 또는 비밀번호가 올바르지 않습니다.'
        : '로그인 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-mark" />
          <span className="auth-logo-text">Reptile Mall</span>
        </div>
        <h1 className="auth-title">로그인</h1>
        <p className="auth-desc">파충류 전문 마켓에 오신 걸 환영합니다</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">이메일</label>
            <input id="email" className="form-input" type="email"
              placeholder="이메일을 입력하세요" value={email}
              onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="password">비밀번호</label>
            <input id="password" className="form-input" type="password"
              placeholder="비밀번호를 입력하세요" value={password}
              onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
          </div>
          {error && <p style={{ margin: 0, fontSize: 13, color: '#ef4444', textAlign: 'center' }}>{error}</p>}
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>

        <p className="auth-switch">
          계정이 없으신가요?{' '}
          <Link to="/signup" className="auth-link">회원가입</Link>
        </p>
      </div>
    </div>
  );
}
