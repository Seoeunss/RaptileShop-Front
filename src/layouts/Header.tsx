import "./style/Header.css";
import { NavLink } from "react-router-dom";

type NavItem = {
    label: string;
    to: string;           // ✅ href -> to
    external?: boolean;   // ✅ 외부 링크/해시용 (선택)
};

type HeaderProps = {
    logoText?: string;
    navItems?: NavItem[];
    onLoginClick?: () => void;
    onSignupClick?: () => void;

    /** 모바일 햄버거 버튼 쓸거면 연결 */
    onMenuClick?: () => void;
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
                               }: HeaderProps) {
    return (
        <header className="appHeader">
            <div className="appContainer appHeaderInner">
                <div className="appBrand">
                    <div className="appLogoMark" aria-hidden="true" />
                    <span className="appLogoText">{logoText}</span>
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
                                end   // 정확히 일치할 때만 active (prefix 오탐 방지)
                            >
                                {item.label}
                            </NavLink>
                        );
                    })}
                </nav>

                <div className="appHeaderActions">
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
