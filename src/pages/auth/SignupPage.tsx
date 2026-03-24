import { useState, useEffect, useRef } from 'react';
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

// function formatPhone(value: string): string {
//   const digits = value.replace(/\D/g, '').slice(0, 11);
//   if (digits.length <= 3) return digits;
//   if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
//   return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
// }

// const SMS_TIMEOUT = 180;
const EMAIL_TIMEOUT = 180;

function formatTimer(sec: number) {
  const m = Math.floor(sec / 60).toString().padStart(2, '0');
  const s = (sec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

// const CARRIERS = ['SKT', 'KT', 'LGU+', '알뜰폰'];

export default function SignupPage() {
  const navigate = useNavigate();
  const setAuth  = useAuthStore((s) => s.setAuth);

  const [nickname,        setNickname]        = useState('');
  const [email,           setEmail]           = useState('');
  const [password,        setPassword]        = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  // const [phone,           setPhone]           = useState('');
  // const [carrier,         setCarrier]         = useState('');

  const [agreeTerms,   setAgreeTerms]   = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const agreeAll = agreeTerms && agreePrivacy;

  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  // ── 이메일 인증 상태 ──
  const [emailVerificationSent,  setEmailVerificationSent]  = useState(false);
  const [emailVerificationCode,  setEmailVerificationCode]  = useState('');
  const [isEmailVerified,        setIsEmailVerified]        = useState(false);
  const [isSendingEmailCode,     setIsSendingEmailCode]     = useState(false);
  const [isVerifyingEmail,       setIsVerifyingEmail]       = useState(false);
  const [emailVerifyError,       setEmailVerifyError]       = useState('');
  const [emailTimer,             setEmailTimer]             = useState(0);
  const [emailVerifyAlert,       setEmailVerifyAlert]       = useState(false);

  // // ── 휴대폰 인증 상태 ──
  // const [verificationSent,  setVerificationSent]  = useState(false);
  // const [verificationCode,  setVerificationCode]  = useState('');
  // const [isPhoneVerified,   setIsPhoneVerified]   = useState(false);
  // const [isSendingCode,     setIsSendingCode]     = useState(false);
  // const [isVerifying,       setIsVerifying]       = useState(false);
  // const [verifyError,       setVerifyError]       = useState('');
  // const [timer,             setTimer]             = useState(0);
  // const [phoneVerifyAlert,  setPhoneVerifyAlert]  = useState(false);

  const emailTimerRef  = useRef<ReturnType<typeof setInterval> | null>(null);
  const emailGroupRef  = useRef<HTMLDivElement>(null);
  // const timerRef      = useRef<ReturnType<typeof setInterval> | null>(null);
  // const phoneGroupRef = useRef<HTMLDivElement>(null);

  const pwStrength         = getPasswordStrength(password);
  const isPasswordMismatch = passwordConfirm.length > 0 && password !== passwordConfirm;

  // ── 이메일 타이머 ──
  const clearEmailTimer = () => {
    if (emailTimerRef.current !== null) {
      clearInterval(emailTimerRef.current);
      emailTimerRef.current = null;
    }
  };

  const startEmailTimer = () => {
    clearEmailTimer();
    setEmailTimer(EMAIL_TIMEOUT);
    emailTimerRef.current = setInterval(() => {
      setEmailTimer((prev) => {
        if (prev <= 1) { clearEmailTimer(); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  // // ── 휴대폰 타이머 ──
  // const clearTimer = () => {
  //   if (timerRef.current !== null) {
  //     clearInterval(timerRef.current);
  //     timerRef.current = null;
  //   }
  // };

  // const startTimer = () => {
  //   clearTimer();
  //   setTimer(SMS_TIMEOUT);
  //   timerRef.current = setInterval(() => {
  //     setTimer((prev) => {
  //       if (prev <= 1) { clearTimer(); return 0; }
  //       return prev - 1;
  //     });
  //   }, 1000);
  // };

  useEffect(() => { return () => clearEmailTimer(); }, []);

  useEffect(() => {
    if (!emailVerifyAlert) return;
    const id = setTimeout(() => setEmailVerifyAlert(false), 3000);
    return () => clearTimeout(id);
  }, [emailVerifyAlert]);

  // useEffect(() => {
  //   if (!phoneVerifyAlert) return;
  //   const id = setTimeout(() => setPhoneVerifyAlert(false), 3000);
  //   return () => clearTimeout(id);
  // }, [phoneVerifyAlert]);

  const resetEmailVerify = () => {
    setEmailVerificationSent(false);
    setIsEmailVerified(false);
    setEmailVerificationCode('');
    setEmailVerifyError('');
    setEmailTimer(0);
    clearEmailTimer();
  };

  // const resetPhoneVerify = () => {
  //   setVerificationSent(false);
  //   setIsPhoneVerified(false);
  //   setVerificationCode('');
  //   setVerifyError('');
  //   setTimer(0);
  //   clearTimer();
  // };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (emailVerificationSent || isEmailVerified) resetEmailVerify();
  };

  // const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setPhone(formatPhone(e.target.value));
  //   if (verificationSent || isPhoneVerified) resetPhoneVerify();
  // };

  const handleAgreeAll = (checked: boolean) => {
    setAgreeTerms(checked);
    setAgreePrivacy(checked);
  };

  const handleSendEmailVerification = async () => {
    if (!email) { setEmailVerifyError('이메일을 입력해주세요.'); return; }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) { setEmailVerifyError('올바른 이메일 형식을 입력해주세요.'); return; }
    setEmailVerifyError('');
    setIsSendingEmailCode(true);
    try {
      await authApi.sendEmailCode(email);
      setEmailVerificationSent(true);
      setEmailVerificationCode('');
      setIsEmailVerified(false);
      startEmailTimer();
    } catch {
      setEmailVerifyError('인증번호 발송에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSendingEmailCode(false);
    }
  };

  // const handleSendVerification = async () => {
  //   const rawPhone = phone.replace(/-/g, '');
  //   if (rawPhone.length < 10) { setVerifyError('휴대폰 번호를 올바르게 입력해주세요.'); return; }
  //   setVerifyError('');
  //   setIsSendingCode(true);
  //   try {
  //     await authApi.sendSmsCode(rawPhone);
  //     setVerificationSent(true);
  //     setVerificationCode('');
  //     setIsPhoneVerified(false);
  //     startTimer();
  //   } catch {
  //     setVerifyError('인증번호 발송에 실패했습니다. 다시 시도해주세요.');
  //   } finally {
  //     setIsSendingCode(false);
  //   }
  // };

  const handleVerifyEmailCode = async () => {
    if (emailVerificationCode.length !== 8) { setEmailVerifyError('인증번호 8자리를 입력해주세요.'); return; }
    if (emailTimer <= 0) { setEmailVerifyError('인증 시간이 만료되었습니다. 재발송 후 다시 시도해주세요.'); return; }
    setEmailVerifyError('');
    setIsVerifyingEmail(true);
    try {
      await authApi.verifyEmailCode(email, emailVerificationCode);
      setIsEmailVerified(true);
      setEmailVerifyAlert(false);
      setEmailTimer(0);
      clearEmailTimer();
    } catch {
      setEmailVerifyError('인증번호가 올바르지 않습니다.');
    } finally {
      setIsVerifyingEmail(false);
    }
  };

  // const handleVerifyCode = async () => {
  //   if (verificationCode.length !== 6) { setVerifyError('인증번호 6자리를 입력해주세요.'); return; }
  //   if (timer <= 0) { setVerifyError('인증 시간이 만료되었습니다. 재발송 후 다시 시도해주세요.'); return; }
  //   setVerifyError('');
  //   setIsVerifying(true);
  //   try {
  //     await authApi.verifySmsCode(phone.replace(/-/g, ''), verificationCode);
  //     setIsPhoneVerified(true);
  //     setPhoneVerifyAlert(false);
  //     setTimer(0);
  //     clearTimer();
  //   } catch {
  //     setVerifyError('인증번호가 올바르지 않습니다.');
  //   } finally {
  //     setIsVerifying(false);
  //   }
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!nickname.trim())             { setError('닉네임을 입력해주세요.'); return; }
    if (!email)                       { setError('이메일을 입력해주세요.'); return; }
    if (password.length < 8)          { setError('비밀번호는 8자 이상이어야 합니다.'); return; }
    if (password !== passwordConfirm) { setError('비밀번호가 일치하지 않습니다.'); return; }

    if (!isEmailVerified) {
      setEmailVerifyAlert(true);
      emailGroupRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    // const rawPhone = phone.replace(/-/g, '');
    // if (rawPhone.length < 10) { setError('휴대폰 번호를 올바르게 입력해주세요.'); return; }

    // if (!isPhoneVerified) {
    //   setPhoneVerifyAlert(true);
    //   phoneGroupRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    //   return;
    // }

    if (!agreeTerms || !agreePrivacy) { setError('필수 약관에 동의해주세요.'); return; }

    setLoading(true);
    try {
      const signupData = await authApi.signup({
        email,
        password,
        nickname,
        // phoneNumber: rawPhone,
        // carrier: carrier || undefined,
      });
      const token = signupData.accessToken as string;
      const me = await authApi.me(token);
      setAuth(me, token);
      navigate('/');
    } catch (err: unknown) {
      const code = (err as any)?.response?.data?.error?.code;
      setError(
        code === 'USER_DUPLICATE_EMAIL'
          ? '이미 사용 중인 이메일입니다.'
          : '회원가입 중 오류가 발생했습니다.'
      );
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

          {/* ── 닉네임 ── */}
          <div className="form-group">
            <label className="form-label" htmlFor="signup-nickname">닉네임</label>
            <input
              id="signup-nickname" className="form-input" type="text"
              placeholder="사용할 닉네임을 입력하세요"
              value={nickname} onChange={(e) => setNickname(e.target.value)}
              autoComplete="nickname"
            />
          </div>

          {/* ── 이메일 인증 ── */}
          <div
            className={`form-group${emailVerifyAlert ? ' email-verify-alert' : ''}`}
            ref={emailGroupRef}
          >
            <label className="form-label" htmlFor="signup-email">이메일</label>

            <div className="email-row">
              <input
                id="signup-email" className="form-input" type="email"
                placeholder="example@email.com"
                value={email} onChange={handleEmailChange}
                autoComplete="email"
                disabled={isEmailVerified}
              />
              <button
                type="button" className="send-verify-btn"
                onClick={handleSendEmailVerification}
                disabled={isSendingEmailCode || isEmailVerified || !email}
              >
                {isSendingEmailCode ? '발송 중...' : emailVerificationSent ? '재발송' : '인증요청'}
              </button>
            </div>

            {isEmailVerified ? (
              <p className="phone-verified-badge">&#10003; 인증완료</p>
            ) : emailVerificationSent && (
              <div className="verify-row">
                <input
                  className="form-input" type="text"
                  placeholder="인증번호 8자리"
                  value={emailVerificationCode}
                  onChange={(e) => setEmailVerificationCode(e.target.value.slice(0, 8))}
                  maxLength={8}
                />
                {emailTimer > 0 && (
                  <span className={`verify-timer${emailTimer <= 30 ? ' timer-urgent' : ''}`}>
                    {formatTimer(emailTimer)}
                  </span>
                )}
                {emailTimer === 0 && emailVerificationSent && (
                  <span className="verify-timer timer-expired">만료</span>
                )}
                <button
                  type="button" className="send-verify-btn"
                  onClick={handleVerifyEmailCode}
                  disabled={isVerifyingEmail || emailVerificationCode.length !== 8 || emailTimer <= 0}
                >
                  {isVerifyingEmail ? '확인 중...' : '인증확인'}
                </button>
              </div>
            )}

            {emailVerifyAlert && (
              <p className="email-verify-alert-msg">
                ⚠️ 이메일 인증을 완료해주세요.
              </p>
            )}
            {emailVerifyError && <p className="verify-error">{emailVerifyError}</p>}
          </div>

          {/* ── 비밀번호 ── */}
          <div className="form-group">
            <label className="form-label" htmlFor="signup-password">비밀번호</label>
            <input
              id="signup-password" className="form-input" type="password"
              placeholder="8자 이상 입력하세요"
              value={password} onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />
            {password.length > 0 && (
              <>
                <div className="password-strength">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className={`strength-bar ${
                      pwStrength >= i
                        ? pwStrength === 1 ? 'active-weak'
                        : pwStrength === 2 ? 'active-medium'
                        : 'active-strong'
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

          {/* ── 비밀번호 확인 ── */}
          <div className="form-group">
            <label className="form-label" htmlFor="signup-pw-confirm">비밀번호 확인</label>
            <input
              id="signup-pw-confirm" className="form-input" type="password"
              placeholder="비밀번호를 다시 입력하세요"
              value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)}
              autoComplete="new-password"
              style={isPasswordMismatch ? { borderColor: '#ef4444' } : {}}
            />
            {isPasswordMismatch && (
              <p className="password-hint" style={{ color: '#ef4444' }}>비밀번호가 일치하지 않습니다.</p>
            )}
            {!isPasswordMismatch && passwordConfirm.length > 0 && password === passwordConfirm && (
              <p className="password-hint" style={{ color: '#10b981' }}>비밀번호가 일치합니다.</p>
            )}
          </div>

          {/* ── 휴대폰 인증 (주석 처리) ── */}
          {/* <div
            className={`form-group${phoneVerifyAlert ? ' phone-verify-alert' : ''}`}
            ref={phoneGroupRef}
          >
            <label className="form-label" htmlFor="signup-phone">휴대폰 번호</label>

            <div className="phone-row">
              <select
                className="carrier-select"
                value={carrier}
                onChange={(e) => setCarrier(e.target.value)}
                disabled={isPhoneVerified}
              >
                <option value="">통신사</option>
                {CARRIERS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <input
                id="signup-phone" className="form-input" type="tel"
                placeholder="010-0000-0000"
                value={phone} onChange={handlePhoneChange}
                inputMode="numeric" disabled={isPhoneVerified}
              />
              <button
                type="button" className="send-verify-btn"
                onClick={handleSendVerification}
                disabled={isSendingCode || isPhoneVerified || phone.replace(/-/g, '').length < 10}
              >
                {isSendingCode ? '발송 중...' : verificationSent ? '재발송' : '인증요청'}
              </button>
            </div>

            {isPhoneVerified ? (
              <p className="phone-verified-badge">&#10003; 인증완료</p>
            ) : verificationSent && (
              <div className="verify-row">
                <input
                  className="form-input" type="text"
                  placeholder="인증번호 6자리"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  inputMode="numeric" maxLength={6}
                />
                {timer > 0 && (
                  <span className={`verify-timer${timer <= 30 ? ' timer-urgent' : ''}`}>
                    {formatTimer(timer)}
                  </span>
                )}
                {timer === 0 && verificationSent && (
                  <span className="verify-timer timer-expired">만료</span>
                )}
                <button
                  type="button" className="send-verify-btn"
                  onClick={handleVerifyCode}
                  disabled={isVerifying || verificationCode.length !== 6 || timer <= 0}
                >
                  {isVerifying ? '확인 중...' : '인증확인'}
                </button>
              </div>
            )}

            {phoneVerifyAlert && (
              <p className="phone-verify-alert-msg">
                ⚠️ 휴대폰 번호 인증을 완료해주세요.
              </p>
            )}
            {verifyError && <p className="verify-error">{verifyError}</p>}
          </div> */}

          {/* ── 약관 ── */}
          <div className="terms-group">
            <label className="terms-item">
              <input type="checkbox" checked={agreeAll}
                onChange={(e) => handleAgreeAll(e.target.checked)} />
              <span className="terms-label" style={{ fontWeight: 700 }}>전체 동의</span>
            </label>
            <div className="terms-divider" />
            <label className="terms-item">
              <input type="checkbox" checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)} />
              <span className="terms-label required-mark">이용약관 동의</span>
            </label>
            <label className="terms-item">
              <input type="checkbox" checked={agreePrivacy}
                onChange={(e) => setAgreePrivacy(e.target.checked)} />
              <span className="terms-label required-mark">개인정보 처리방침 동의</span>
            </label>
          </div>

          {error && <p className="signup-error">{error}</p>}

          <button type="submit" className="signup-btn" disabled={loading}>
            {loading ? '가입 중...' : '가입하기'}
          </button>
        </form>

        <p className="signup-switch">
          이미 계정이 있으신가요?{' '}
          <Link to="/login" className="auth-link">로그인</Link>
        </p>
      </div>
    </div>
  );
}
