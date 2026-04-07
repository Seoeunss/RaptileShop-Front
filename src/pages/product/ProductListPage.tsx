import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { productApi } from '../../services/productApi';
import './style/productList.css';

const isVideoUrl = (url: string) => /\.(mp4|mov|webm|avi|mkv|m4v)(\?|$)/i.test(url);

interface Seller { id: number; nickname: string; }
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
  seller: Seller;
  viewCount: number;
}

const SEX_LABEL:    Record<string, string> = { MALE: '수컷', FEMALE: '암컷', UNKNOWN: '미확인' };
const STATUS_LABEL: Record<string, string> = { ACTIVE: '판매중', RESERVED: '예약중', SOLD: '판매완료', CLOSED: '종료' };
const STATUS_BG:    Record<string, string> = { ACTIVE: '#10b98122', RESERVED: '#f59e0b22', SOLD: '#6b728022', CLOSED: '#6b728022' };
const STATUS_COLOR: Record<string, string> = { ACTIVE: '#10b981', RESERVED: '#f59e0b', SOLD: '#9ca3af', CLOSED: '#9ca3af' };

export default function ProductListPage() {
  const navigate = useNavigate();

  const [products,   setProducts]   = useState<Product[]>([]);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState('');
  const [totalPages, setTotalPages] = useState(0);
  const [q,        setQ]        = useState('');
  const [species,  setSpecies]  = useState('');
  const [sex,      setSex]      = useState('');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [page,     setPage]     = useState(0);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await productApi.getList({
        q:        q        || undefined,
        species:  species  || undefined,
        sex:      sex      || undefined,
        priceMin: priceMin ? Number(priceMin) : undefined,
        priceMax: priceMax ? Number(priceMax) : undefined,
        page,
        size: 12,
        sort: 'createdAt,desc',
      });
      setProducts(res.content);
      setTotalPages(res.totalPages);
    } catch {
      setError('매물 목록을 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  }, [q, species, sex, priceMin, priceMax, page]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); setPage(0); fetchProducts(); };
  const handleReset  = () => { setQ(''); setSpecies(''); setSex(''); setPriceMin(''); setPriceMax(''); setPage(0); };

  return (
    <section className="product-page">
      <div className="product-container">
        <h1 className="page-title">🦎 매물 목록</h1>

        {/* 필터 바 */}
        <form className="filter-bar" onSubmit={handleSearch}>
          <input className="filter-input" placeholder="검색어 (제목/설명)"
            value={q} onChange={(e) => setQ(e.target.value)} />
          <input className="filter-input" placeholder="종 (Ball Python 등)"
            value={species} onChange={(e) => setSpecies(e.target.value)} />
          <select className="filter-select" value={sex} onChange={(e) => setSex(e.target.value)}>
            <option value="">성별 전체</option>
            <option value="MALE">수컷</option>
            <option value="FEMALE">암컷</option>
            <option value="UNKNOWN">미확인</option>
          </select>
          <input className="filter-input" placeholder="최소 가격" type="number"
            value={priceMin} onChange={(e) => setPriceMin(e.target.value)} />
          <input className="filter-input" placeholder="최대 가격" type="number"
            value={priceMax} onChange={(e) => setPriceMax(e.target.value)} />
          <button type="submit" className="filter-btn">검색</button>
          <button type="button" className="filter-btn filter-btn-ghost" onClick={handleReset}>초기화</button>
        </form>

        {/* 등록 버튼 */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
          <button className="filter-btn" onClick={() => navigate('/products/new')}>+ 매물 등록</button>
        </div>

        {error && <p style={{ color: '#ef4444', textAlign: 'center', padding: 20 }}>{error}</p>}

        {loading ? (
          <p className="empty-state">불러오는 중...</p>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <div style={{ fontSize: 48, marginBottom: 12 }}>🦎</div>
            <p>등록된 매물이 없습니다.</p>
          </div>
        ) : (
          <div className="product-grid">
            {products.map((p) => (
              <div key={p.id} className="product-card" onClick={() => navigate(`/products/${p.id}`)}>
                <div className="image-wrapper">
                  {p.thumbnailUrl
                    ? isVideoUrl(p.thumbnailUrl)
                      ? (
                        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                          <video
                            className="card-img"
                            src={p.thumbnailUrl}
                            preload="metadata"
                            muted
                            playsInline
                          />
                          <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1.5rem', background: 'rgba(0,0,0,0.3)' }}>▶</span>
                        </div>
                      )
                      : <img className="card-img" src={p.thumbnailUrl} alt={p.title} />
                    : <span className="card-img-placeholder">🦎</span>
                  }
                </div>
                <div className="product-info">
                  <h2 className="product-name">{p.title}</h2>
                  <p className="product-meta">
                    {p.species}
                    {p.sex    ? ` · ${SEX_LABEL[p.sex]}` : ''}
                    {p.region ? ` · ${p.region}`          : ''}
                  </p>
                  <p className="product-price">
                    {p.price ? `${p.price.toLocaleString()}원` : '가격협의'}
                    {p.priceNegotiable && <span className="price-negotiable">협의가능</span>}
                  </p>
                  <p className="product-seller">{p.seller.nickname} · 조회 {p.viewCount}</p>
                </div>
                <span className="product-badge"
                  style={{ background: STATUS_BG[p.status], color: STATUS_COLOR[p.status] }}>
                  {STATUS_LABEL[p.status]}
                </span>
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="pagination">
            <button className="filter-btn filter-btn-ghost" disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}>이전</button>
            <span className="page-info">{page + 1} / {totalPages}</span>
            <button className="filter-btn filter-btn-ghost" disabled={page >= totalPages - 1}
              onClick={() => setPage((p) => p + 1)}>다음</button>
          </div>
        )}
      </div>
    </section>
  );
}
