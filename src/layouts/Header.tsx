import { useEffect } from "react";
import "./style/Header.css";
import { NavLink, Link } from "react-router-dom";

// 고객문의 버튼 및 appBtn link 호환 스타일 동적 주입
const headerExtraStyles = `
.appBtn {
    text-decoration: none;
    display: inline-flex;
    align-items: center;
}
.appBtnSupport {
    background: transparent;
    border: 1.5px solid #d1d5db !important;
    color: #6b7280 !important;
    font-size: 13px;
    padding: 8px 13px;
    transition: all 0.2s ease;
    border-radius: 12px;
    font-weight: 600;
    cursor: pointer;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
}
.appBtnSupport:hover {
    border-color: #10b981 !important;
    background: #f0fdf4 !important;
    color: #059669 !important;
}
.appOnlyPC { display: inline-flex; }
@media (max-width: 720px) {
    .appOnlyPC { display: none !important; }
}
`;

type NavItem = {
    label: string;
    to: string;
    external?: boolean;
};

type HeaderProps = {
    logoText?: string;
    navItems?: NavItem[];
    onLoginClick?: () => void;
    onSignupClick?: () => void;
    onMenuClick?: () => void;
    showMenuButton?: boolean;
};

function isExternalLink(to: string) {
    return to.startsWith("http") || to.startsWith("#");
}

export default function Header({
    logoText = "Logo",
    navItems = [],
    onLoginClick,
    onSignupClick,
    onMenuClick,
    showMenuButton = true,
}: HeaderProps) {
    useEffect(() => {
        const style = document.createElement("style");
        style.id = "header-extra-styles";
        style.textContent = headerExtraStyles;
        document.head.appendChild(style);
        return () => {
            const el = document.getElementById("header-extra-styles");
            if (el) el.remove();
        };
    }, []);

    return (
        <header className="appHeader">
            <div className="appContainer appHeaderInner">
                <div className="appBrand">
                    <Link to="/" className="appBrandLink">
                        <div className="appLogoMark" aria-hidden="true" />
                        <span className="appLogoText">{logoText}</span>
                    </Link>
                    
                    {showMenuButton && (
                        <button
                            className="appSidebarToggle"
                            type="button"
                            aria-label="사이드바 열기"
                            onClick={onMenuClick}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </button>
                    )}
                </div>

                <nav className="appNav" aria-label="메인 메뉴">
                    {navItems.map((item) => {
                        const external = item.external || isExternalLink(item.to);
                        if (external) {
                            return (
                                <a key={item.label} className="appNavLink" href={item.to}>
                                    {item.label}
                                </a>
                            );
                        }
                        return (
                            <NavLink key={item.label} className="appNavLink" to={item.to} end>
                                {item.label}
                            </NavLink>
                        );
                    })}
                </nav>

                <div className="appHeaderActions">
                    {/* 모바일용 햄버거 버튼 */}
                    <button
                        className="appIconBtn appOnlyMobile"
                        type="button"
                        aria-label="메뉴 열기"
                        onClick={onMenuClick}
                    >
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                            <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </button>

                    {/* 고객문의 버튼 (로그인 버튼 왼쪽) */}
                    <Link to="/support" className="appBtnSupport appOnlyPC">
                        고객문의
                    </Link>

                    <button className="appBtn appBtnGhost" onClick={onLoginClick}>
                        로그인
                    </button>

                    <button className="appBtn appBtnPrimary" onClick={onSignupClick}>
                        회원가입
                    </button>
                </div>
            </div>
        </header>
    );
}
