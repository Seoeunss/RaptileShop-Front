// src/router/routes.tsx
import HomePage from "../pages/HomePage";
import ProductListPage from "../pages/product/ProductListPage";
import ProductDetailPage from "../pages/product/ProductDetailPage";
import ProductCreatePage from "../pages/product/ProductCreatePage";
import LoginPage from "../pages/auth/LoginPage";
import SignupPage from "../pages/auth/SignupPage";
import OrderPage from "../pages/order/OrderPage";
import PaymentSuccessPage from "../pages/payments/PaymentSuccessPage";
import PaymentFailPage from "../pages/payments/PaymentFailPage";
import ChatListPage from "../pages/chat/ChatListPage";
import ChatPage from "../pages/chat/ChatPage";
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
    { path: "/", element: <HomePage />, bottomLabel: "홈" }, // headerLabel 제거
    { path: "/products", element: <ProductListPage />, headerLabel: "상품목록", bottomLabel: "목록" },
    { path: "/products/new", element: <ProductCreatePage />, headerLabel: "상품등록", bottomLabel: "등록" },
    { path: "/products/:id", element: <ProductDetailPage /> },
    { path: "/login", element: <LoginPage /> },
    { path: "/signup", element: <SignupPage /> },
    { path: "/chat", element: <ChatListPage />, headerLabel: "채팅", bottomLabel: "채팅" },
    { path: "/chat/:id", element: <ChatPage /> },
    { path: "/orders/:id", element: <OrderPage /> },
    { path: "/payment/success", element: <PaymentSuccessPage /> },
    { path: "/payment/fail", element: <PaymentFailPage /> },
];

// Header에서는 메뉴 제거
export const headerNavItems: NavItem[] = [];

export const bottomNavItems: NavItem[] = appRoutes
    .filter((r) => r.bottomLabel)
    .map((r) => ({ label: r.bottomLabel!, to: r.path }));

// 홈 메뉴 제외하고 사이드바 메뉴 생성
export const sidebarNavItems: NavItem[] = appRoutes
    .filter((r) => r.headerLabel) // 홈은 headerLabel이 없으므로 자동 제외
    .map((r) => ({ label: r.headerLabel!, to: r.path }));