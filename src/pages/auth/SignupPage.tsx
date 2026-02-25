import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './style/SignupPage.css';

function getPasswordStrength(pw: string): 0 | 1 | 2 | 3 {
    if (pw.length === 0) return 0;
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw) || /[!@#$%^&*]/.test(pw)) score++;
    if (pw.length >= 12) score++;
    return score as 0 | 1 | 2 | 3;
}

function strengthLabel(strength: number) {
    if (strength === 1) return '약함';
    if (strength === 2) return '보통';
    if (strength === 3) return '강함';
    return '';
}

function strengthColor(strength: number) {
    if (strength === 1) return '#ef4444';
    if (strength === 2) return '#f59e0b';
    if (strength === 3) return '#10b981';
    return '';
}

export default function SignupPage() {
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [agreeAll, setAgreeAll] = useState(false);
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [agreePrivacy, setAgreePrivacy] = useState(false);
    const [error, setError] = useState('');

    const pwStrength = getPasswordStrength(password);

    const handleAgreeAll = (checked: boolean) => {
        setAgreeAll(checked);
        setAgreeTerms(checked);
        setAgreePrivacy(checked);
    };

    const handleAgreeTerms = (checked: boolean) => {
        setAgreeTerms(checked);
        setAgreeAll(checked && agreePrivacy);
    };

    const handleAgreePrivacy = (checked: boolean) => {
        setAgreePrivacy(checked);
        setAgreeAll(agreeTerms && checked);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!name.trim()) { setError('이름을 입력해주세요.'); return; }
        if (!email) { setError('이메일을 입력해주세요.'); return; }
        if (password.length < 8) { setError('비밀번호는 8자 이상이어야 합니다.'); return; }
        if (password !== passwordConfirm) { setError('비밀번호가 일치하지 않습니다.'); return; }
        if (!agreeTerms || !agreePrivacy) { setError('필수 약관에 동의해주세요.'); return; }

        // TODO: 실제 회원가입 API 연동
        navigate('/login');
    };

    const isPasswordMismatch = passwordConfirm.length > 0 && password !== passwordConfirm;

    return (
        <div className="signup-page">
            <div className="signup-card">
                <h1 className="signup-title">회원가입</h1>
                <p className="signup-desc">Reptile Mall 계정을 만들어보세요</p>

                <form className="signup-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="signup-name">이름</label>
                        <input
                            id="signup-name"
                            className="form-input"
                            type="text"
                            placeholder="이름을 입력하세요"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            autoComplete="name"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="signup-email">이메일</label>
                        <input
                            id="signup-email"
                            className="form-input"
                            type="email"
                            placeholder="example@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="email"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="signup-password">비밀번호</label>
                        <input
                            id="signup-password"
                            className="form-input"
                            type="password"
                            placeholder="8자 이상 입력하세요"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="new-password"
                        />
                        {password.length > 0 && (
                            <>
                                <div className="password-strength">
                                    {[1, 2, 3].map((i) => (
                                        <div
                                            key={i}
                                            className={`strength-bar ${
                                                pwStrength >= i
                                                    ? pwStrength === 1
                                                        ? 'active-weak'
                                                        : pwStrength === 2
                                                        ? 'active-medium'
                                                        : 'active-strong'
                                                    : ''
                                            }`}
                                        />
                                    ))}
                                </div>
                                <p className="password-hint" style={{ color: strengthColor(pwStrength) }}>
                                    {strengthLabel(pwStrength)}
                                </p>
                            </>
                        )}
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="signup-password-confirm">비밀번호 확인</label>
                        <input
                            id="signup-password-confirm"
                            className="form-input"
                            type="password"
                            placeholder="비밀번호를 다시 입력하세요"
                            value={passwordConfirm}
                            onChange={(e) => setPasswordConfirm(e.target.value)}
                            autoComplete="new-password"
                            style={isPasswordMismatch ? { borderColor: '#ef4444' } : {}}
                        />
                        {isPasswordMismatch && (
                            <p className="password-hint" style={{ color: '#ef4444' }}>
                                비밀번호가 일치하지 않습니다.
                            </p>
                        )}
                        {!isPasswordMismatch && passwordConfirm.length > 0 && password === passwordConfirm && (
                            <p className="password-hint" style={{ color: '#10b981' }}>
                                비밀번호가 일치합니다.
                            </p>
                        )}
                    </div>

                    <div className="terms-group">
                        <label className="terms-item">
                            <input
                                type="checkbox"
                                checked={agreeAll}
                                onChange={(e) => handleAgreeAll(e.target.checked)}
                            />
                            <span className="terms-label" style={{ fontWeight: 700 }}>전체 동의</span>
                        </label>
                        <div className="terms-divider" />
                        <label className="terms-item">
                            <input
                                type="checkbox"
                                checked={agreeTerms}
                                onChange={(e) => handleAgreeTerms(e.target.checked)}
                            />
                            <span className="terms-label required-mark">
                                <a href="#" className="terms-link" onClick={(e) => e.preventDefault()}>이용약관</a> 동의
                            </span>
                        </label>
                        <label className="terms-item">
                            <input
                                type="checkbox"
                                checked={agreePrivacy}
                                onChange={(e) => handleAgreePrivacy(e.target.checked)}
                            />
                            <span className="terms-label required-mark">
                                <a href="#" className="terms-link" onClick={(e) => e.preventDefault()}>개인정보 처리방침</a> 동의
                            </span>
                        </label>
                    </div>

                    {error && <p className="signup-error">{error}</p>}

                    <button type="submit" className="signup-btn">가입하기</button>
                </form>

                <p className="auth-switch">
                    이미 계정이 있으신가요?{' '}
                    <Link to="/login" className="auth-link">로그인</Link>
                </p>
            </div>
        </div>
    );
}
