// src/layouts/MobileBottomNav.tsx
import { NavLink } from "react-router-dom";
import { bottomNavItems } from "../router/routes";

export default function MobileBottomNav() {
    return (
        <nav
            className="mobile-bottom-nav"
            aria-label="모바일 하단 네비"
            style={{
                position: "sticky",
                bottom: 0,
                display: "none",
                gap: 12,
                padding: 12,
                borderTop: "1px solid rgba(0,0,0,0.08)",
                background: "#fff",
            }}
        >
            {bottomNavItems.map((item) => (
                <NavLink
                    key={item.to}
                    to={item.to}
                    style={({ isActive }) => ({
                        textDecoration: "none",
                        fontWeight: isActive ? 700 : 500,
                        opacity: isActive ? 1 : 0.75,
                    })}
                    end={item.to === "/"}
                >
                    {item.label}
                </NavLink>
            ))}
        </nav>
    );
}