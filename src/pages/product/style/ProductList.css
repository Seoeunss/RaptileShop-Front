/* ── 전체 페이지 ─────────────────────────────── */
.product-page { width: 100%; }
.product-container { width: 100%; }
.page-title { font-size: 1.4rem; margin-bottom: 16px; color: #f9fafb; }

/* ── 필터 바 ─────────────────────────────────── */
.filter-bar {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 20px;
    padding: 16px;
    background: #111827;
    border-radius: 12px;
    border: 1px solid #1f2937;
}

.filter-input,
.filter-select {
    flex: 1 1 140px;
    min-width: 120px;
    padding: 8px 12px;
    border-radius: 8px;
    border: 1px solid #374151;
    background: #1f2937;
    color: #f9fafb;
    font-size: 13px;
    outline: none;
    transition: border-color 0.2s;
}
.filter-input:focus,
.filter-select:focus  { border-color: #10b981; }
.filter-input::placeholder { color: #6b7280; }
.filter-select option { background: #1f2937; color: #f9fafb; }

.filter-btn {
    padding: 8px 16px;
    border-radius: 8px;
    border: none;
    background: #10b981;
    color: #fff;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
    white-space: nowrap;
}
.filter-btn:hover    { background: #059669; }
.filter-btn:disabled { opacity: 0.4; cursor: not-allowed; }

.filter-btn-ghost {
    background: transparent;
    border: 1px solid #374151;
    color: #9ca3af;
}
.filter-btn-ghost:hover { background: #1f2937; border-color: #4b5563; }

/* ── 그리드 ──────────────────────────────────── */
.product-grid {
    display: grid;
    gap: 16px;
    grid-template-columns: 1fr;
}

/* ── 카드 ────────────────────────────────────── */
.product-card {
    position: relative;
    border-radius: 14px;
    overflow: hidden;
    background: #111827;
    border: 1px solid #1f2937;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s;
}
@media (hover: hover) {
    .product-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(0,0,0,0.35);
        border-color: #10b981;
    }
    .product-card:hover .card-img { transform: scale(1.05); }
}

/* ── 카드 이미지 ──────────────────────────────── */
.image-wrapper {
    width: 100%;
    aspect-ratio: 4 / 3;
    overflow: hidden;
    background: #1f2937;
    display: flex;
    align-items: center;
    justify-content: center;
}
.card-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.35s ease;
}
.card-img-placeholder {
    font-size: 48px;
    opacity: 0.4;
}

/* ── 카드 정보 ────────────────────────────────── */
.product-info { padding: 12px 14px 14px; }

.product-name {
    font-size: 0.95rem;
    font-weight: 600;
    color: #f9fafb;
    margin: 0 0 4px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.product-meta {
    font-size: 12px;
    color: #9ca3af;
    margin: 2px 0;
}
.product-price {
    font-size: 1rem;
    font-weight: 700;
    color: #10b981;
    margin: 4px 0 0;
}
.price-negotiable {
    font-size: 11px;
    color: #34d399;
    margin-left: 4px;
    font-weight: 500;
}
.product-seller {
    font-size: 11px;
    color: #6b7280;
    margin: 4px 0 0;
}

/* ── 상태 뱃지 ────────────────────────────────── */
.product-badge {
    position: absolute;
    top: 10px;
    left: 10px;
    font-size: 0.7rem;
    padding: 3px 9px;
    border-radius: 999px;
    font-weight: 600;
}

/* ── 빈 상태 / 로딩 ───────────────────────────── */
.empty-state {
    text-align: center;
    padding: 60px 20px;
    color: #6b7280;
    font-size: 15px;
}

/* ── 페이지네이션 ─────────────────────────────── */
.pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    margin-top: 28px;
}
.page-info { color: #9ca3af; font-size: 14px; line-height: 36px; }

/* ── 반응형 ──────────────────────────────────── */
@media (min-width: 640px) {
    .product-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (min-width: 1024px) {
    .product-grid { grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); }
}
