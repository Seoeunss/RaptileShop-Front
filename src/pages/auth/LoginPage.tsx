import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../../services/authApi';
import { useAuthStore } from '../../store/authStore';
import './style/LoginPage.css';

type ModalType = 'findEmail' | 'findPassword' | null;

export default function LoginPage() {
  const navigate  = useNavigate();
  const setAuth   = useAuthStore((s) => s.setAuth);

  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  // 모달 상태
  const [modal, setModal] = useState<ModalType>(null);

  // 아이디 찾기
  const [findNickname,  setFindNickname]  = useState('');
  const [foundEmail,    setFoundEmail]    = useState('');
  const [findEmailErr,  setFindEmailErr]  = useState('');
  const [findEmailLoad, setFindEmailLoad] = useState(false);

  // 비밀번호 찾기
  const [resetNickname, setResetNickname] = useState('');
  const [resetEmail,    setResetEmail]    = useState('');
  const [resetSent,     setResetSent]     = useState(false);
  const [resetErr,      setResetErr]      = useState('');
  const [resetLoad,     setResetLoad]     = useState(false);

  const openModal = (type: ModalType) => {
    setModal(type);
    setFindNickname(''); setFoundEmail(''); setFindEmailErr('');
    setResetNickname(''); setResetEmail(''); setResetSent(false); setResetErr('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('이메일과 비밀번호를 모두 입력해주세요.'); return; }

    setLoading(true);
    try {
      const data  = await authApi.login({ email, password });
      const token = data.accessToken as string;

      // 임시비밀번호로 로그인한 경우 비밀번호 변경 페이지로 이동
      if (data.user?.mustChangePassword) {
        navigate('/change-password', { state: { token, nickname: data.user.nickname } });
        return;
      }

      const me = await authApi.me(token);
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

  const handleFindEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setFindEmailErr('');
    if (!findNickname.trim()) { setFindEmailErr('닉네임을 입력해주세요.'); return; }
    setFindEmailLoad(true);
    try {
      const maskedEmail = await authApi.findEmail(findNickname.trim());
      setFoundEmail(maskedEmail);
    } catch {
      setFindEmailErr('해당 닉네임으로 등록된 계정을 찾을 수 없습니다.');
    } finally {
      setFindEmailLoad(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetErr('');
    if (!resetNickname.trim() || !resetEmail.trim()) { setResetErr('닉네임과 이메일을 모두 입력해주세요.'); return; }
    setResetLoad(true);
    try {
      await authApi.resetPassword(resetNickname.trim(), resetEmail.trim());
      setResetSent(true);
    } catch {
      setResetErr('닉네임 또는 이메일이 일치하지 않습니다.');
    } finally {
      setResetLoad(false);
    }
  };

  return (
    <>
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
              <input
                id="email" className="form-input" type="email"
                placeholder="이메일을 입력하세요"
                value={email} onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="password">비밀번호</label>
              <input
                id="password" className="form-input" type="password"
                placeholder="비밀번호를 입력하세요"
                value={password} onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>

            <div className="auth-find-links">
              <button type="button" className="link-btn" onClick={() => openModal('findEmail')}>
                아이디 찾기
              </button>
              <span className="auth-find-divider">|</span>
              <button type="button" className="link-btn" onClick={() => openModal('findPassword')}>
                비밀번호 찾기
              </button>
            </div>

            {error && (
              <p style={{ margin: 0, fontSize: 13, color: '#ef4444', textAlign: 'center' }}>
                {error}
              </p>
            )}
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

      {/* 아이디 찾기 모달 */}
      {modal === 'findEmail' && (
        <div className="auth-modal-overlay" onClick={() => setModal(null)}>
          <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="auth-modal-title">아이디 찾기</h2>
            <p className="auth-modal-desc">가입 시 등록한 닉네임을 입력해주세요.</p>
            {!foundEmail ? (
              <form onSubmit={handleFindEmail} className="auth-form">
                <div className="form-group">
                  <label className="form-label">닉네임</label>
                  <input
                    className="form-input"
                    placeholder="닉네임을 입력하세요"
                    value={findNickname}
                    onChange={(e) => setFindNickname(e.target.value)}
                  />
                </div>
                {findEmailErr && (
                  <p className="auth-modal-error">{findEmailErr}</p>
                )}
                <button type="submit" className="auth-btn" disabled={findEmailLoad}>
                  {findEmailLoad ? '조회 중...' : '아이디 찾기'}
                </button>
              </form>
            ) : (
              <div className="auth-modal-result">
                <p className="auth-modal-result-label">회원님의 아이디(이메일)는</p>
                <p className="auth-modal-result-value">{foundEmail}</p>
                <p className="auth-modal-result-sub">입니다.</p>
                <button
                  className="auth-btn"
                  onClick={() => setModal(null)}
                  style={{ marginTop: 8 }}
                >
                  확인
                </button>
              </div>
            )}
            <button className="auth-modal-close" onClick={() => setModal(null)}>✕</button>
          </div>
        </div>
      )}

      {/* 비밀번호 찾기 모달 */}
      {modal === 'findPassword' && (
        <div className="auth-modal-overlay" onClick={() => setModal(null)}>
          <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="auth-modal-title">비밀번호 찾기</h2>
            <p className="auth-modal-desc">닉네임과 가입한 이메일을 입력하면 임시비밀번호를 발송해 드립니다.</p>
            {!resetSent ? (
              <form onSubmit={handleResetPassword} className="auth-form">
                <div className="form-group">
                  <label className="form-label">닉네임</label>
                  <input
                    className="form-input"
                    placeholder="닉네임을 입력하세요"
                    value={resetNickname}
                    onChange={(e) => setResetNickname(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">이메일</label>
                  <input
                    className="form-input"
                    type="email"
                    placeholder="이메일을 입력하세요"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                  />
                </div>
                {resetErr && (
                  <p className="auth-modal-error">{resetErr}</p>
                )}
                <button type="submit" className="auth-btn" disabled={resetLoad}>
                  {resetLoad ? '발송 중...' : '임시비밀번호 발송'}
                </button>
              </form>
            ) : (
              <div className="auth-modal-result">
                <p className="auth-modal-result-label">임시비밀번호를</p>
                <p className="auth-modal-result-value">{resetEmail}</p>
                <p className="auth-modal-result-sub">로 발송했습니다.<br/>로그인 후 비밀번호를 변경해주세요.</p>
                <button
                  className="auth-btn"
                  onClick={() => setModal(null)}
                  style={{ marginTop: 8 }}
                >
                  확인
                </button>
              </div>
            )}
            <button className="auth-modal-close" onClick={() => setModal(null)}>✕</button>
          </div>
        </div>
      )}
    </>
  );
}
