// src/router/routes.tsx
import HomePage from "../pages/HomePage";
import ProductListPage from "../pages/product/ProductListPage";
import ProductDetailPage from "../pages/product/ProductDetailPage";
import ProductCreatePage from "../pages/product/ProductCreatePage";
import ProductEditPage from "../pages/product/ProductEditPage";
import LoginPage from "../pages/auth/LoginPage";
import SignupPage from "../pages/auth/SignupPage";
import ChangePasswordPage from "../pages/auth/ChangePasswordPage";
import OrderPage from "../pages/order/OrderPage";
import PaymentSuccessPage from "../pages/payments/PaymentSuccessPage";
import PaymentFailPage from "../pages/payments/PaymentFailPage";
import ChatListPage from "../pages/chat/ChatListPage";
import ChatPage from "../pages/chat/ChatPage";
import SupportPage from "../pages/SupportPage";
import GeneticsCalculatorPage from "../pages/genetics/GeneticsCalculatorPage";
import GeneticsAdminPage from "../pages/genetics/GeneticsAdminPage";
import type {JSX} from "react";

export type RouteDef = {
    path: string;
    element: JSX.Element;
    headerLabel?: string;
    bottomLabel?: string;
};

export type NavItem = {
    label: string;
    to: string;
};

export const appRoutes: RouteDef[] = [
    { path: "/", element: <HomePage />, bottomLabel: "홈" },
    { path: "/products", element: <ProductListPage />, headerLabel: "상품목록", bottomLabel: "목록" },
    { path: "/products/new", element: <ProductCreatePage /> },
    { path: "/products/:id", element: <ProductDetailPage /> },
    { path: "/products/:id/edit", element: <ProductEditPage /> },
    { path: "/login", element: <LoginPage /> },
    { path: "/signup", element: <SignupPage /> },
    { path: "/change-password", element: <ChangePasswordPage /> },
    { path: "/chat", element: <ChatListPage />, headerLabel: "채팅", bottomLabel: "채팅" },
    { path: "/genetics", element: <GeneticsCalculatorPage />, headerLabel: "유전자 계산기" },
    { path: "/genetics/admin", element: <GeneticsAdminPage /> },
    { path: "/chat/:id", element: <ChatPage /> },
    { path: "/orders/:id", element: <OrderPage /> },
    { path: "/payment/success", element: <PaymentSuccessPage /> },
    { path: "/payment/fail", element: <PaymentFailPage /> },
    { path: "/support", element: <SupportPage /> },
];

// Header에서는 메뉴 제거
export const headerNavItems: NavItem[] = [];

export const bottomNavItems: NavItem[] = appRoutes
    .filter((r) => r.bottomLabel)
    .map((r) => ({ label: r.bottomLabel!, to: r.path }));

// 홈 메뉴 제외하고 사이드바 메뉴 생성
export const sidebarNavItems: NavItem[] = appRoutes
    .filter((r) => r.headerLabel)
    .map((r) => ({ label: r.headerLabel!, to: r.path }));
