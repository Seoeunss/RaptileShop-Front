import "./style/HomePage.css";

type Category = {
    id: string;
    name: string;
    imageUrl: string;
};

type Feature = {
    id: string;
    title: string;
    description: string;
};

type Benefit = {
    id: string;
    label: string;
    title: string;
    description: string;
    cta: string;
    imageUrl?: string;
};

type Step = {
    id: string;
    title: string;
    description: string;
    imageUrl?: string;
};

const categories: Category[] = [
    {
        id: "ball",
        name: "Ball Pythons",
        imageUrl:
            "https://images.unsplash.com/photo-1527434000091-3d0b87e7b3b8?auto=format&fit=crop&w=800&q=70",
    },
    {
        id: "boa",
        name: "Boa Constrictors",
        imageUrl:
            "https://images.unsplash.com/photo-1550859492-d5da9d8e45f3?auto=format&fit=crop&w=800&q=70",
    },
    {
        id: "corn",
        name: "Corn Snakes",
        imageUrl:
            "https://images.unsplash.com/photo-1544551763-cedd7fce3b38?auto=format&fit=crop&w=800&q=70",
    },
    {
        id: "bearded",
        name: "Bearded Dragons",
        imageUrl:
            "https://images.unsplash.com/photo-1544207243-4a70a9a4c1b2?auto=format&fit=crop&w=800&q=70",
    },
    {
        id: "crested",
        name: "Crested Geckos",
        imageUrl:
            "https://images.unsplash.com/photo-1581196607303-95ec3c91f71c?auto=format&fit=crop&w=800&q=70",
    },
    {
        id: "leopard",
        name: "Leopard Geckos",
        imageUrl:
            "https://images.unsplash.com/photo-1600699261617-8f1e9c2d563d?auto=format&fit=crop&w=800&q=70",
    },
];

const features: Feature[] = [
    {
        id: "f1",
        title: "다양한 품종과\n검증한 판매처",
        description:
            "전문가가 직접 검수한 건강한 파충류만 판매합니다.",
    },
    {
        id: "f2",
        title: "안전한 에스크로\n결제 시스템",
        description:
            "구매자·판매자 모두를 보호하는 신뢰의 거래.",
    },
    {
        id: "f3",
        title: "빠르고 안전한\n배송 서비스",
        description:
            "파충류의 건강을 생각한 신속한 배송.",
    },
];

const benefits: Benefit[] = [
    {
        id: "b1",
        label: "포인트",
        title: "매 구매마다 적립\n되는 포인트",
        description:
            "구매액의 일정 비율을 포인트로 적립하고 다음 구매에 사용할 수 있습니다.",
        cta: "자세히",
        imageUrl: "",
    },
    {
        id: "b2",
        label: "지원",
        title: "파충류 케어 정보와\n전문가 상담",
        description:
            "반려환경, 건강관리방법부터 사육 환경 조성까지 전문가 도움을 받으세요.",
        cta: "알아보기",
        imageUrl: "",
    },
];

const steps: Step[] = [
    {
        id: "s1",
        title: "상품 선택 및 주문",
        description: "마음에 드는 파충류·용품을 찾아 주문합니다.",
        imageUrl: "",
    },
    {
        id: "s2",
        title: "에스크로 결제 진행",
        description:
            "구매자·판매자 모두 안전한 환경에서 결제를 진행합니다.",
        imageUrl: "",
    },
    {
        id: "s3",
        title: "배송 및 수령",
        description:
            "파충류의 건강을 생각한 신속한 배송으로 안전하게 받으세요.",
        imageUrl: "",
    },
    // 원하면 4번째 단계도 쉽게 추가 가능:
    // { id: "s4", title: "거래 확정", description: "수령 후 상태 확인 후 거래를 확정합니다." }
];

function IconBox() {
    return (
        <div className="iconBox" aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path
                    d="M4 7.5L12 3l8 4.5v9L12 21l-8-4.5v-9Z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinejoin="round"
                />
                <path
                    d="M12 21V12"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                />
                <path
                    d="M20 7.5l-8 4.5-8-4.5"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinejoin="round"
                />
            </svg>
        </div>
    );
}

