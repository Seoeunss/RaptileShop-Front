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

    /** Header 메뉴에 노출할지 */
    headerLabel?: string;

    /** 모바일 하단 네비에 노출할지 */
    bottomLabel?: string;
};

export type NavItem = {
    label: string;
    to: string;
};

export const appRoutes: RouteDef[] = [
    { path: "/", element: <HomePage />, headerLabel: "홈", bottomLabel: "홈" },

    { path: "/products", element: <ProductListPage />, headerLabel: "상품목록", bottomLabel: "목록" },
    { path: "/products/new", element: <ProductCreatePage />, headerLabel: "상품등록", bottomLabel: "등록" },
    { path: "/products/:id", element: <ProductDetailPage /> },

    { path: "/login", element: <LoginPage />, headerLabel: "로그인", bottomLabel: "로그인" },
    { path: "/signup", element: <SignupPage /> },

    { path: "/chat", element: <ChatListPage />, headerLabel: "채팅", bottomLabel: "채팅" },
    { path: "/chat/:id", element: <ChatPage /> },

    { path: "/orders/:id", element: <OrderPage /> },
    { path: "/payment/success", element: <PaymentSuccessPage /> },
    { path: "/payment/fail", element: <PaymentFailPage /> },
];

export const headerNavItems: NavItem[] = appRoutes
    .filter((r) => r.headerLabel)
    .map((r) => ({ label: r.headerLabel!, to: r.path }));

export const bottomNavItems: NavItem[] = appRoutes
    .filter((r) => r.bottomLabel)
    .map((r) => ({ label: r.bottomLabel!, to: r.path }));

export const sidebarNavItems: NavItem[] = headerNavItems;
