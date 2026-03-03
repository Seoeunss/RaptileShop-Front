import "./style/Header.css";
import { NavLink, Link } from "react-router-dom";

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
    return (
        <header className="appHeader">
            <div className="appContainer appHeaderInner">
                <div className="appBrand">
                    {/* 로고를 Link로 감싸서 홈으로 이동 */}
                    <Link to="/" className="appBrandLink">
                        <div className="appLogoMark" aria-hidden="true" />
                        <span className="appLogoText">{logoText}</span>
                    </Link>
                    
                    {/* 사이드바 토글 버튼 */}
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
                            <NavLink
                                key={item.label}
                                className="appNavLink"
                                to={item.to}
                                end
                            >
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