export default function HomePage() {
    return (
        <div className="page">
            {/* Hero */}
            <section className="hero">
                <div className="container heroInner">
                    <div className="heroLeft">
                        <h1 className="heroTitle">
                            파충류를 만나는
                            <br />
                            가장 쉬운 방법
                        </h1>
                        <p className="heroDesc">
                            거래자 더미야닝 등 수많은 한국에서 찾아오기, 에스크로 관련을
                            안한
                            <br />
                            하기 기대합니다.
                        </p>

                        <div className="heroCtas">
                            <button className="btn btnPrimary">둘러보기</button>
                            <button className="btn btnGhost">판매</button>
                        </div>
                    </div>

                    <div className="heroRight">
                        <div className="videoCard" role="button" tabIndex={0}>
                            <div className="videoOverlay" />
                            <div className="playButton" aria-label="영상 재생">
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                                    <path
                                        d="M10 8l8 4-8 4V8Z"
                                        fill="currentColor"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Popular Categories */}
            <section className="section" id="tips">
                <div className="container">
                    <div className="sectionHeader">
                        <h2 className="sectionTitle">인기 카테고리</h2>
                        <a className="sectionLink" href="#all-categories">
                            전체보기
                        </a>
                    </div>

                    <div className="categoryGrid" role="list">
                        {categories.map((c) => (
                            <article className="categoryCard" key={c.id} role="listitem">
                                <div
                                    className="categoryThumb"
                                    style={{ backgroundImage: `url(${c.imageUrl})` }}
                                    aria-hidden="true"
                                />
                                <div className="categoryName">{c.name}</div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Us */}
            <section className="section sectionTint" id="notice">
                <div className="container">
                    <div className="centerHeader">
                        <div className="eyebrow">핵심 강점</div>
                        <h2 className="bigTitle">우리가 다른 이유</h2>
                        <p className="subText">국내 최고의 파충류 플랫폼을 완성했습니다</p>
                    </div>

                    <div className="featureGrid">
                        {features.map((f) => (
                            <article className="featureCard" key={f.id}>
                                <IconBox />
                                <h3 className="featureTitle">{f.title}</h3>
                                <p className="featureDesc">{f.description}</p>
                                <button className="linkBtn">더보기 &nbsp;&gt;</button>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* Member Benefits */}
            <section className="section sectionTint" id="support">
                <div className="container">
                    <div className="centerHeader">
                        <div className="eyebrow">혜택</div>
                        <h2 className="bigTitle">회원이 누리는 특별한 가치</h2>
                        <p className="subText">
                            가입부터 시작되는 다양한 혜택으로 더 저렴하게 구매하세요
                        </p>
                    </div>

                    <div className="benefitGrid">
                        {benefits.map((b) => (
                            <article className="benefitCard" key={b.id}>
                                <div className="benefitMedia" aria-hidden="true">
                                    <div className="mediaPlaceholder">
                                        <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                                            <path
                                                d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6Z"
                                                stroke="currentColor"
                                                strokeWidth="1.6"
                                            />
                                            <path
                                                d="M8 14l2.6-2.6a1 1 0 0 1 1.4 0L16 15.4"
                                                stroke="currentColor"
                                                strokeWidth="1.6"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                            <path
                                                d="M14.5 13.5l1-1a1 1 0 0 1 1.4 0L20 15.6"
                                                stroke="currentColor"
                                                strokeWidth="1.6"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </div>
                                </div>

                                <div className="benefitBody">
                                    <div className="benefitLabel">{b.label}</div>
                                    <h3 className="benefitTitle">{b.title}</h3>
                                    <p className="benefitDesc">{b.description}</p>
                                    <button className="linkBtn">{b.cta} &nbsp;&gt;</button>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* Steps */}
            <section className="section sectionTint" id="mypage">
                <div className="container">
                    <div className="centerHeader">
                        <div className="eyebrow">과정</div>
                        <h2 className="bigTitle">네 단계로 시작하는 쉬운 구매</h2>
                        <p className="subText">
                            원하는 파충류를 찾아 장바구니에 담고, 안전한 에스크로로 결제로
                            구매하세요. 판매자 확인 후 빠르게 배송됩니다.
                        </p>
                    </div>

                    <div className="stepGrid">
                        {steps.map((s) => (
                            <article className="stepCard" key={s.id}>
                                <div className="stepMedia" aria-hidden="true">
                                    <div className="mediaPlaceholder" />
                                </div>
                                <h3 className="stepTitle">{s.title}</h3>
                                <p className="stepDesc">{s.description}</p>
                            </article>
                        ))}
                    </div>

                    <div className="stepActions">
                        <button className="btn btnGhostSmall">확인</button>
                        <button className="linkBtn">자세히 &nbsp;&gt;</button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer" id="login">
                <div className="container footerInner">
                    <div className="footerBrand">
                        <div className="brand">
                            <div className="logoMark" aria-hidden="true" />
                            <span className="logoText">Logo</span>
                        </div>
                        <p className="footerDesc">
                            파충류를 사랑하는 모든 이들의 거래 플랫폼
                        </p>
                    </div>

                    <div className="footerCols">
                        <div className="footerCol">
                            <div className="footerTitle">서비스</div>
                            <a className="footerLink" href="#tips">
                                실용팁
                            </a>
                            <a className="footerLink" href="#notice">
                                공지사항
                            </a>
                            <a className="footerLink" href="#support">
                                고객센터
                            </a>
                        </div>

                        <div className="footerCol">
                            <div className="footerTitle">계정</div>
                            <a className="footerLink" href="#mypage">
                                마이룸
                            </a>
                            <a className="footerLink" href="#login">
                                로그인
                            </a>
                            <a className="footerLink" href="#signup">
                                회원가입
                            </a>
                        </div>

                        <div className="footerCol">
                            <div className="footerTitle">문의</div>
                            <div className="footerMeta">이메일: support@example.com</div>
                            <div className="footerMeta">전화: 02-1234-5678</div>
                        </div>
                    </div>
                </div>

                <div className="footerBottom">
                    <div className="container footerBottomInner">
                        © 2026 파충류 마켓플레이스. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
}
