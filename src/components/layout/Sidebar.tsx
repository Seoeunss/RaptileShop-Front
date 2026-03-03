// src/layouts/Sidebar.tsx
import { NavLink } from "react-router-dom";
import { sidebarNavItems } from "../../router/routes";

type SidebarProps = {
    onNavigate?: () => void;
};

export default function Sidebar({ onNavigate }: SidebarProps) {
    return (
        <div className="sidebar">
            <div className="sidebarHeader">
                <div className="sidebarTitle">메뉴</div>
                <button 
                    className="sidebarCloseBtn"
                    onClick={onNavigate}
                    aria-label="메뉴 닫기"
                >
                    ✕
                </button>
            </div>
            
            <nav className="sidebarList" aria-label="사이드바 메뉴">
                {sidebarNavItems.map((item) => (
                    <NavLink
                        key={item.label}
                        to={item.to}
                        className="sidebarItem"
                        onClick={onNavigate} // 메뉴 클릭하면 사이드바 닫힘
                        end
                    >
                        {item.label}
                    </NavLink>
                ))}
            </nav>
        </div>
    );
}