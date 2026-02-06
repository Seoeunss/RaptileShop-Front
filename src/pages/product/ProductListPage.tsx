import { useNavigate } from 'react-router-dom';
import './style/productList.css';
import BTS1 from "../../assets/images/BTS1.jpeg";
import BTS2 from "../../assets/images/BTS2.jpg";
import BTS3 from "../../assets/images/BTS3.jpeg";
import BTS4 from "../../assets/images/BTS4.jpeg";
import BTS5 from "../../assets/images/BTS5.jpeg";
import BTS6 from "../../assets/images/BTS6.jpeg";

const products = [
    {
        id: 1,
        name: '볼 파이톤',
        price: 300000,
        imageUrl: BTS1,
    },
    {
        id: 2,
        name: '콘스네이크',
        price: 180000,
        imageUrl: BTS2,
    },
    {
        id: 3,
        name: '킹스네이크',
        price: 250000,
        imageUrl: BTS3,
    },
    {
        id: 4,
        name: '볼 파이톤2',
        price: 300000,
        imageUrl: BTS4,
    },
    {
        id: 5,
        name: '콘스네이크2',
        price: 180000,
        imageUrl: BTS5,
    },
    {
        id: 6,
        name: '킹스네이크2',
        price: 250000,
        imageUrl: BTS6,
    },
];


export default function ProductListPage() {
    const navigate = useNavigate();

    return (
        <section className="product-page">
            <div className="product-container">
                <h1 className="page-title">🦎 상품 목록</h1>

                <div className="product-grid">
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="product-card"
                            onClick={() => navigate(`/products/${product.id}`)}
                        >
                            <div className="product-image-wrapper">
                                <img
                                    src={product.imageUrl}
                                    alt={product.name}
                                    className="product-image"
                                />
                            </div>
                            <div className="product-info">
                                <h2 className="product-name">{product.name}</h2>
                                <p className="product-price">
                                    {product.price.toLocaleString()}원
                                </p>
                            </div>
                            <span className="product-badge">판매중</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
