import { useEffect, useState } from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import { productApi } from '../../services/productApi';
import { loadTossPayments } from '@tosspayments/payment-sdk';
import './style/OrderPage.css';
import '../common/style/CommonStyle.css';
const clientKey = 'test_ck_DpexMgkW36wYp0XaMBYMVGbR5ozO';

interface ProductDetail {
    id: number;
    title: string;
    price?: number;
    thumbnailUrl?: string;
    imageUrls: string[];
}

export default function OrderPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState<ProductDetail | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        productApi.getDetail(Number(id))
            .then(setProduct)
            .catch(() => setProduct(null))
            .finally(() => setLoading(false));
    }, [id]);

           if (loading) return <div>불러오는 중...</div>;
    if (!product) return <div>상품을 찾을 수 없습니다.</div>;

    const handlePayment = async () => {
        const tossPayments = await loadTossPayments(clientKey);

        await tossPayments.requestPayment('카드', {
            amount: product.price ?? 0,
            orderId: `order_${Date.now()}`,
            orderName: product.title,
            customerName: '테스트고객',
            successUrl: `${window.location.origin}/payment/success`,
            failUrl: `${window.location.origin}/payment/fail`,
        });
    };
    return (
        <div className="order-page">
            <button className="back-btn" onClick={() => navigate(-1)}>
                ← 뒤로가기
            </button>
            <h1 className="order-page-title">주문하기</h1>

            <div className="order-wrapper">
                <div className="image-wrapper">
                    <img src={product.thumbnailUrl ?? product.imageUrls?.[0]} alt={product.title} />
                </div>
                <div className="order-info">
                    <h2 className="order-name">{product.title}</h2>
                    <p className="order-price">{product.price ? product.price.toLocaleString() + '원' : '가격 협의'}</p>
                    <button className="order-pay-btn" onClick={handlePayment}>결제 진행</button>
                </div>
            </div>

        </div>
    );
}
