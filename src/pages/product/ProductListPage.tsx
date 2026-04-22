import { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { productApi } from '../../services/productApi';
import VideoThumbnail from '../../components/VideoThumbnail';
import './style/ProductList.css';

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
  imageUrls?: string[];
  videoUrls?: string[];
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
  const [q,         setQ]        = useState('');
  const [species,   setSpecies]  = useState('');
  const [morphTags, setMorphTags] = useState<string[]>([]);
  const [morphInput, setMorphInput] = useState('');
  const [sex,       setSex]      = useState('');
  const [priceMin,  setPriceMin] = useState('');
  const [priceMax,  setPriceMax] = useState('');
  const [page,      setPage]     = useState(0);

  // 모프 태그 자동완성
  const [morphSuggestions, setMorphSuggestions] = useState<string[]>([]);
  const [showMorphSugg,    setShowMorphSugg]    = useState(false);
  const morphDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const morphWrapRef     = useRef<HTMLDivElement>(null);

  // 모프 태그 입력 핸들러 (debounce 300ms)
  const handleMorphInput = (value: string) => {
    setMorphInput(value);
    if (morphDebounceRef.current) clearTimeout(morphDebounceRef.current);
    if (!value.trim()) { setMorphSuggestions([]); setShowMorphSugg(false); return; }
    morphDebounceRef.current = setTimeout(async () => {
      try {
        const list = await productApi.getMorphTags(value.trim());
        setMorphSuggestions(list);
        setShowMorphSugg(list.length > 0);
      } catch { setMorphSuggestions([]); setShowMorphSugg(false); }
    }, 300);
  };

  const handleMorphSelect = (tag: string) => {
    if (!morphTags.includes(tag)) setMorphTags((prev) => [...prev, tag]);
    setMorphInput('');
    setShowMorphSugg(false);
  };

  const removeMorphTag = (tag: string) => {
    setMorphTags((prev) => prev.filter((t) => t !== tag));
  };

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (morphWrapRef.current && !morphWrapRef.current.contains(e.target as Node)) {
        setShowMorphSugg(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await productApi.getList({
        q:         q       || undefined,
        species:   species || undefined,
        morphTags: morphTags.length > 0 ? morphTags : undefined,
        sex:       sex     || undefined,
        priceMin:  priceMin ? Number(priceMin) : undefined,
        priceMax:  priceMax ? Number(priceMax) : undefined,
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
  }, [q, species, morphTags, sex, priceMin, priceMax, page]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); setPage(0); fetchProducts(); };
  const handleReset  = () => { setQ(''); setSpecies(''); setMorphTags([]); setMorphInput(''); setSex(''); setPriceMin(''); setPriceMax(''); setPage(0); setMorphSuggestions([]); setShowMorphSugg(false); };

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

          {/* 모프 태그 자동완성 */}
          <div className="morph-autocomplete-wrap" ref={morphWrapRef} style={{ position: 'relative', flex: '1 1 100%' }}>
            {/* 선택된 태그 칩 */}
            {morphTags.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 6 }}>
                {morphTags.map((tag) => (
                  <span key={tag} style={{
                    display: 'inline-flex', alignItems: 'center', gap: 4,
                    background: '#10b98130', border: '1px solid #10b981',
                    borderRadius: 20, padding: '3px 10px', fontSize: 12, color: '#10b981',
                  }}>
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeMorphTag(tag)}
                      style={{ background: 'none', border: 'none', color: '#10b981', cursor: 'pointer', padding: 0, fontSize: 14, lineHeight: 1 }}
                    >×</button>
                  </span>
                ))}
              </div>
            )}
            <input
              className="filter-input"
              placeholder="모프 태그 (예: Albino)"
              value={morphInput}
              onChange={(e) => handleMorphInput(e.target.value)}
              onFocus={() => morphSuggestions.length > 0 && setShowMorphSugg(true)}
              autoComplete="off"
              style={{ width: '100%', boxSizing: 'border-box' }}
            />
            {showMorphSugg && (
              <ul style={{
                position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0,
                background: '#1f2937', border: '1px solid #374151', borderRadius: 8,
                margin: 0, padding: '4px 0', listStyle: 'none', zIndex: 200,
                maxHeight: 200, overflowY: 'auto',
                boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
              }}>
                {morphSuggestions.map((tag) => (
                  <li key={tag}
                    style={{ padding: '8px 14px', fontSize: 13, color: '#f9fafb', cursor: 'pointer' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#10b98120')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    onMouseDown={(e) => { e.preventDefault(); handleMorphSelect(tag); }}>
                    {tag}
                  </li>
                ))}
              </ul>
            )}
          </div>

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
                  {(() => {
                    const mediaUrl = p.thumbnailUrl || p.imageUrls?.[0] || p.videoUrls?.[0];
                    if (!mediaUrl) return <span className="card-img-placeholder">🦎</span>;
                    if (isVideoUrl(mediaUrl)) return <VideoThumbnail src={mediaUrl} className="card-img" />;
                    return <img className="card-img" src={mediaUrl} alt={p.title} />;
                  })()}
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
