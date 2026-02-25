import { useState, useEffect, useRef } from 'react';
import './AuthModal.css';

type Tab = 'login' | 'signup';

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

/* ───────── 로그인 폼 ───────── */
function LoginForm({ onSwitchTab }: { onSwitchTab: () => void }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!email || !password) { setError('이메일과 비밀번호를 모두 입력해주세요.'); return; }
        // TODO: 실제 로그인 API 연동
        alert('로그인 성공 (mock)');
    };

    return (
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

            <div className="modal-footer-row">
                <button type="button" className="modal-link-btn">비밀번호 찾기</button>
            </div>

            {error && <p className="modal-error">{error}</p>}

            <button type="submit" className="modal-submit-btn">로그인</button>

            <p className="modal-switch">
                계정이 없으신가요?{' '}
                <button type="button" className="modal-switch-link" onClick={onSwitchTab}>
                    회원가입
                </button>
            </p>
        </form>
    );
}

/* ───────── 회원가입 폼 ───────── */
function SignupForm({ onSwitchTab }: { onSwitchTab: () => void }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [pwConfirm, setPwConfirm] = useState('');
    const [agreeAll, setAgreeAll] = useState(false);
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [agreePrivacy, setAgreePrivacy] = useState(false);
    const [error, setError] = useState('');

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!name.trim())              { setError('이름을 입력해주세요.'); return; }
        if (!email)                    { setError('이메일을 입력해주세요.'); return; }
        if (password.length < 8)       { setError('비밀번호는 8자 이상이어야 합니다.'); return; }
        if (password !== pwConfirm)    { setError('비밀번호가 일치하지 않습니다.'); return; }
        if (!agreeTerms || !agreePrivacy) { setError('필수 약관에 동의해주세요.'); return; }
        // TODO: 실제 회원가입 API 연동
        alert('회원가입 성공 (mock)');
    };

    return (
        <form className="modal-form" onSubmit={handleSubmit}>
            <div className="modal-form-group">
                <label className="modal-label" htmlFor="m-name">이름</label>
                <input
                    id="m-name"
                    className="modal-input"
                    type="text"
                    placeholder="이름을 입력하세요"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="name"
                />
            </div>

            <div className="modal-form-group">
                <label className="modal-label" htmlFor="m-su-email">이메일</label>
                <input
                    id="m-su-email"
                    className="modal-input"
                    type="email"
                    placeholder="example@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                />
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

            <div className="modal-terms-box">
                <label className="modal-terms-item">
                    <input type="checkbox" checked={agreeAll} onChange={(e) => handleAgreeAll(e.target.checked)} />
                    <span className="modal-terms-label" style={{ fontWeight: 700 }}>전체 동의</span>
                </label>
                <div className="modal-terms-divider" />
                <label className="modal-terms-item">
                    <input type="checkbox" checked={agreeTerms} onChange={(e) => handleTerms(e.target.checked)} />
                    <span className="modal-terms-label">
                        <a href="#" className="modal-terms-link" onClick={(e) => e.preventDefault()}>이용약관</a> 동의 (필수)
                    </span>
                </label>
                <label className="modal-terms-item">
                    <input type="checkbox" checked={agreePrivacy} onChange={(e) => handlePrivacy(e.target.checked)} />
                    <span className="modal-terms-label">
                        <a href="#" className="modal-terms-link" onClick={(e) => e.preventDefault()}>개인정보 처리방침</a> 동의 (필수)
                    </span>
                </label>
            </div>

            {error && <p className="modal-error">{error}</p>}

            <button type="submit" className="modal-submit-btn">가입하기</button>

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
                        ? <LoginForm  onSwitchTab={() => setTab('signup')} />
                        : <SignupForm onSwitchTab={() => setTab('login')}  />
                    }
                </div>
            </div>
        </div>
    );
}
