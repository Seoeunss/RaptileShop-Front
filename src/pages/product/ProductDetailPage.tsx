import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productApi } from '../../services/productApi';
import { chatApi } from '../../services/chatApi';
import { useAuthStore } from '../../store/authStore';
import './style/ProductDetailPage.css';

interface Seller {
  id: number;
  nickname: string;
  region?: string;
  avatarUrl?: string;
}

interface ProductDetail {
  id: number;
  title: string;
  species: string;
  morphTags: string[];
  sex: string;
  birthYm?: string;
  region?: string;
  price?: number;
  priceNegotiable: boolean;
  description: string;
  status: string;
  thumbnailUrl?: string;
  imageUrls: string[];
  seller: Seller;
  viewCount: number;
  createdAt: string;
}

const SEX_LABEL: Record<string, string> = {
  MALE: '수컷', FEMALE: '암컷', UNKNOWN: '미확인',
};
const STATUS_LABEL: Record<string, string> = {
  ACTIVE: '판매중', RESERVED: '예약중', SOLD: '판매완료', CLOSED: '종료',
};
const STATUS_BG: Record<string, string> = {
  ACTIVE: '#10b98122', RESERVED: '#f59e0b22',
  SOLD: '#6b728022',   CLOSED: '#6b728022',
};
const STATUS_COLOR: Record<string, string> = {
  ACTIVE: '#10b981', RESERVED: '#f59e0b',
  SOLD: '#9ca3af',   CLOSED: '#9ca3af',
};

export default function ProductDetailPage() {
  const { id }       = useParams<{ id: string }>();
  const navigate     = useNavigate();
  const { isAuthenticated, user } = useAuthStore();

  const [product,      setProduct]      = useState<ProductDetail | null>(null);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState('');
  const [activeImg,    setActiveImg]    = useState(0);
  const [inquiryLoading, setInquiryLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    productApi.getDetail(Number(id))
      .then((data) => { setProduct(data); setActiveImg(0); })
      .catch(() => setError('매물 정보를 불러오지 못했습니다.'))
      .finally(() => setLoading(false));
  }, [id]);

  // 문의하기 — 채팅방 생성 or 재사용
  const handleInquiry = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!product) return;

    // 본인 매물이면 문의 불가
    if (user?.id === product.seller.id) {
      alert('본인 매물에는 문의할 수 없습니다.');
      return;
    }

    setInquiryLoading(true);
    try {
      const room = await chatApi.createOrGetRoom(product.id);
      navigate(`/chat/${room.id}`);
    } catch (err: unknown) {
      const code = (err as any)?.response?.data?.error?.code;
      if (code === 'CHAT_BLOCKED') {
        alert('차단 관계로 인해 문의할 수 없습니다.');
      } else {
        alert('문의 중 오류가 발생했습니다.');
      }
    } finally {
      setInquiryLoading(false);
    }
  };

  if (loading) return <div className="detail-loading">불러오는 중...</div>;
  if (error)   return <div className="detail-error">{error}</div>;
  if (!product) return <div className="detail-error">매물을 찾을 수 없습니다.</div>;

  // 이미지 목록 (thumbnailUrl + imageUrls 합산, 중복 제거)
  const allImages = Array.from(
    new Set([
      ...(product.thumbnailUrl ? [product.thumbnailUrl] : []),
      ...(product.imageUrls ?? []),
    ])
  );

  const isSoldOrClosed = product.status === 'SOLD' || product.status === 'CLOSED';
  const isOwner = user?.id === product.seller.id;

  return (
    <section className="product-detail">
      {/* 뒤로가기 */}
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← 목록으로
      </button>

      <div className="product-detail-body">
        {/* ── 이미지 영역 ── */}
        <div className="product-detail-image-area">
          {allImages.length > 0 ? (
            <>
              <img
                className="product-detail-main-img"
                src={allImages[activeImg]}
                alt={product.title}
              />
              {allImages.length > 1 && (
                <div className="product-detail-thumbs">
                  {allImages.map((url, i) => (
                    <img
                      key={i}
                      className={`product-detail-thumb ${activeImg === i ? 'active' : ''}`}
                      src={url}
                      alt={`이미지 ${i + 1}`}
                      onClick={() => setActiveImg(i)}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="product-detail-img-placeholder">🦎</div>
          )}
        </div>

        {/* ── 정보 영역 ── */}
        <div className="product-detail-info">
          {/* 상태 뱃지 */}
          <span
            className="detail-status-badge"
            style={{ background: STATUS_BG[product.status], color: STATUS_COLOR[product.status] }}
          >
            {STATUS_LABEL[product.status]}
          </span>

          {/* 제목 */}
          <h1 className="detail-title">{product.title}</h1>

          {/* 가격 */}
          <p className="detail-price">
            {product.price ? `${product.price.toLocaleString()}원` : '가격 협의'}
          </p>
          {product.priceNegotiable && (
            <p className="detail-price-sub">가격 협의 가능</p>
          )}

          <hr className="detail-divider" />

          {/* 메타 정보 */}
          <div className="detail-meta-table">
            <span className="detail-meta-label">종</span>
            <span className="detail-meta-value">{product.species}</span>

            <span className="detail-meta-label">성별</span>
            <span className="detail-meta-value">{SEX_LABEL[product.sex] ?? '-'}</span>

            {product.birthYm && (
              <>
                <span className="detail-meta-label">출생연월</span>
                <span className="detail-meta-value">{product.birthYm}</span>
              </>
            )}

            {product.region && (
              <>
                <span className="detail-meta-label">지역</span>
                <span className="detail-meta-value">{product.region}</span>
              </>
            )}

            {product.morphTags?.length > 0 && (
              <>
                <span className="detail-meta-label">모프</span>
                <div className="detail-morph-tags">
                  {product.morphTags.map((tag) => (
                    <span key={tag} className="morph-tag">{tag}</span>
                  ))}
                </div>
              </>
            )}
          </div>

          <hr className="detail-divider" />

          {/* 설명 */}
          <p className="detail-description-title">상세 설명</p>
          <p className="detail-description">{product.description}</p>

          {/* 판매자 */}
          <div className="detail-seller">
            <div className="detail-seller-avatar">
              {product.seller.avatarUrl
                ? <img src={product.seller.avatarUrl} alt={product.seller.nickname} />
                : '👤'
              }
            </div>
            <div>
              <p className="detail-seller-name">{product.seller.nickname}</p>
              {product.seller.region && (
                <p className="detail-seller-region">{product.seller.region}</p>
              )}
            </div>
          </div>

          {/* 액션 버튼 */}
          <div className="detail-actions">
            {isOwner ? (
              <button
                className="inquiry-btn"
                style={{ background: '#374151' }}
                onClick={() => navigate(`/products/${product.id}/edit`)}
              >
                매물 수정
              </button>
            ) : (
              <button
                className="inquiry-btn"
                disabled={isSoldOrClosed || inquiryLoading}
                onClick={handleInquiry}
              >
                {inquiryLoading
                  ? '연결 중...'
                  : isSoldOrClosed
                  ? '거래 종료된 매물입니다'
                  : '💬 문의하기 (채팅)'}
              </button>
            )}
            <p className="detail-view-count">조회수 {product.viewCount}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
