import {useNavigate, useParams} from 'react-router-dom';
import { products } from '../../data/Product';
import { loadTossPayments } from '@tosspayments/payment-sdk';
import './style/OrderPage.css';
import '../common/style/CommonStyle.css';
const clientKey = 'test_ck_DpexMgkW36wYp0XaMBYMVGbR5ozO';

export default function OrderPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const product = products.find(p => p.id === Number(id));

    if (!product) return <div>상품을 찾을 수 없습니다.</div>;

    const handlePayment = async () => {
        const tossPayments = await loadTossPayments(clientKey);

        await tossPayments.requestPayment('카드', {
            amount: product.price,
            orderId: `order_${Date.now()}`,
            orderName: product.name,
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
                    <img src={product.imageUrl} alt={product.name} />
                </div>
                <div className="order-info">
                    <h2 className="order-name">{product.name}</h2>
                    <p className="order-price">{product.price.toLocaleString()}원</p>
                    <button className="order-pay-btn" onClick={handlePayment}>결제 진행</button>
                </div>
            </div>

        </div>
    );
}
