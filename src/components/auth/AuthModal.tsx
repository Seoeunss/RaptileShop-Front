import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './AuthModal.css';
import { authApi } from '../../services/authApi';
import { useAuthStore } from '../../store/authStore';
import LegalModal from '../common/LegalModal';

type Tab = 'login' | 'signup';

// const CARRIERS = ['SKT', 'KT', 'LG U+'] as const;
// const SMS_TIMEOUT = 180;
const EMAIL_TIMEOUT = 180;

// function formatPhone(value: string): string {
//     const digits = value.replace(/\D/g, '').slice(0, 11);
//     if (digits.length <= 3) return digits;
//     if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
//     return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
// }

function formatTimer(sec: number) {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
}

type Props = {
    initialTab?: Tab;
    onClose: () => void;
};

/* ───────── 비밀번호 강도 ───────── */
function getPwStrength(pw: string): 0 | 1 | 2 | 3 {
    if (!pw) return 0;
    let s = 0;
    if (pw.length >= 8) s++;
    if (/[A-Z]/.test(pw) || /[!@#$%^&*]/.test(pw)) s++;
    if (pw.length >= 12) s++;
    return s as 0 | 1 | 2 | 3;
}
function strengthClass(s: number) {
    if (s === 1) return 'weak';
    if (s === 2) return 'medium';
    if (s === 3) return 'strong';
    return '';
}
function strengthText(s: number) {
    if (s === 1) return { label: '약함',  color: '#ef4444' };
    if (s === 2) return { label: '보통',  color: '#f59e0b' };
    if (s === 3) return { label: '강함',  color: '#10b981' };
    return { label: '', color: '' };
}

type SubModal = 'findEmail' | 'findPassword' | null;

/* ───────── 로그인 폼 ───────── */
function LoginForm({ onSwitchTab, onClose }: { onSwitchTab: () => void; onClose: () => void }) {
    const navigate  = useNavigate();
    const setAuth   = useAuthStore((s) => s.setAuth);

    const [email,    setEmail]    = useState('');
    const [password, setPassword] = useState('');
    const [error,    setError]    = useState('');
    const [loading,  setLoading]  = useState(false);

    // 아이디 찾기 / 비밀번호 찾기 서브 모달
    const [subModal,       setSubModal]       = useState<SubModal>(null);
    const [findNickname,   setFindNickname]   = useState('');
    const [foundEmail,     setFoundEmail]     = useState('');
    const [findEmailErr,   setFindEmailErr]   = useState('');
    const [findEmailLoad,  setFindEmailLoad]  = useState(false);
    const [resetNickname,  setResetNickname]  = useState('');
    const [resetEmail,     setResetEmail]     = useState('');
    const [resetSent,      setResetSent]      = useState(false);
    const [resetErr,       setResetErr]       = useState('');
    const [resetLoad,      setResetLoad]      = useState(false);

    const openSubModal = (type: SubModal) => {
        setSubModal(type);
        setFindNickname(''); setFoundEmail(''); setFindEmailErr('');
        setResetNickname(''); setResetEmail(''); setResetSent(false); setResetErr('');
    };

    const handleFindEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        setFindEmailErr('');
        if (!findNickname.trim()) { setFindEmailErr('닉네임을 입력해주세요.'); return; }
        setFindEmailLoad(true);
        try {
            const found = await authApi.findEmail(findNickname.trim());
            setFoundEmail(found);
        } catch {
            setFindEmailErr('해당 닉네임으로 가입된 계정을 찾을 수 없습니다.');
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
            setResetErr('입력하신 정보와 일치하는 계정을 찾을 수 없습니다.');
        } finally {
            setResetLoad(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!email || !password) { setError('이메일과 비밀번호를 모두 입력해주세요.'); return; }
        setLoading(true);
        try {
            const data  = await authApi.login({ email, password });
            const token = data.accessToken as string;
            const me    = await authApi.me(token);
            setAuth(me, token);
            onClose();
            navigate('/');
        } catch (err: unknown) {
            const code = (err as any)?.response?.data?.error?.code;
            setError(
                code === 'USER_NOT_FOUND' || code === 'INVALID_PASSWORD'
                    ? '이메일 또는 비밀번호가 올바르지 않습니다.'
                    : '로그인 중 오류가 발생했습니다.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
        <form className="modal-form" onSubmit={handleSubmit}>
            <div className="modal-form-group">
                <label className="modal-label" htmlFor="m-email">이메일</label>
                <input
                    id="m-email"
                    className="modal-input"
                    type="email"
                    placeholder="이메일을 입력하세요"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                />
            </div>

            <div className="modal-form-group">
                <label className="modal-label" htmlFor="m-password">비밀번호</label>
                <input
                    id="m-password"
                    className="modal-input"
                    type="password"
                    placeholder="비밀번호를 입력하세요"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                />
            </div>

            <div className="modal-footer-row" style={{ justifyContent: 'space-between' }}>
                <button type="button" className="modal-link-btn" onClick={() => openSubModal('findEmail')}>아이디 찾기</button>
                <button type="button" className="modal-link-btn" onClick={() => openSubModal('findPassword')}>비밀번호 찾기</button>
            </div>

            {error && <p className="modal-error">{error}</p>}

            <button type="submit" className="modal-submit-btn" disabled={loading}>
                {loading ? '로그인 중...' : '로그인'}
            </button>

            <p className="modal-switch">
                계정이 없으신가요?{' '}
                <button type="button" className="modal-switch-link" onClick={onSwitchTab}>
                    회원가입
                </button>
            </p>
        </form>

        {/* ── 아이디 찾기 서브 모달 ── */}
        {subModal === 'findEmail' && (
            <div className="auth-modal-backdrop" onClick={() => setSubModal(null)} style={{ zIndex: 1100 }}>
                <div className="auth-modal-card" style={{ maxWidth: 400 }} onClick={(e) => e.stopPropagation()}>
                    <button className="auth-modal-close" onClick={() => setSubModal(null)} aria-label="닫기">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                    </button>
                    <div className="auth-modal-body">
                        <h2 style={{ margin: '0 0 8px', fontSize: 20, fontWeight: 800 }}>아이디 찾기</h2>
                        <p style={{ margin: '0 0 24px', fontSize: 13, color: '#64748b' }}>가입 시 등록한 닉네임을 입력해주세요.</p>
                        {!foundEmail ? (
                            <form onSubmit={handleFindEmail} className="modal-form">
                                <div className="modal-form-group">
                                    <label className="modal-label">닉네임</label>
                                    <input
                                        className="modal-input"
                                        placeholder="닉네임을 입력하세요"
                                        value={findNickname}
                                        onChange={(e) => setFindNickname(e.target.value)}
                                    />
                                </div>
                                {findEmailErr && <p className="modal-error">{findEmailErr}</p>}
                                <button type="submit" className="modal-submit-btn" disabled={findEmailLoad}>
                                    {findEmailLoad ? '조회 중...' : '아이디 찾기'}
                                </button>
                            </form>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '12px 0 8px' }}>
                                <p style={{ margin: '0 0 6px', fontSize: 13, color: '#64748b' }}>회원님의 아이디(이메일)는</p>
                                <p style={{ margin: '0 0 6px', fontSize: 17, fontWeight: 800, color: '#0f172a' }}>{foundEmail}</p>
                                <p style={{ margin: '0 0 24px', fontSize: 13, color: '#64748b' }}>입니다.</p>
                                <button className="modal-submit-btn" onClick={() => setSubModal(null)}>확인</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )}

        {/* ── 비밀번호 찾기 서브 모달 ── */}
        {subModal === 'findPassword' && (
            <div className="auth-modal-backdrop" onClick={() => setSubModal(null)} style={{ zIndex: 1100 }}>
                <div className="auth-modal-card" style={{ maxWidth: 400 }} onClick={(e) => e.stopPropagation()}>
                    <button className="auth-modal-close" onClick={() => setSubModal(null)} aria-label="닫기">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                    </button>
                    <div className="auth-modal-body">
                    <h2 style={{ margin: '0 0 8px', fontSize: 20, fontWeight: 800 }}>비밀번호 찾기</h2>
                    <p style={{ margin: '0 0 24px', fontSize: 13, color: '#64748b' }}>닉네임과 가입한 이메일을 입력하면 임시비밀번호를 발송해 드립니다.</p>
                    {!resetSent ? (
                        <form onSubmit={handleResetPassword} className="modal-form" style={{ gap: 12 }}>
                            <div className="modal-form-group">
                                <label className="modal-label">닉네임</label>
                                <input
                                    className="modal-input"
                                    placeholder="닉네임을 입력하세요"
                                    value={resetNickname}
                                    onChange={(e) => setResetNickname(e.target.value)}
                                />
                            </div>
                            <div className="modal-form-group">
                                <label className="modal-label">이메일</label>
                                <input
                                    className="modal-input"
                                    type="email"
                                    placeholder="가입한 이메일을 입력하세요"
                                    value={resetEmail}
                                    onChange={(e) => setResetEmail(e.target.value)}
                                />
                            </div>
                            {resetErr && <p className="modal-error">{resetErr}</p>}
                            <button type="submit" className="modal-submit-btn" disabled={resetLoad}>
                                {resetLoad ? '발송 중...' : '임시 비밀번호 받기'}
                            </button>
                        </form>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '12px 0 8px' }}>
                            <p style={{ margin: '0 0 6px', fontSize: 13, color: '#64748b' }}>임시 비밀번호를</p>
                            <p style={{ margin: '0 0 6px', fontSize: 17, fontWeight: 800, color: '#0f172a' }}>{resetEmail}</p>
                            <p style={{ margin: '0 0 24px', fontSize: 13, color: '#64748b' }}>으로 발송했습니다.</p>
                            <button className="modal-submit-btn" onClick={() => setSubModal(null)}>확인</button>
                        </div>
                    )}
                    </div>
                </div>
            </div>
        )}
        </>
    );
}

/* ───────── 회원가입 폼 ───────── */
function SignupForm({ onSwitchTab, onClose }: { onSwitchTab: () => void; onClose: () => void }) {
    const navigate  = useNavigate();
    const setAuth   = useAuthStore((s) => s.setAuth);

    const [name,       setName]       = useState('');
    const [email,      setEmail]      = useState('');
    const [password,   setPassword]   = useState('');
    const [pwConfirm,  setPwConfirm]  = useState('');
    // const [carrier,    setCarrier]    = useState<string>('SKT');
    // const [phone,      setPhone]      = useState('');
    const [nicknameCheckStatus, setNicknameCheckStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');
    const [agreeAll,     setAgreeAll]     = useState(false);
    const [agreeTerms,   setAgreeTerms]   = useState(false);
    const [agreePrivacy, setAgreePrivacy] = useState(false);
    const [legalModal,   setLegalModal]   = useState<'terms' | 'privacy' | null>(null);
    const [error,      setError]      = useState('');
    const [loading,    setLoading]    = useState(false);

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
    // const [verificationSent, setVerificationSent] = useState(false);
    // const [verificationCode, setVerificationCode] = useState('');
    // const [isPhoneVerified,  setIsPhoneVerified]  = useState(false);
    // const [timer,            setTimer]            = useState(0);
    // const [isSendingCode,    setIsSendingCode]    = useState(false);
    // const [isVerifying,      setIsVerifying]      = useState(false);
    // const [verifyError,      setVerifyError]      = useState('');

    const emailTimerRef  = useRef<ReturnType<typeof setInterval> | null>(null);
    const emailGroupRef  = useRef<HTMLDivElement>(null);

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

    useEffect(() => { return () => clearEmailTimer(); }, []);

    useEffect(() => {
        if (!emailVerifyAlert) return;
        const id = setTimeout(() => setEmailVerifyAlert(false), 3000);
        return () => clearTimeout(id);
    }, [emailVerifyAlert]);

    // // ── 휴대폰 타이머 (기존 방식) ──
    // useEffect(() => {
    //     if (timer <= 0) return;
    //     const id = setInterval(() => setTimer((t) => t - 1), 1000);
    //     return () => clearInterval(id);
    // }, [timer]);

    const resetEmailVerify = () => {
        setEmailVerificationSent(false);
        setIsEmailVerified(false);
        setEmailVerificationCode('');
        setEmailVerifyError('');
        setEmailTimer(0);
        clearEmailTimer();
    };

    // const resetVerification = () => {
    //     setVerificationSent(false);
    //     setIsPhoneVerified(false);
    //     setVerificationCode('');
    //     setVerifyError('');
    //     setTimer(0);
    // };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
        if (nicknameCheckStatus !== 'idle') setNicknameCheckStatus('idle');
    };

    const handleCheckNickname = async () => {
        if (!name.trim()) return;
        setNicknameCheckStatus('checking');
        try {
            const isDuplicated = await authApi.checkNickname(name.trim());
            setNicknameCheckStatus(!isDuplicated ? 'available' : 'taken');
        } catch {
            setNicknameCheckStatus('taken');
        }
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        if (emailVerificationSent || isEmailVerified) resetEmailVerify();
    };

    // const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     setPhone(formatPhone(e.target.value));
    //     resetVerification();
    // };

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
    //     const rawPhone = phone.replace(/-/g, '');
    //     if (rawPhone.length < 10) { setVerifyError('휴대폰 번호를 올바르게 입력해주세요.'); return; }
    //     setVerifyError('');
    //     setIsSendingCode(true);
    //     try {
    //         await authApi.sendSmsCode(rawPhone, carrier);
    //         setVerificationSent(true);
    //         setVerificationCode('');
    //         setIsPhoneVerified(false);
    //         setTimer(SMS_TIMEOUT);
    //     } catch {
    //         setVerifyError('인증번호 발송에 실패했습니다. 다시 시도해주세요.');
    //     } finally {
    //         setIsSendingCode(false);
    //     }
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
    //     if (verificationCode.length !== 6) { setVerifyError('인증번호 6자리를 입력해주세요.'); return; }
    //     if (timer <= 0) { setVerifyError('인증 시간이 만료되었습니다. 재발송 후 다시 시도해주세요.'); return; }
    //     setVerifyError('');
    //     setIsVerifying(true);
    //     try {
    //         await authApi.verifySmsCode(phone.replace(/-/g, ''), verificationCode);
    //         setIsPhoneVerified(true);
    //         setTimer(0);
    //     } catch {
    //         setVerifyError('인증번호가 올바르지 않습니다.');
    //     } finally {
    //         setIsVerifying(false);
    //     }
    // };

    const pwStrength = getPwStrength(password);
    const st = strengthText(pwStrength);
    const pwMismatch = pwConfirm.length > 0 && password !== pwConfirm;
    const pwMatch   = pwConfirm.length > 0 && password === pwConfirm;

    const handleAgreeAll = (v: boolean) => {
        setAgreeAll(v); setAgreeTerms(v); setAgreePrivacy(v);
    };
    const handleTerms = (v: boolean) => {
        setAgreeTerms(v); setAgreeAll(v && agreePrivacy);
    };
    const handlePrivacy = (v: boolean) => {
        setAgreePrivacy(v); setAgreeAll(agreeTerms && v);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!name.trim())                 { setError('닉네임을 입력해주세요.'); return; }
        if (nicknameCheckStatus !== 'available') { setError('닉네임 중복체크를 완료해주세요.'); return; }
        if (!email)                       { setError('이메일을 입력해주세요.'); return; }
        if (password.length < 8)          { setError('비밀번호는 8자 이상이어야 합니다.'); return; }
        if (password !== pwConfirm)       { setError('비밀번호가 일치하지 않습니다.'); return; }
        if (!isEmailVerified) {
            setEmailVerifyAlert(true);
            emailGroupRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }
        // if (!isPhoneVerified)          { setError('휴대폰 본인인증을 완료해주세요.'); return; }
        if (!agreeTerms || !agreePrivacy) { setError('필수 약관에 동의해주세요.'); return; }

        setLoading(true);
        try {
            const signupData = await authApi.signup({
                email,
                password,
                nickname: name,
                // phoneNumber: rawPhone,
                // carrier: carrier || undefined,
            });
            const token = signupData.accessToken as string;
            const me    = await authApi.me(token);
            setAuth(me, token);
            onClose();
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
        <form className="modal-form" onSubmit={handleSubmit}>
            <div className="modal-form-group">
                <label className="modal-label" htmlFor="m-name">닉네임</label>
                <div className="modal-email-row">
                    <input
                        id="m-name"
                        className="modal-input"
                        type="text"
                        placeholder="사용할 닉네임을 입력하세요"
                        value={name}
                        onChange={handleNameChange}
                        autoComplete="nickname"
                    />
                    <button
                        type="button"
                        className="modal-verify-btn"
                        onClick={handleCheckNickname}
                        disabled={nicknameCheckStatus === 'checking' || !name.trim()}
                    >
                        {nicknameCheckStatus === 'checking' ? '확인 중...' : '중복체크'}
                    </button>
                </div>
                {nicknameCheckStatus === 'available' && (
                    <p className="modal-nickname-check available">사용가능한 닉네임입니다.</p>
                )}
                {nicknameCheckStatus === 'taken' && (
                    <p className="modal-nickname-check taken">사용중인 닉네임 입니다.</p>
                )}
            </div>

            {/* ── 이메일 인증 ── */}
            <div
                className={`modal-form-group${emailVerifyAlert ? ' modal-email-verify-alert' : ''}`}
                ref={emailGroupRef}
            >
                <label className="modal-label" htmlFor="m-su-email">이메일</label>
                <div className="modal-email-row">
                    <input
                        id="m-su-email"
                        className="modal-input"
                        type="email"
                        placeholder="example@email.com"
                        value={email}
                        onChange={handleEmailChange}
                        autoComplete="email"
                        disabled={isEmailVerified}
                    />
                    <button
                        type="button"
                        className="modal-verify-btn"
                        onClick={handleSendEmailVerification}
                        disabled={isSendingEmailCode || isEmailVerified || !email}
                    >
                        {isSendingEmailCode ? '발송 중...' : emailVerificationSent ? '재발송' : '인증요청'}
                    </button>
                </div>

                {isEmailVerified ? (
                    <p className="modal-phone-verified">&#10003; 인증완료</p>
                ) : emailVerificationSent && (
                    <div className="modal-verify-row">
                        <input
                            className="modal-input"
                            type="text"
                            placeholder="인증번호 8자리"
                            value={emailVerificationCode}
                            onChange={(e) => setEmailVerificationCode(e.target.value.slice(0, 8))}
                            maxLength={8}
                        />
                        {emailTimer > 0 && (
                            <span className={`modal-verify-timer${emailTimer <= 30 ? ' modal-timer-urgent' : ''}`}>
                                {formatTimer(emailTimer)}
                            </span>
                        )}
                        {emailTimer === 0 && emailVerificationSent && (
                            <span className="modal-verify-timer modal-timer-expired">만료</span>
                        )}
                        <button
                            type="button"
                            className="modal-verify-btn"
                            onClick={handleVerifyEmailCode}
                            disabled={isVerifyingEmail || emailVerificationCode.length !== 8 || emailTimer <= 0}
                        >
                            {isVerifyingEmail ? '확인 중...' : '인증확인'}
                        </button>
                    </div>
                )}

                {emailVerifyAlert && (
                    <p className="modal-email-verify-alert-msg">
                        ⚠️ 이메일 인증을 완료해주세요.
                    </p>
                )}
                {emailVerifyError && <p className="modal-verify-error">{emailVerifyError}</p>}
            </div>

            <div className="modal-form-group">
                <label className="modal-label" htmlFor="m-su-pw">비밀번호</label>
                <input
                    id="m-su-pw"
                    className="modal-input"
                    type="password"
                    placeholder="8자 이상 입력하세요"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                />
                {password.length > 0 && (
                    <>
                        <div className="modal-strength-bars">
                            {[1, 2, 3].map((i) => (
                                <div
                                    key={i}
                                    className={`modal-strength-bar ${pwStrength >= i ? strengthClass(pwStrength) : ''}`}
                                />
                            ))}
                        </div>
                        <span className="modal-input-hint" style={{ color: st.color }}>{st.label}</span>
                    </>
                )}
            </div>

            <div className="modal-form-group">
                <label className="modal-label" htmlFor="m-su-pwc">비밀번호 확인</label>
                <input
                    id="m-su-pwc"
                    className={`modal-input ${pwMismatch ? 'input-error' : ''}`}
                    type="password"
                    placeholder="비밀번호를 다시 입력하세요"
                    value={pwConfirm}
                    onChange={(e) => setPwConfirm(e.target.value)}
                    autoComplete="new-password"
                />
                {pwMismatch && <span className="modal-input-hint" style={{ color: '#ef4444' }}>비밀번호가 일치하지 않습니다.</span>}
                {pwMatch    && <span className="modal-input-hint" style={{ color: '#10b981' }}>비밀번호가 일치합니다.</span>}
            </div>

            {/* ── 휴대폰 인증 (주석 처리) ── */}
            {/* <div className="modal-form-group">
                <label className="modal-label" htmlFor="m-phone">휴대폰 번호</label>
                <div className="modal-phone-row">
                    <select
                        className="modal-carrier-select"
                        value={carrier}
                        onChange={(e) => { setCarrier(e.target.value); resetVerification(); }}
                        aria-label="통신사 선택"
                        disabled={isPhoneVerified}
                    >
                        {CARRIERS.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <input
                        id="m-phone"
                        className="modal-input"
                        type="tel"
                        placeholder="010-0000-0000"
                        value={phone}
                        onChange={handlePhoneChange}
                        inputMode="numeric"
                        disabled={isPhoneVerified}
                    />
                    <button
                        type="button"
                        className="modal-verify-btn"
                        onClick={handleSendVerification}
                        disabled={isSendingCode || isPhoneVerified || phone.replace(/-/g, '').length < 10}
                    >
                        {isSendingCode ? '발송 중...' : verificationSent ? '재발송' : '인증요청'}
                    </button>
                </div>

                {isPhoneVerified ? (
                    <p className="modal-phone-verified">&#10003; 인증완료</p>
                ) : verificationSent && (
                    <div className="modal-verify-row">
                        <input
                            className="modal-input"
                            type="text"
                            placeholder="인증번호 6자리"
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            inputMode="numeric"
                            maxLength={6}
                        />
                        {timer > 0 && <span className="modal-verify-timer">{formatTimer(timer)}</span>}
                        <button
                            type="button"
                            className="modal-verify-btn"
                            onClick={handleVerifyCode}
                            disabled={isVerifying || verificationCode.length !== 6 || timer <= 0}
                        >
                            {isVerifying ? '확인 중...' : '인증확인'}
                        </button>
                    </div>
                )}

                {verifyError && <p className="modal-verify-error">{verifyError}</p>}
            </div> */}

            <div className="modal-terms-box">
                <label className="modal-terms-item">
                    <input type="checkbox" checked={agreeAll} onChange={(e) => handleAgreeAll(e.target.checked)} />
                    <span className="modal-terms-label" style={{ fontWeight: 700 }}>전체 동의</span>
                </label>
                <div className="modal-terms-divider" />
                <label className="modal-terms-item">
                    <input type="checkbox" checked={agreeTerms} onChange={(e) => handleTerms(e.target.checked)} />
                    <span className="modal-terms-label">
                        <button type="button" className="modal-terms-link" onClick={() => setLegalModal('terms')}>이용약관</button>
                        {' '}동의 (필수)
                    </span>
                </label>
                <label className="modal-terms-item">
                    <input type="checkbox" checked={agreePrivacy} onChange={(e) => handlePrivacy(e.target.checked)} />
                    <span className="modal-terms-label">
                        <button type="button" className="modal-terms-link" onClick={() => setLegalModal('privacy')}>개인정보 처리방침</button>
                        {' '}동의 (필수)
                    </span>
                </label>
            </div>

            {legalModal && (
                <LegalModal type={legalModal} onClose={() => setLegalModal(null)} />
            )}

            {error && <p className="modal-error">{error}</p>}

            <button type="submit" className="modal-submit-btn" disabled={loading}>
                {loading ? '가입 중...' : '가입하기'}
            </button>

            <p className="modal-switch">
                이미 계정이 있으신가요?{' '}
                <button type="button" className="modal-switch-link" onClick={onSwitchTab}>
                    로그인
                </button>
            </p>
        </form>
    );
}

/* ───────── AuthModal ───────── */
export default function AuthModal({ initialTab = 'login', onClose }: Props) {
    const [tab, setTab] = useState<Tab>(initialTab);
    const cardRef = useRef<HTMLDivElement>(null);

    // ESC 키로 닫기
    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [onClose]);

    // 모달 열릴 때 스크롤 잠금
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = ''; };
    }, []);

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
            onClose();
        }
    };

    return (
        <div className="auth-modal-backdrop" onClick={handleBackdropClick}>
            <div className="auth-modal-card" ref={cardRef}>
                {/* 닫기 버튼 */}
                <button className="auth-modal-close" onClick={onClose} aria-label="닫기">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                </button>

                {/* 로고 */}
                <div className="auth-modal-logo">
                    <div className="auth-modal-logo-mark" />
                    <span className="auth-modal-logo-text">Reptile Mall</span>
                </div>

                {/* 탭 */}
                <div className="auth-modal-tabs">
                    <button
                        className={`auth-modal-tab ${tab === 'login' ? 'tab-active' : ''}`}
                        onClick={() => setTab('login')}
                        type="button"
                    >
                        로그인
                    </button>
                    <button
                        className={`auth-modal-tab ${tab === 'signup' ? 'tab-active' : ''}`}
                        onClick={() => setTab('signup')}
                        type="button"
                    >
                        회원가입
                    </button>
                </div>

                {/* 폼 */}
                <div className="auth-modal-body">
                    {tab === 'login'
                        ? <LoginForm  onSwitchTab={() => setTab('signup')} onClose={onClose} />
                        : <SignupForm onSwitchTab={() => setTab('login')}  onClose={onClose} />
                    }
                </div>
            </div>
        </div>
    );
}
