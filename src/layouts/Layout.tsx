// src/layouts/Layout.tsx
import { useState } from "react";
import Header from "./Header";
import MobileBottomNav from "./MobileBottomNav";
import AuthModal from "../components/auth/AuthModal";
import { Outlet } from "react-router-dom";
import { headerNavItems } from "../router/routes";

type AuthTab = "login" | "signup" | null;

export default function Layout() {
    const [authModal, setAuthModal] = useState<AuthTab>(null);

    return (
        <>
            <Header
                navItems={headerNavItems}
                onLoginClick={() => setAuthModal("login")}
                onSignupClick={() => setAuthModal("signup")}
                onMenuClick={() => {
                    // 헤더 햄버거 -> 드로어 연결은 Day3/Day4에서 붙이면 됨
                }}
            />
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
        </>
    );
}
