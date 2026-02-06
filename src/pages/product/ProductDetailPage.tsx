import { useParams, useNavigate } from 'react-router-dom';
import { products } from '../../data/Product';
import './style/ProductDetailPage.css';

const isLoggedIn = true; // 나중에 auth 상태로 교체


export default function ProductDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const product = products.find(
        (p) => p.id === Number(id)
    );

    if (!product) {
        return <div>상품을 찾을 수 없습니다.</div>;
    }

    const handleBuy = () => {
        if (!isLoggedIn) {
            navigate('/login');
            return;
        }
        navigate(`/orders/${product.id}`);
    };


    return (
        <section className="product-detail">
            <button className="back-btn" onClick={() => navigate(-1)}>
                ← 뒤로가기
            </button>

            <div className="detail-wrapper">
                <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="detail-image"
                />

                <div className="detail-info">
                    <h1>{product.name}</h1>
                    <p className="price">
                        {product.price.toLocaleString()}원
                    </p>
                    <p className="description">
                        {product.description}
                    </p>

                    <button className="buy-btn"
                            onClick={handleBuy}
                    >구매하기</button>
                </div>
            </div>
        </section>
    );
}
