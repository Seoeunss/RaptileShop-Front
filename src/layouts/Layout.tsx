// src/layouts/Layout.tsx
import Header from "./Header";
import MobileBottomNav from "./MobileBottomNav";
import { Outlet, useNavigate } from "react-router-dom";
import { headerNavItems } from "../router/routes";

export default function Layout() {
    const navigate = useNavigate();

    return (
        <>
            <Header
                navItems={headerNavItems}
                rightButtonText="회원가입"
                onRightButtonClick={() => navigate("/signup")}
                onMenuClick={() => {
                    // 헤더 햄버거 -> 드로어 연결은 Day3/Day4에서 붙이면 됨
                }}
            />
            <main className="layout-main">
                <Outlet />
            </main>
            <MobileBottomNav />
        </>
    );
}