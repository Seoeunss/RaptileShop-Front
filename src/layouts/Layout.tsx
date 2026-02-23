import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import Header from "./Header";
import MobileBottomNav from "./MobileBottomNav";
import Sidebar from "../components/layout/Sidebar";
import Footer from "../components/layout/Footer";

import { headerNavItems } from "../router/routes";
import "./style/Layout.css";

export default function Layout() {
    const navigate = useNavigate();
    const [drawerOpen, setDrawerOpen] = useState(false);

    const openDrawer = () => setDrawerOpen(true);
    const closeDrawer = () => setDrawerOpen(false);

    return (
        <div className="appRoot">
            <Header
                navItems={headerNavItems}
                rightButtonText="회원가입"
                onRightButtonClick={() => navigate("/signup")}
                onMenuClick={openDrawer} // ✅ 모바일 메뉴 버튼이 드로어 열기
            />

            <div className="appBody">
                {/* ✅ PC 사이드바 */}
                <aside className="sidebarDesktop">
                    <Sidebar variant="desktop" />
                </aside>

                {/* ✅ 본문 + 푸터 */}
                <div className="mainCol">
                    <main className="contentContainer">
                        <Outlet />
                    </main>
                    <Footer />
                </div>
            </div>

            {/* ✅ 모바일: 오버레이 + 드로어 */}
            {drawerOpen && <div className="drawerOverlay" onClick={closeDrawer} />}
            <aside className={`drawerSidebar ${drawerOpen ? "open" : ""}`}>
                <Sidebar variant="mobile" onNavigate={closeDrawer} />
            </aside>

            {/* ✅ 모바일 하단 네비 */}
            <MobileBottomNav />
        </div>
    );
}