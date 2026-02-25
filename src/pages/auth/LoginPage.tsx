import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './style/LoginPage.css';

export default function LoginPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('이메일과 비밀번호를 모두 입력해주세요.');
            return;
        }

        // TODO: 실제 로그인 API 연동
        navigate('/');
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
                        <input
                            id="email"
                            className="form-input"
                            type="email"
                            placeholder="이메일을 입력하세요"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="email"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="password">비밀번호</label>
                        <input
                            id="password"
                            className="form-input"
                            type="password"
                            placeholder="비밀번호를 입력하세요"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="current-password"
                        />
                    </div>

                    <div className="form-footer">
                        <button type="button" className="link-btn">비밀번호 찾기</button>
                    </div>

                    {error && (
                        <p style={{ margin: 0, fontSize: 13, color: '#ef4444', textAlign: 'center' }}>
                            {error}
                        </p>
                    )}

                    <button type="submit" className="auth-btn">로그인</button>
                </form>

                <p className="auth-switch">
                    계정이 없으신가요?{' '}
                    <Link to="/signup" className="auth-link">회원가입</Link>
                </p>
            </div>
        </div>
    );
}
