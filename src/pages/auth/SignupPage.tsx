import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../../services/authApi';
import { useAuthStore } from '../../store/authStore';
import './style/SignupPage.css';

function getPasswordStrength(pw: string): 0 | 1 | 2 | 3 {
  if (pw.length === 0) return 0;
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw) || /[!@#$%^&*]/.test(pw)) score++;
  if (pw.length >= 12) score++;
  return score as 0 | 1 | 2 | 3;
}

const strengthLabel = (s: number) => ['', '약함', '보통', '강함'][s] ?? '';
const strengthColor = (s: number) => ['', '#ef4444', '#f59e0b', '#10b981'][s] ?? '';

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
}

const CARRIERS = ['SKT', 'KT', 'LG U+'] as const;

export default function SignupPage() {
  const navigate = useNavigate();
  const setAuth  = useAuthStore((s) => s.setAuth);

  const [nickname, setNickname]               = useState('');
  const [email,    setEmail]                  = useState('');
  const [password, setPassword]               = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [carrier,  setCarrier]                = useState<string>('SKT');
  const [phone,    setPhone]                  = useState('');
  const [agreeAll,     setAgreeAll]     = useState(false);
  const [agreeTerms,   setAgreeTerms]   = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(formatPhone(e.target.value));
  };

  const pwStrength = getPasswordStrength(password);
  const isPasswordMismatch = passwordConfirm.length > 0 && password !== passwordConfirm;

  const handleAgreeAll = (checked: boolean) => {
    setAgreeAll(checked); setAgreeTerms(checked); setAgreePrivacy(checked);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!nickname.trim())             { setError('닉네임을 입력해주세요.'); return; }
    if (!email)                       { setError('이메일을 입력해주세요.'); return; }
    if (password.length < 8)          { setError('비밀번호는 8자 이상이어야 합니다.'); return; }
    if (password !== passwordConfirm) { setError('비밀번호가 일치하지 않습니다.'); return; }
    const rawPhone = phone.replace(/-/g, '');
    if (rawPhone.length < 10)             { setError('휴대폰 번호를 올바르게 입력해주세요.'); return; }
    if (!agreeTerms || !agreePrivacy) { setError('필수 약관에 동의해주세요.'); return; }

    setLoading(true);
    try {
      const data  = await authApi.signup({ email, password, nickname, phone, carrier });
      const token = data.accessToken as string;
      localStorage.setItem('accessToken', token);
      const me = await authApi.me();
      setAuth(me, token);
      navigate('/');
    } catch (err: unknown) {
      const code = (err as any)?.response?.data?.error?.code;
      setError(code === 'USER_DUPLICATE_EMAIL'
        ? '이미 사용 중인 이메일입니다.'
        : '회원가입 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-card">
        <h1 className="signup-title">회원가입</h1>
        <p className="signup-desc">Reptile Mall 계정을 만들어보세요</p>

        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="signup-nickname">닉네임</label>
            <input id="signup-nickname" className="form-input" type="text"
              placeholder="사용할 닉네임을 입력하세요"
              value={nickname} onChange={(e) => setNickname(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="signup-email">이메일</label>
            <input id="signup-email" className="form-input" type="email"
              placeholder="example@email.com" value={email}
              onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="signup-password">비밀번호</label>
            <input id="signup-password" className="form-input" type="password"
              placeholder="8자 이상 입력하세요" value={password}
              onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" />
            {password.length > 0 && (
              <>
                <div className="password-strength">
                  {[1,2,3].map((i) => (
                    <div key={i} className={`strength-bar ${
                      pwStrength >= i
                        ? pwStrength === 1 ? 'active-weak' : pwStrength === 2 ? 'active-medium' : 'active-strong'
                        : ''
                    }`} />
                  ))}
                </div>
                <p className="password-hint" style={{ color: strengthColor(pwStrength) }}>
                  {strengthLabel(pwStrength)}
                </p>
              </>
            )}
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="signup-pw-confirm">비밀번호 확인</label>
            <input id="signup-pw-confirm" className="form-input" type="password"
              placeholder="비밀번호를 다시 입력하세요" value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)} autoComplete="new-password"
              style={isPasswordMismatch ? { borderColor: '#ef4444' } : {}} />
            {isPasswordMismatch && <p className="password-hint" style={{ color: '#ef4444' }}>비밀번호가 일치하지 않습니다.</p>}
            {!isPasswordMismatch && passwordConfirm.length > 0 && password === passwordConfirm && (
              <p className="password-hint" style={{ color: '#10b981' }}>비밀번호가 일치합니다.</p>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="signup-phone">휴대폰 번호</label>
            <div className="phone-row">
              <select
                className="form-select carrier-select"
                value={carrier}
                onChange={(e) => setCarrier(e.target.value)}
                aria-label="통신사 선택"
              >
                {CARRIERS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <input
                id="signup-phone"
                className="form-input"
                type="tel"
                placeholder="010-0000-0000"
                value={phone}
                onChange={handlePhoneChange}
                inputMode="numeric"
              />
            </div>
          </div>

          <div className="terms-group">
            <label className="terms-item">
              <input type="checkbox" checked={agreeAll} onChange={(e) => handleAgreeAll(e.target.checked)} />
              <span className="terms-label" style={{ fontWeight: 700 }}>전체 동의</span>
            </label>
            <div className="terms-divider" />
            <label className="terms-item">
              <input type="checkbox" checked={agreeTerms}
                onChange={(e) => { setAgreeTerms(e.target.checked); setAgreeAll(e.target.checked && agreePrivacy); }} />
              <span className="terms-label required-mark">이용약관 동의</span>
            </label>
            <label className="terms-item">
              <input type="checkbox" checked={agreePrivacy}
                onChange={(e) => { setAgreePrivacy(e.target.checked); setAgreeAll(agreeTerms && e.target.checked); }} />
              <span className="terms-label required-mark">개인정보 처리방침 동의</span>
            </label>
          </div>

          {error && <p className="signup-error">{error}</p>}
          <button type="submit" className="signup-btn" disabled={loading}>
            {loading ? '가입 중...' : '가입하기'}
          </button>
        </form>

        <p className="auth-switch">
          이미 계정이 있으신가요?{' '}
          <Link to="/login" className="auth-link">로그인</Link>
        </p>
      </div>
    </div>
  );
}
