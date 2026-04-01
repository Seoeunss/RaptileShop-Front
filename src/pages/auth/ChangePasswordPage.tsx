import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authApi } from '../../services/authApi';
import { useAuthStore } from '../../store/authStore';
import './style/LoginPage.css';

export default function ChangePasswordPage() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const setAuth   = useAuthStore((s) => s.setAuth);

  // 로그인 직후 전달된 임시 토큰
  const token: string | undefined = (location.state as any)?.token;

  const [newPassword,     setNewPassword]     = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error,           setError]           = useState('');
  const [loading,         setLoading]         = useState(false);

  // 토큰 없이 직접 접근한 경우
  if (!token) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <p style={{ textAlign: 'center', color: 'var(--muted)', fontSize: 14 }}>
            잘못된 접근입니다.{' '}
            <button
              className="link-btn"
              onClick={() => navigate('/login')}
            >
              로그인 페이지로 이동
            </button>
          </p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!newPassword) { setError('새 비밀번호를 입력해주세요.'); return; }
    if (newPassword.length < 8) { setError('비밀번호는 8자 이상이어야 합니다.'); return; }
    if (newPassword !== confirmPassword) { setError('비밀번호가 일치하지 않습니다.'); return; }

    setLoading(true);
    try {
      await authApi.changePassword(newPassword, token);
      // 변경 완료 후 me() 조회 → 정상 로그인 처리
      const me = await authApi.me(token);
      setAuth(me, token);
      navigate('/', { replace: true });
    } catch {
      setError('비밀번호 변경 중 오류가 발생했습니다. 다시 시도해주세요.');
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
        <h1 className="auth-title">비밀번호 변경</h1>
        <p className="auth-desc">
          임시비밀번호로 로그인하셨습니다.<br />
          새로운 비밀번호를 설정해주세요.
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="newPassword">새 비밀번호</label>
            <input
              id="newPassword"
              className="form-input"
              type="password"
              placeholder="8자 이상 입력하세요"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="new-password"
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="confirmPassword">새 비밀번호 확인</label>
            <input
              id="confirmPassword"
              className="form-input"
              type="password"
              placeholder="비밀번호를 한 번 더 입력하세요"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
            />
          </div>
          {error && (
            <p style={{ margin: 0, fontSize: 13, color: '#ef4444', textAlign: 'center' }}>
              {error}
            </p>
          )}
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? '변경 중...' : '비밀번호 변경'}
          </button>
        </form>
      </div>
    </div>
  );
}
