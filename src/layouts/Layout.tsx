// src/layouts/Layout.tsx
import { useState } from "react";
import Header from "./Header";
import MobileBottomNav from "./MobileBottomNav";
import AuthModal from "../components/auth/AuthModal";
import Sidebar from "../components/layout/Sidebar";
import { Outlet } from "react-router-dom";
import { headerNavItems } from "../router/routes";
import { useAuthStore } from "../store/authStore";
import "./style/Layout.css";

type AuthTab = "login" | "signup" | null;

export default function Layout() {
    const [authModal, setAuthModal] = useState<AuthTab>(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { isAuthenticated, user, clearAuth } = useAuthStore();

    const handleLogout = () => {
        clearAuth();
    };

    return (
        <div className="appRoot">
            <Header
                logoText="파충류 마켓"
                navItems={headerNavItems} // 빈 배열 (메뉴 없음)
                onLoginClick={() => setAuthModal("login")}
                onSignupClick={() => setAuthModal("signup")}
                onMenuClick={() => setSidebarOpen(true)}
                isAuthenticated={isAuthenticated}
                userName={user?.nickname}
                onLogoutClick={handleLogout}
            />

            {/* 드로어 오버레이 */}
            {sidebarOpen && (
                <div 
                    className="drawerOverlay"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* 드로어 사이드바만 존재 (PC/모바일 공통) */}
            <aside className={`drawerSidebar ${sidebarOpen ? 'open' : ''}`}>
                <Sidebar onNavigate={() => setSidebarOpen(false)} />
            </aside>

            {/* 메인 콘텐츠 - 전체 화면 사용 */}
            <main className="layout-main">
                <Outlet />
            </main>

            <MobileBottomNav />

            {authModal && (
                <AuthModal
                    initialTab={authModal}
                    onClose={() => setAuthModal(null)}
                />
            )}
        </div>
    );
}