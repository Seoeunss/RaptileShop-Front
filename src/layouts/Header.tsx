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
    rightButtonText?: string;
    onRightButtonClick?: () => void;

    /** 모바일 햄버거 버튼 쓸거면 연결 */
    onMenuClick?: () => void;
};

function isExternalLink(to: string) {
    return to.startsWith("http") || to.startsWith("#");
}

export default function Header({
                                   logoText = "Logo",
                                   navItems = [],
                                   rightButtonText = "회원가입",
                                   onRightButtonClick,
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
                                end={item.to === "/"}   // 홈일 때 active 꼬임 방지
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

                    <button className="appBtn appBtnPrimary" onClick={onRightButtonClick}>
                        {rightButtonText}
                    </button>
                </div>
            </div>
        </header>
    );
}