// src/layouts/Sidebar.tsx
import { NavLink } from "react-router-dom";
import { sidebarNavItems } from "../../router/routes";
import { useAuthStore } from "../../store/authStore";

type SidebarProps = {
    onNavigate?: () => void;
};

export default function Sidebar({ onNavigate }: SidebarProps) {
    const { user } = useAuthStore();
    const isAdmin = user?.role === 'ADMIN';

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
                        onClick={onNavigate}
                        end
                    >
                        {item.label}
                    </NavLink>
                ))}
                {isAdmin && (
                    <>
                        <div className="sidebarDivider" />
                        <div className="sidebarAdminLabel">관리자</div>
                        <NavLink
                            to="/genetics/admin"
                            className="sidebarItem sidebarAdminItem"
                            onClick={onNavigate}
                            end
                        >
                            유전자 데이터 관리
                        </NavLink>
                    </>
                )}
            </nav>
        </div>
    );
}