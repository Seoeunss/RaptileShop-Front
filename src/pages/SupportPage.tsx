// src/pages/SupportPage.tsx
import { useEffect } from "react";

const supportStyles = `
.support-root {
    min-height: calc(100vh - 68px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 48px 16px;
    background: linear-gradient(145deg, #f0fdf4 0%, #f0f9ff 50%, #fafafa 100%);
}
.support-card {
    background: #ffffff;
    border-radius: 20px;
    padding: 48px 40px;
    max-width: 480px;
    width: 100%;
    box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 8px 32px rgba(0,0,0,0.08);
    text-align: center;
}
.support-icon-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: linear-gradient(135deg, #d1fae5, #bfdbfe);
    margin: 0 auto 20px;
    color: #059669;
}
.support-icon { width: 32px; height: 32px; }
.support-title {
    font-size: 1.6rem;
    font-weight: 700;
    color: #111827;
    margin: 0 0 4px;
    letter-spacing: -0.02em;
}
.support-subtitle {
    font-size: 0.875rem;
    color: #6b7280;
    margin: 0 0 20px;
}
.support-divider {
    height: 1px;
    background: linear-gradient(90deg, transparent, #e5e7eb 30%, #e5e7eb 70%, transparent);
    margin: 0 0 24px;
}
.support-greeting {
    font-size: 0.975rem;
    color: #374151;
    line-height: 1.75;
    margin: 0 0 16px;
}
.support-badge {
    display: inline-block;
    background: #fef3c7;
    color: #d97706;
    font-size: 0.78rem;
    font-weight: 600;
    padding: 2px 8px;
    border-radius: 99px;
    border: 1px solid #fde68a;
    vertical-align: middle;
}
.support-desc {
    font-size: 0.9rem;
    color: #6b7280;
    margin: 0 0 16px;
}
.support-email-box {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: #f0fdf4;
    border: 1.5px solid #6ee7b7;
    border-radius: 10px;
    padding: 12px 20px;
    font-size: 0.95rem;
    font-weight: 600;
    color: #065f46;
    text-decoration: none;
    transition: all 0.2s ease;
    margin-bottom: 24px;
}
.support-email-box:hover {
    background: #d1fae5;
    border-color: #34d399;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(52,211,153,0.2);
}
.support-email-icon { width: 18px; height: 18px; flex-shrink: 0; color: #10b981; }
.support-hours-card {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 16px 20px;
    text-align: left;
}
.support-hours-header {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.85rem;
    font-weight: 600;
    color: #374151;
    margin-bottom: 8px;
}
.support-hours-header svg { color: #6b7280; }
.support-hours-text { font-size: 1rem; color: #111827; margin: 0 0 6px; }
.support-hours-note { font-size: 0.82rem; color: #9ca3af; margin: 0; line-height: 1.5; }
@media (max-width: 480px) {
    .support-card { padding: 36px 24px; }
    .support-title { font-size: 1.4rem; }
}
`;

export default function SupportPage() {
    useEffect(() => {
        const style = document.createElement("style");
        style.id = "support-page-styles";
        style.textContent = supportStyles;
        document.head.appendChild(style);
        return () => {
            const existing = document.getElementById("support-page-styles");
            if (existing) existing.remove();
        };
    }, []);

    return (
        <div className="support-root">
            <div className="support-card">
                <div className="support-icon-wrap">
                    <svg className="support-icon" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="2.5"/>
                        <path d="M16 20c0-4.418 3.582-8 8-8s8 3.582 8 8c0 3.5-2.5 6-5 7.5V30" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                        <circle cx="24" cy="35" r="1.5" fill="currentColor"/>
                    </svg>
                </div>

                <h1 className="support-title">고객 문의 안내</h1>
                <p className="support-subtitle">파충류 쇼핑몰</p>

                <div className="support-divider" />

                <p className="support-greeting">
                    안녕하세요. <strong>[파충류 쇼핑몰]</strong> 입니다.
                    <br />
                    현재 <span className="support-badge">베타 버전</span> 운영 중입니다.
                </p>

                <p className="support-desc">
                    문의 사항은 아래 이메일로 보내주세요.
                </p>

                <a
                    href="mailto:reptileShop.support@gmail.com"
                    className="support-email-box"
                >
                    <svg className="support-email-icon" viewBox="0 0 24 24" fill="none">
                        <rect x="2" y="4" width="20" height="16" rx="3" stroke="currentColor" strokeWidth="1.8"/>
                        <path d="M2 7l10 7 10-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                    </svg>
                    reptileShop.support@gmail.com
                </a>

                <div className="support-hours-card">
                    <div className="support-hours-header">
                        <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
                            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8"/>
                            <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span>운영 시간</span>
                    </div>
                    <p className="support-hours-text">평일 <strong>10:00 ~ 18:00</strong></p>
                    <p className="support-hours-note">
                        접수된 문의는 순차적으로 답변드리고 있습니다.
                    </p>
                </div>
            </div>
        </div>
    );
}
