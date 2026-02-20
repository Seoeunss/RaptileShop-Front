import "./style/Header.css";

type NavItem = {
    label: string;
    href: string;
};

type HeaderProps = {
    logoText?: string;
    navItems?: NavItem[];
    rightButtonText?: string;
    onRightButtonClick?: () => void;

    /** 모바일 햄버거 버튼 쓸거면 연결 */
    onMenuClick?: () => void;
};

export default function Header({
                                      logoText = "Logo",
                                      navItems = [
                                          { label: "실용팁", href: "#tips" },
                                          { label: "공지사항", href: "#notice" },
                                          { label: "고객센터", href: "#support" },
                                          { label: "마이룸", href: "#mypage" },
                                          { label: "로그인", href: "#login" },
                                      ],
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
                    {navItems.map((item) => (
                        <a key={item.label} className="appNavLink" href={item.href}>
                            {item.label}
                        </a>
                    ))}
                </nav>

                <div className="appHeaderActions">
                    {/* 모바일 햄버거(원하면 Layout에서 Drawer 연결) */}
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
