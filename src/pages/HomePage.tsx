import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { productApi } from "../services/productApi";
import "./style/HomePage.css";

interface Product {
    id: number;
    title: string;
    species: string;
    sex: string;
    region?: string;
    price?: number;
    priceNegotiable: boolean;
    status: string;
    thumbnailUrl?: string;
    seller: { id: number; nickname: string };
    viewCount: number;
}

/* ── 데이터 ─────────────────────────────────────────── */


const features = [
    {
        id: "f1",
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 2l7 4v6c0 4.418-3.134 8.547-7 9.9C5.134 20.547 2 16.418 2 12V6l10-4z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/>
                <path d="M8 12l3 3 5-5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        ),
        title: "검증된 판매자",
        desc: "전문가가 직접 확인한 건강한 파충류만 등록할 수 있습니다. 판매자 평점과 리뷰로 신뢰를 직접 확인하세요.",
    },
    {
        id: "f2",
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="2" y="4" width="20" height="16" rx="3" stroke="currentColor" strokeWidth="1.7"/>
                <path d="M2 8l10 7 10-7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="18" cy="7" r="4" fill="#ef4444"/>
                <path d="M18 5v2.5" stroke="#fff" strokeWidth="1.4" strokeLinecap="round"/>
                <circle cx="18" cy="9" r="0.7" fill="#fff"/>
            </svg>
        ),
        title: "채팅 미열람 메일 알림",
        desc: "보낸 메시지를 판매자가 아직 읽지 않았다면 자동으로 이메일 알림을 발송합니다. 놓치는 대화 없이 빠른 소통을 경험하세요.",
    },
];

const steps = [
    { num: "01", title: "원하는 파충류 검색",   desc: "종류·가격·지역으로 필터링해 원하는 파충류를 찾아보세요." },
    { num: "02", title: "판매자와 채팅 문의",   desc: "1:1 채팅으로 건강 상태, 먹이 현황 등 궁금한 점을 직접 확인하세요." },
    { num: "03", title: "판매자와 직접 거래",     desc: "채팅으로 조건을 협의한 후 판매자와 직접 거래를 완료하세요." },
];

/* ── 페이지 컴포넌트 ────────────────────────────────── */

