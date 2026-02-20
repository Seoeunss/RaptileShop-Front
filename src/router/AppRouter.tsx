import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Layout from '../layout/Layout';

import ProductListPage from '../pages/product/ProductListPage';
import ProductDetailPage from '../pages/product/ProductDetailPage';
import ProductCreatePage from '../pages/product/ProductCreatePage';

import LoginPage from '../pages/auth/LoginPage';
import SignupPage from '../pages/auth/SignupPage';

import OrderPage from '../pages/order/OrderPage.tsx';
import PaymentSuccessPage from '../pages/payments/PaymentSuccessPage';
import PaymentFailPage from '../pages/payments/PaymentFailPage';
import HomePage from "../pages/HomePage.tsx";

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Layout>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/products" element={<ProductListPage />} />
                    <Route path="/products/:id" element={<ProductDetailPage />} />
                    <Route path="/products/new" element={<ProductCreatePage />} />

                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />

                    <Route path="/orders/:id" element={<OrderPage />} />
                    <Route path="/payment/success" element={<PaymentSuccessPage />} />
                    <Route path="/payment/fail" element={<PaymentFailPage />} />

                </Routes>
            </Layout>
        </BrowserRouter>
    );
}
