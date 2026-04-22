import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { geneticsApi } from '../../services/geneticsApi';
import type { Species, Gene, Morph, InheritanceType, Zygosity } from '../../services/geneticsApi';
import { useAuthStore } from '../../store/authStore';
import './style/GeneticsAdminPage.css';

type Tab = 'species' | 'genes' | 'morphs';

const INHERITANCE_OPTIONS: { value: InheritanceType; label: string }[] = [
  { value: 'RECESSIVE', label: '열성 (Recessive)' },
  { value: 'CODOMINANT', label: '공우성 (Codominant)' },
  { value: 'DOMINANT', label: '우성 (Dominant)' },
];

const ZYGOSITY_OPTIONS: { value: Zygosity; label: string }[] = [
  { value: 'NORMAL', label: 'Normal' },
  { value: 'HET', label: 'Het' },
  { value: 'VISUAL', label: 'Visual' },
  { value: 'SINGLE', label: 'Single' },
  { value: 'SUPER', label: 'Super' },
];

function toSlug(name: string) {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

// ─── Species Panel ───────────────────────────────────────────────────────────
function SpeciesPanel() {
  const [list, setList] = useState<Species[]>([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', slug: '', description: '', sortOrder: '0' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(() => {
    setLoading(true);
    geneticsApi.getSpecies().then(setList).finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => {
    setEditId(null);
    setForm({ name: '', slug: '', description: '', sortOrder: '0' });
    setError('');
    setShowForm(true);
  };

  const openEdit = (s: Species) => {
    setEditId(s.id);
    setForm({ name: s.name, slug: s.slug, description: s.description ?? '', sortOrder: String(s.sortOrder) });
    setError('');
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) { setError('이름을 입력해주세요.'); return; }
    setSaving(true); setError('');
    try {
      const payload = { name: form.name, slug: form.slug || toSlug(form.name), description: form.description || undefined, sortOrder: Number(form.sortOrder) };
      if (editId) await geneticsApi.admin.updateSpecies(editId, payload);
      else await geneticsApi.admin.createSpecies(payload);
      setShowForm(false);
      load();
    } catch { setError('저장 중 오류가 발생했습니다.'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`"${name}"을(를) 비활성화하시겠습니까?`)) return;
    try { await geneticsApi.admin.deleteSpecies(id); load(); }
    catch { alert('삭제 중 오류가 발생했습니다.'); }
  };

  return (
    <div className="gadmin-panel">
      <div className="gadmin-panel-header">
        <h2 className="gadmin-section-title">종(Species) 관리</h2>
        <button className="gadmin-btn-add" onClick={openCreate}>+ 새 종 추가</button>
      </div>

      {showForm && (
        <div className="gadmin-form-card">
          <h3 className="gadmin-form-title">{editId ? '종 수정' : '새 종 추가'}</h3>
          <div className="gadmin-form-row">
            <div className="gadmin-field">
              <label>이름 *</label>
              <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value, slug: p.slug || toSlug(e.target.value) }))} placeholder="예: Ball Python" />
            </div>
            <div className="gadmin-field">
              <label>슬러그</label>
              <input value={form.slug} onChange={e => setForm(p => ({ ...p, slug: e.target.value }))} placeholder="자동 생성" />
            </div>
            <div className="gadmin-field gadmin-field-sm">
              <label>정렬순서</label>
              <input type="number" value={form.sortOrder} onChange={e => setForm(p => ({ ...p, sortOrder: e.target.value }))} />
            </div>
          </div>
          <div className="gadmin-field">
            <label>설명</label>
            <input value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="선택 입력" />
          </div>
          {error && <p className="gadmin-error">{error}</p>}
          <div className="gadmin-form-actions">
            <button className="gadmin-btn-save" onClick={handleSave} disabled={saving}>{saving ? '저장 중...' : '저장'}</button>
            <button className="gadmin-btn-cancel" onClick={() => setShowForm(false)}>취소</button>
          </div>
        </div>
      )}

      {loading ? <p className="gadmin-loading">로딩 중...</p> : (
        <table className="gadmin-table">
          <thead><tr><th>ID</th><th>이름</th><th>슬러그</th><th>정렬</th><th>상태</th><th>작업</th></tr></thead>
          <tbody>
            {list.length === 0 ? (
              <tr><td colSpan={6} className="gadmin-empty">등록된 종이 없습니다.</td></tr>
            ) : list.map(s => (
              <tr key={s.id}>
                <td>{s.id}</td>
                <td>{s.name}</td>
                <td className="gadmin-td-muted">{s.slug}</td>
                <td>{s.sortOrder}</td>
                <td><span className={`gadmin-status-badge ${s.isActive ? 'active' : 'inactive'}`}>{s.isActive ? '활성' : '비활성'}</span></td>
                <td>
                  <button className="gadmin-btn-edit" onClick={() => openEdit(s)}>수정</button>
                  <button className="gadmin-btn-delete" onClick={() => handleDelete(s.id, s.name)}>비활성화</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// ─── Genes Panel ─────────────────────────────────────────────────────────────
function GenesPanel() {
  const [speciesList, setSpeciesList] = useState<Species[]>([]);
  const [selectedSpeciesId, setSelectedSpeciesId] = useState<number | null>(null);
  const [list, setList] = useState<Gene[]>([]);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', slug: '', inheritanceType: 'RECESSIVE' as InheritanceType, singleName: '', doubleName: '', badgeColor: '#12b3a6', description: '', sortOrder: '0' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { geneticsApi.getSpecies().then(setSpeciesList); }, []);

  const loadGenes = useCallback((speciesId: number) => {
    setLoading(true);
    geneticsApi.getGenes(speciesId).then(setList).finally(() => setLoading(false));
  }, []);

  useEffect(() => { if (selectedSpeciesId) loadGenes(selectedSpeciesId); }, [selectedSpeciesId, loadGenes]);

  const openCreate = () => {
    setEditId(null);
    setForm({ name: '', slug: '', inheritanceType: 'RECESSIVE', singleName: '', doubleName: '', badgeColor: '#12b3a6', description: '', sortOrder: '0' });
    setError('');
    setShowForm(true);
  };

  const openEdit = (g: Gene) => {
    setEditId(g.id);
    setForm({ name: g.name, slug: g.slug, inheritanceType: g.inheritanceType, singleName: g.singleName ?? '', doubleName: g.doubleName ?? '', badgeColor: g.badgeColor ?? '#12b3a6', description: g.description ?? '', sortOrder: String(g.sortOrder) });
    setError('');
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) { setError('이름을 입력해주세요.'); return; }
    if (!selectedSpeciesId) { setError('종을 먼저 선택해주세요.'); return; }
    setSaving(true); setError('');
    try {
      const payload = { speciesId: selectedSpeciesId, name: form.name, slug: form.slug || toSlug(form.name), inheritanceType: form.inheritanceType, singleName: form.singleName || undefined, doubleName: form.doubleName || undefined, badgeColor: form.badgeColor || undefined, description: form.description || undefined, sortOrder: Number(form.sortOrder) };
      if (editId) await geneticsApi.admin.updateGene(editId, payload);
      else await geneticsApi.admin.createGene(payload);
      setShowForm(false);
      loadGenes(selectedSpeciesId);
    } catch { setError('저장 중 오류가 발생했습니다.'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`"${name}"을(를) 비활성화하시겠습니까?`)) return;
    try { await geneticsApi.admin.deleteGene(id); if (selectedSpeciesId) loadGenes(selectedSpeciesId); }
    catch { alert('삭제 중 오류가 발생했습니다.'); }
  };

  return (
    <div className="gadmin-panel">
      <div className="gadmin-panel-header">
        <h2 className="gadmin-section-title">유전자(Gene) 관리</h2>
        <div className="gadmin-panel-header-right">
          <select className="gadmin-species-select" value={selectedSpeciesId ?? ''} onChange={e => setSelectedSpeciesId(e.target.value ? Number(e.target.value) : null)}>
            <option value="">종 선택</option>
            {speciesList.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          {selectedSpeciesId && <button className="gadmin-btn-add" onClick={openCreate}>+ 새 유전자 추가</button>}
        </div>
      </div>

      {showForm && (
        <div className="gadmin-form-card">
          <h3 className="gadmin-form-title">{editId ? '유전자 수정' : '새 유전자 추가'}</h3>
          <div className="gadmin-form-row">
            <div className="gadmin-field">
              <label>이름 *</label>
              <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value, slug: p.slug || toSlug(e.target.value) }))} placeholder="예: Albino" />
            </div>
            <div className="gadmin-field">
              <label>슬러그</label>
              <input value={form.slug} onChange={e => setForm(p => ({ ...p, slug: e.target.value }))} placeholder="자동 생성" />
            </div>
            <div className="gadmin-field">
              <label>유전 방식 *</label>
              <select value={form.inheritanceType} onChange={e => setForm(p => ({ ...p, inheritanceType: e.target.value as InheritanceType }))}>
                {INHERITANCE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>
          <div className="gadmin-form-row">
            <div className="gadmin-field">
              <label>1카피 이름 (singleName)</label>
              <input value={form.singleName} onChange={e => setForm(p => ({ ...p, singleName: e.target.value }))} placeholder="예: Het Albino" />
            </div>
            <div className="gadmin-field">
              <label>2카피 이름 (doubleName)</label>
              <input value={form.doubleName} onChange={e => setForm(p => ({ ...p, doubleName: e.target.value }))} placeholder="예: Albino" />
            </div>
            <div className="gadmin-field gadmin-field-sm">
              <label>배지 색상</label>
              <div className="gadmin-color-input">
                <input type="color" value={form.badgeColor} onChange={e => setForm(p => ({ ...p, badgeColor: e.target.value }))} />
                <input value={form.badgeColor} onChange={e => setForm(p => ({ ...p, badgeColor: e.target.value }))} placeholder="#FF6B6B" />
              </div>
            </div>
            <div className="gadmin-field gadmin-field-sm">
              <label>정렬순서</label>
              <input type="number" value={form.sortOrder} onChange={e => setForm(p => ({ ...p, sortOrder: e.target.value }))} />
            </div>
          </div>
          <div className="gadmin-field">
            <label>설명</label>
            <input value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="선택 입력" />
          </div>
          {error && <p className="gadmin-error">{error}</p>}
          <div className="gadmin-form-actions">
            <button className="gadmin-btn-save" onClick={handleSave} disabled={saving}>{saving ? '저장 중...' : '저장'}</button>
            <button className="gadmin-btn-cancel" onClick={() => setShowForm(false)}>취소</button>
          </div>
        </div>
      )}

      {!selectedSpeciesId ? (
        <p className="gadmin-hint">종을 먼저 선택하세요.</p>
      ) : loading ? <p className="gadmin-loading">로딩 중...</p> : (
        <table className="gadmin-table">
          <thead><tr><th>ID</th><th>이름</th><th>유전방식</th><th>1카피</th><th>2카피</th><th>배지</th><th>상태</th><th>작업</th></tr></thead>
          <tbody>
            {list.length === 0 ? (
              <tr><td colSpan={8} className="gadmin-empty">등록된 유전자가 없습니다.</td></tr>
            ) : list.map(g => (
              <tr key={g.id}>
                <td>{g.id}</td>
                <td>{g.name}</td>
                <td><span className="gadmin-inherit-badge">{g.inheritanceType}</span></td>
                <td className="gadmin-td-muted">{g.singleName ?? '-'}</td>
                <td className="gadmin-td-muted">{g.doubleName ?? '-'}</td>
                <td>{g.badgeColor && <span className="gadmin-color-dot" style={{ backgroundColor: g.badgeColor }} title={g.badgeColor} />}</td>
                <td><span className={`gadmin-status-badge ${g.isActive ? 'active' : 'inactive'}`}>{g.isActive ? '활성' : '비활성'}</span></td>
                <td>
                  <button className="gadmin-btn-edit" onClick={() => openEdit(g)}>수정</button>
                  <button className="gadmin-btn-delete" onClick={() => handleDelete(g.id, g.name)}>비활성화</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// ─── Morphs Panel ────────────────────────────────────────────────────────────
function MorphsPanel() {
  const [speciesList, setSpeciesList] = useState<Species[]>([]);
  const [selectedSpeciesId, setSelectedSpeciesId] = useState<number | null>(null);
  const [geneList, setGeneList] = useState<Gene[]>([]);
  const [list, setList] = useState<Morph[]>([]);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', slug: '', description: '', sortOrder: '0' });
  const [morphGenes, setMorphGenes] = useState<{ geneId: number; zygosity: Zygosity }[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { geneticsApi.getSpecies().then(setSpeciesList); }, []);

  const loadData = useCallback((speciesId: number) => {
    setLoading(true);
    Promise.all([geneticsApi.getMorphs(speciesId), geneticsApi.getGenes(speciesId)])
      .then(([morphs, genes]) => { setList(morphs); setGeneList(genes); })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { if (selectedSpeciesId) loadData(selectedSpeciesId); }, [selectedSpeciesId, loadData]);

  const openCreate = () => {
    setEditId(null);
    setForm({ name: '', slug: '', description: '', sortOrder: '0' });
    setMorphGenes([]);
    setError('');
    setShowForm(true);
  };

  const openEdit = (m: Morph) => {
    setEditId(m.id);
    setForm({ name: m.name, slug: m.slug, description: m.description ?? '', sortOrder: String(m.sortOrder) });
    setMorphGenes(m.genes.map(g => ({ geneId: g.geneId, zygosity: g.zygosity })));
    setError('');
    setShowForm(true);
  };

  const addGeneRow = () => setMorphGenes(p => [...p, { geneId: geneList[0]?.id ?? 0, zygosity: 'SINGLE' }]);
  const removeGeneRow = (i: number) => setMorphGenes(p => p.filter((_, idx) => idx !== i));
  const updateGeneRow = (i: number, field: 'geneId' | 'zygosity', value: string) =>
    setMorphGenes(p => p.map((g, idx) => idx === i ? { ...g, [field]: field === 'geneId' ? Number(value) : value } : g));

  const handleSave = async () => {
    if (!form.name.trim()) { setError('이름을 입력해주세요.'); return; }
    if (!selectedSpeciesId) { setError('종을 먼저 선택해주세요.'); return; }
    if (morphGenes.length === 0) { setError('유전자를 최소 1개 추가해주세요.'); return; }
    setSaving(true); setError('');
    try {
      const payload = { speciesId: selectedSpeciesId, name: form.name, slug: form.slug || toSlug(form.name), description: form.description || undefined, sortOrder: Number(form.sortOrder), genes: morphGenes };
      if (editId) await geneticsApi.admin.updateMorph(editId, payload);
      else await geneticsApi.admin.createMorph(payload);
      setShowForm(false);
      loadData(selectedSpeciesId);
    } catch { setError('저장 중 오류가 발생했습니다.'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`"${name}"을(를) 비활성화하시겠습니까?`)) return;
    try { await geneticsApi.admin.deleteMorph(id); if (selectedSpeciesId) loadData(selectedSpeciesId); }
    catch { alert('삭제 중 오류가 발생했습니다.'); }
  };

  return (
    <div className="gadmin-panel">
      <div className="gadmin-panel-header">
        <h2 className="gadmin-section-title">모프(Morph) 관리</h2>
        <div className="gadmin-panel-header-right">
          <select className="gadmin-species-select" value={selectedSpeciesId ?? ''} onChange={e => setSelectedSpeciesId(e.target.value ? Number(e.target.value) : null)}>
            <option value="">종 선택</option>
            {speciesList.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          {selectedSpeciesId && <button className="gadmin-btn-add" onClick={openCreate}>+ 새 모프 추가</button>}
        </div>
      </div>

      {showForm && (
        <div className="gadmin-form-card">
          <h3 className="gadmin-form-title">{editId ? '모프 수정' : '새 모프 추가'}</h3>
          <div className="gadmin-form-row">
            <div className="gadmin-field">
              <label>이름 *</label>
              <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value, slug: p.slug || toSlug(e.target.value) }))} placeholder="예: Banana Het Albino" />
            </div>
            <div className="gadmin-field">
              <label>슬러그</label>
              <input value={form.slug} onChange={e => setForm(p => ({ ...p, slug: e.target.value }))} placeholder="자동 생성" />
            </div>
            <div className="gadmin-field gadmin-field-sm">
              <label>정렬순서</label>
              <input type="number" value={form.sortOrder} onChange={e => setForm(p => ({ ...p, sortOrder: e.target.value }))} />
            </div>
          </div>
          <div className="gadmin-field">
            <label>설명</label>
            <input value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="선택 입력" />
          </div>

          <div className="gadmin-genes-section">
            <div className="gadmin-genes-header">
              <label>유전자 구성 *</label>
              <button type="button" className="gadmin-btn-add-gene" onClick={addGeneRow}>+ 유전자 추가</button>
            </div>
            {morphGenes.length === 0 && <p className="gadmin-hint">유전자를 추가해주세요.</p>}
            {morphGenes.map((mg, i) => (
              <div key={i} className="gadmin-gene-row">
                <select value={mg.geneId} onChange={e => updateGeneRow(i, 'geneId', e.target.value)}>
                  {geneList.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                </select>
                <select value={mg.zygosity} onChange={e => updateGeneRow(i, 'zygosity', e.target.value)}>
                  {ZYGOSITY_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                <button type="button" className="gadmin-btn-remove-gene" onClick={() => removeGeneRow(i)}>×</button>
              </div>
            ))}
          </div>

          {error && <p className="gadmin-error">{error}</p>}
          <div className="gadmin-form-actions">
            <button className="gadmin-btn-save" onClick={handleSave} disabled={saving}>{saving ? '저장 중...' : '저장'}</button>
            <button className="gadmin-btn-cancel" onClick={() => setShowForm(false)}>취소</button>
          </div>
        </div>
      )}

      {!selectedSpeciesId ? (
        <p className="gadmin-hint">종을 먼저 선택하세요.</p>
      ) : loading ? <p className="gadmin-loading">로딩 중...</p> : (
        <table className="gadmin-table">
          <thead><tr><th>ID</th><th>이름</th><th>유전자 구성</th><th>정렬</th><th>상태</th><th>작업</th></tr></thead>
          <tbody>
            {list.length === 0 ? (
              <tr><td colSpan={6} className="gadmin-empty">등록된 모프가 없습니다.</td></tr>
            ) : list.map(m => (
              <tr key={m.id}>
                <td>{m.id}</td>
                <td>{m.name}</td>
                <td>
                  <div className="gadmin-morph-genes">
                    {m.genes.map((g, i) => <span key={i} className="gadmin-gene-chip">{g.zygosity !== 'VISUAL' && g.zygosity !== 'SUPER' ? `${g.zygosity} ` : ''}{g.geneName}</span>)}
                  </div>
                </td>
                <td>{m.sortOrder}</td>
                <td><span className={`gadmin-status-badge ${m.isActive ? 'active' : 'inactive'}`}>{m.isActive ? '활성' : '비활성'}</span></td>
                <td>
                  <button className="gadmin-btn-edit" onClick={() => openEdit(m)}>수정</button>
                  <button className="gadmin-btn-delete" onClick={() => handleDelete(m.id, m.name)}>비활성화</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function GeneticsAdminPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const [tab, setTab] = useState<Tab>('species');

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'ADMIN') {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  if (!isAuthenticated || user?.role !== 'ADMIN') return null;

  return (
    <section className="gadmin-page">
      <div className="gadmin-header">
        <h1 className="gadmin-title">유전자 데이터 관리</h1>
        <p className="gadmin-subtitle">종 · 유전자 · 모프 데이터를 등록하고 관리합니다</p>
      </div>

      <div className="gadmin-tabs">
        {(['species', 'genes', 'morphs'] as Tab[]).map(t => (
          <button
            key={t}
            className={`gadmin-tab ${tab === t ? 'active' : ''}`}
            onClick={() => setTab(t)}
          >
            {t === 'species' ? '종 관리' : t === 'genes' ? '유전자 관리' : '모프 관리'}
          </button>
        ))}
      </div>

      {tab === 'species' && <SpeciesPanel />}
      {tab === 'genes' && <GenesPanel />}
      {tab === 'morphs' && <MorphsPanel />}
    </section>
  );
}