export default function HomePage() {
    const [latestProducts, setLatestProducts] = useState<Product[]>([]);
    const [productsLoading, setProductsLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            setProductsLoading(false);
            return;
        }
        productApi
            .getList({ page: 0, size: 4, sort: "createdAt,desc", status: "ACTIVE" })
            .then((data) => setLatestProducts(data.content ?? data))
            .catch(() => {})
            .finally(() => setProductsLoading(false));
    }, []);

    return (
        <div className="hp">

            {/* ── 히어로 ─────────────────────────────── */}
            <section className="hp-hero">
                <div className="hp-hero__overlay" />
                <div className="hp-container hp-hero__inner">
                    <div className="hp-hero__copy">
                        <p className="hp-hero__eyebrow">파충류 마켓플레이스</p>
                        <h1 className="hp-hero__title">
                            파충류를 만나는<br />
                            가장 믿을 수 있는 곳
                        </h1>
                        <p className="hp-hero__desc">
                            검증된 판매자와 함께하는 신뢰할 수 있는 파충류 거래.<br />
                            렙타일샵에서 원하는 파충류를 찾아보세요.
                        </p>
                        <div className="hp-hero__ctas">
                            <Link to="/products" className="hp-btn hp-btn--primary">매물 둘러보기</Link>
                        </div>
                    </div>
                </div>
            </section>



{/* ── 최신 매물 ───────────────────────────── */}
            <section className="hp-section hp-section--tint hp-latest">
                <div className="hp-container">
                    <div className="hp-section__head">
                        <h2 className="hp-section__title">최신 매물</h2>
                        <Link to="/products" className="hp-section__more">더 보기 →</Link>
                    </div>

                    {productsLoading ? (
                        <div className="hp-product-grid">
                            {[1, 2, 3, 4].map((n) => (
                                <div className="hp-product-card hp-product-card--skeleton" key={n}>
                                    <div className="hp-product-card__img-wrap">
                                        <div className="hp-product-card__img hp-skeleton" />
                                    </div>
                                    <div className="hp-product-card__body">
                                        <div className="hp-skeleton hp-skeleton--text" />
                                        <div className="hp-skeleton hp-skeleton--text hp-skeleton--short" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : !localStorage.getItem("accessToken") ? (
                        <div className="hp-empty">
                            <p className="hp-empty__text">등록된 매물을 확인하시려면 로그인을 해주세요.</p>
                            <Link to="/login" className="hp-btn hp-btn--primary">로그인하기</Link>
                        </div>
                    ) : latestProducts.length === 0 ? (
                        <div className="hp-empty">
                            <p className="hp-empty__text">아직 등록된 매물이 없습니다.</p>
                            <Link to="/products" className="hp-btn hp-btn--primary">매물 목록 보기</Link>
                        </div>
                    ) : (
                        <div className="hp-product-grid">
                            {latestProducts.map((p) => (
                                <Link to={`/products/${p.id}`} className="hp-product-card" key={p.id}>
                                    <div className="hp-product-card__img-wrap">
                                        {p.thumbnailUrl ? (
                                            <img
                                                className="hp-product-card__img hp-product-card__img--real"
                                                src={p.thumbnailUrl}
                                                alt={p.title}
                                            />
                                        ) : (
                                            <div className="hp-product-card__img hp-product-card__img--placeholder">
                                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                                                    <path d="M4 7.5L12 3l8 4.5v9L12 21l-8-4.5v-9Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                                                </svg>
                                            </div>
                                        )}
                                        <span className="hp-product-card__species">{p.species}</span>
                                    </div>
                                    <div className="hp-product-card__body">
                                        <p className="hp-product-card__name">{p.title}</p>
                                        <div className="hp-product-card__meta">
                                            {p.region && <span className="hp-product-card__region">{p.region}</span>}
                                            <span className="hp-product-card__seller">@{p.seller.nickname}</span>
                                        </div>
                                        <p className="hp-product-card__price">
                                            {p.priceNegotiable
                                                ? "가격 협의"
                                                : p.price != null
                                                ? `₩${p.price.toLocaleString()}`
                                                : "가격 미정"}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </section>

{/* ── 서비스 특징 ──────────────────────────── */}
            <section className="hp-section hp-features">
                <div className="hp-container">
                    <div className="hp-section__center">
                        <p className="hp-eyebrow">렙타일샵이 다른 이유</p>
                        <h2 className="hp-section__big-title">안전하고 신뢰할 수 있는<br />파충류 거래 플랫폼</h2>
                    </div>
                    <div className="hp-feature-grid">
                        {features.map((f) => (
                            <div className="hp-feature-card" key={f.id}>
                                <div className="hp-feature-card__icon">{f.icon}</div>
                                <h3 className="hp-feature-card__title">{f.title}</h3>
                                <p className="hp-feature-card__desc">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>


{/* ── 이용 방법 ────────────────────────────── */}
            <section className="hp-section hp-section--tint hp-steps">
                <div className="hp-container">
                    <div className="hp-section__center">
                        <p className="hp-eyebrow">이용 방법</p>
                        <h2 className="hp-section__big-title">3단계로 시작하는<br />쉬운 파충류 구매</h2>
                    </div>
                    <div className="hp-step-grid">
                        {steps.map((s, i) => (
                            <div className="hp-step-card" key={s.num}>
                                <div className="hp-step-card__num">{s.num}</div>
                                {i < steps.length - 1 && <div className="hp-step-arrow">→</div>}
                                <h3 className="hp-step-card__title">{s.title}</h3>
                                <p className="hp-step-card__desc">{s.desc}</p>
                            </div>
                        ))}
                    </div>
                    <div className="hp-step-actions">
                        <Link to="/products" className="hp-btn hp-btn--primary">지금 시작하기</Link>
                    </div>
                </div>
            </section>

{/* ── 푸터 ────────────────────────────────── */}
            <footer className="hp-footer">
                <div className="hp-container hp-footer__inner">
                    <div className="hp-footer__brand">
                        <div className="hp-logo">
                            <div className="hp-logo__mark" />
                            <span className="hp-logo__text">렙타일샵</span>
                        </div>
                        <p className="hp-footer__tagline">파충류를 사랑하는 모든 이들의 거래 플랫폼</p>
                    </div>
                    <div className="hp-footer__cols">
                        <div>
                            <p className="hp-footer__col-title">서비스</p>
                            <Link to="/products" className="hp-footer__link">매물 목록</Link>
                            <Link to="/support" className="hp-footer__link">고객센터</Link>
                        </div>
                        <div>
                            <p className="hp-footer__col-title">계정</p>
                            <Link to="/login" className="hp-footer__link">로그인</Link>
                            <Link to="/signup" className="hp-footer__link">회원가입</Link>
                            <Link to="/chat" className="hp-footer__link">채팅</Link>
                        </div>
                        <div>
                            <p className="hp-footer__col-title">문의</p>
                            <p className="hp-footer__meta">이메일: support@reptileshop.kr</p>
                            <p className="hp-footer__meta">운영시간: 평일 10:00–18:00</p>
                        </div>
                    </div>
                </div>
                <div className="hp-footer__bottom">
                    <div className="hp-container">© 2026 렙타일샵. All rights reserved.</div>
                </div>
            </footer>
        </div>
    );
}
