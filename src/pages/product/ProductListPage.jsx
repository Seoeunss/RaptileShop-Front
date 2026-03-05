import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { productApi } from '../../services/productApi';
import './style/productList.css';
import '../common/style/CommonStyle.css';

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

const SEX_LABEL:    Record<string, string> = { MALE: '수컷', FEMALE: '암컷', UNKNOWN: '미확인' };
const STATUS_LABEL: Record<string, string> = { ACTIVE: '판매중', RESERVED: '예약중', SOLD: '판매완료', CLOSED: '종료' };
const STATUS_COLOR: Record<string, string> = { ACTIVE: '#10b981', RESERVED: '#f59e0b', SOLD: '#6b7280', CLOSED: '#6b7280' };

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
        q: q || undefined,
        species: species || undefined,
        sex: sex || undefined,
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
    fetchProducts();
  };

  const handleReset = () => {
    setQ(''); setSpecies(''); setSex('');
    setPriceMin(''); setPriceMax(''); setPage(0);
  };

  return (
    <section className="product-page">
      <div className="product-container">
        <h1 className="page-title">🦎 매물 목록</h1>

        {/* 필터 바 */}
        <form className="filter-bar" onSubmit={handleSearch}>
          <input className="filter-input" placeholder="검색어" value={q}
            onChange={(e) => setQ(e.target.value)} />
          <input className="filter-input" placeholder="종 (Ball Python 등)" value={species}
            onChange={(e) => setSpecies(e.target.value)} />
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

        {error && <p style={{ color: '#ef4444', textAlign: 'center' }}>{error}</p>}

        {loading ? (
          <p style={{ textAlign: 'center', padding: 40, color: '#6b7280' }}>불러오는 중...</p>
        ) : products.length === 0 ? (
          <p style={{ textAlign: 'center', padding: 40, color: '#6b7280' }}>등록된 매물이 없습니다.</p>
        ) : (
          <div className="product-grid">
            {products.map((p) => (
              <div key={p.id} className="product-card" onClick={() => navigate(`/products/${p.id}`)}>
                <div className="image-wrapper">
                  {p.thumbnailUrl
                    ? <img src={p.thumbnailUrl} alt={p.title} />
                    : <div style={{ width:'100%', height:'100%', background:'#1f2937',
                        display:'flex', alignItems:'center', justifyContent:'center', fontSize: 36 }}>🦎</div>
                  }
                </div>
                <div className="product-info">
                  <h2 className="product-name">{p.title}</h2>
                  <p style={{ fontSize: 12, color: '#9ca3af', margin: '2px 0' }}>
                    {p.species}{p.sex ? ` · ${SEX_LABEL[p.sex]}` : ''}{p.region ? ` · ${p.region}` : ''}
                  </p>
                  <p className="product-price">
                    {p.price ? `${p.price.toLocaleString()}원` : '가격협의'}
                    {p.priceNegotiable && <span style={{ fontSize: 11, color: '#10b981', marginLeft: 4 }}>협의가능</span>}
                  </p>
                  <p style={{ fontSize: 11, color: '#6b7280', margin: '2px 0' }}>
                    {p.seller.nickname} · 조회 {p.viewCount}
                  </p>
                </div>
                <span className="product-badge"
                  style={{ background: STATUS_COLOR[p.status] + '22', color: STATUS_COLOR[p.status] }}>
                  {STATUS_LABEL[p.status]}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 24 }}>
            <button className="filter-btn filter-btn-ghost" disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}>이전</button>
            <span style={{ lineHeight: '36px', color: '#9ca3af' }}>{page + 1} / {totalPages}</span>
            <button className="filter-btn filter-btn-ghost" disabled={page >= totalPages - 1}
              onClick={() => setPage((p) => p + 1)}>다음</button>
          </div>
        )}
      </div>
    </section>
  );
}
