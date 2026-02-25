// src/layouts/Sidebar.tsx
import { NavLink } from "react-router-dom";
import { sidebarNavItems } from "../../router/routes";

type Props = {
    variant: "desktop" | "mobile";
    onNavigate?: () => void;
};

export default function Sidebar({ variant, onNavigate }: Props) {
    return (
        <div className="sidebar">
            {variant === "mobile" && (
                <div className="sidebarHeader">
                    <div className="sidebarTitle">메뉴</div>
                    <button className="sidebarCloseBtn" onClick={onNavigate} aria-label="닫기">
                        ✕
                    </button>
                </div>
            )}

            <div className="sidebarList">
                {sidebarNavItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        end
                        onClick={onNavigate}
                        className={({ isActive }) => `sidebarItem ${isActive ? "active" : ""}`}
                    >
                        {item.label}
                    </NavLink>
                ))}
            </div>
        </div>
    );
}