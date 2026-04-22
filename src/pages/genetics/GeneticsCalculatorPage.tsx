import { useState, useEffect, useCallback } from 'react';
import { geneticsApi } from '../../services/geneticsApi';
import type {
  Species,
  Gene,
  Morph,
  Outcome,
  OutcomeGene,
  Zygosity,
  ParentGeneInput,
} from '../../services/geneticsApi';
import './style/GeneticsCalculatorPage.css';

const ZYGOSITY_LABELS: Record<Zygosity, string> = {
  NORMAL: '없음',
  HET: 'Het',
  VISUAL: 'Visual',
  SINGLE: 'Single',
  SUPER: 'Super',
};

const BADGE_FALLBACK: Record<Zygosity, string> = {
  NORMAL: 'transparent',
  HET: '#FFF3CD',
  VISUAL: '#F8D7DA',
  SINGLE: '#CCE5FF',
  SUPER: '#E2D9F3',
};

function getZygosityOptions(inheritanceType: string): Zygosity[] {
  if (inheritanceType === 'RECESSIVE') return ['NORMAL', 'HET', 'VISUAL'];
  if (inheritanceType === 'CODOMINANT' || inheritanceType === 'DOMINANT') return ['NORMAL', 'SINGLE', 'SUPER'];
  return ['NORMAL'];
}

function TraitBadge({ gene }: { gene: OutcomeGene }) {
  const bg = gene.badgeColor ?? BADGE_FALLBACK[gene.zygosity] ?? '#e2e8f0';
  return (
    <span className="genetics-badge" style={{ backgroundColor: bg }}>
      {gene.traitName}
    </span>
  );
}

interface ParentState {
  mode: 'morph' | 'manual';
  morphId: number | null;
  genes: Record<number, Zygosity>;
}

function defaultParent(): ParentState {
  return { mode: 'morph', morphId: null, genes: {} };
}

export default function GeneticsCalculatorPage() {
  const [species, setSpecies] = useState<Species[]>([]);
  const [selectedSpeciesId, setSelectedSpeciesId] = useState<number | null>(null);
  const [genes, setGenes] = useState<Gene[]>([]);
  const [morphs, setMorphs] = useState<Morph[]>([]);
  const [parent1, setParent1] = useState<ParentState>(defaultParent());
  const [parent2, setParent2] = useState<ParentState>(defaultParent());
  const [outcomes, setOutcomes] = useState<Outcome[] | null>(null);
  const [totalOutcomes, setTotalOutcomes] = useState(0);
  const [loading, setLoading] = useState(false);
  const [speciesLoading, setSpeciesLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    geneticsApi.getSpecies()
      .then(setSpecies)
      .finally(() => setSpeciesLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedSpeciesId) return;
    setGenes([]);
    setMorphs([]);
    setParent1(defaultParent());
    setParent2(defaultParent());
    setOutcomes(null);
    Promise.all([
      geneticsApi.getGenes(selectedSpeciesId),
      geneticsApi.getMorphs(selectedSpeciesId),
    ]).then(([g, m]) => {
      setGenes(g);
      setMorphs(m);
    });
  }, [selectedSpeciesId]);

  const buildParentPayload = useCallback((parent: ParentState, key: 'parent1' | 'parent2') => {
    if (parent.mode === 'morph' && parent.morphId) {
      return key === 'parent1' ? { parent1MorphId: parent.morphId } : { parent2MorphId: parent.morphId };
    }
    if (parent.mode === 'manual') {
      const geneList: ParentGeneInput[] = Object.entries(parent.genes)
        .filter(([, z]) => z !== 'NORMAL')
        .map(([id, z]) => ({ geneId: Number(id), zygosity: z }));
      return key === 'parent1' ? { parent1Genes: geneList } : { parent2Genes: geneList };
    }
    return {};
  }, []);

  const handleCalculate = useCallback(async () => {
    if (!selectedSpeciesId) return;
    setLoading(true);
    setError(null);
    try {
      const result = await geneticsApi.calculate({
        speciesId: selectedSpeciesId,
        ...buildParentPayload(parent1, 'parent1'),
        ...buildParentPayload(parent2, 'parent2'),
      });
      setOutcomes(result.outcomes);
      setTotalOutcomes(result.totalOutcomes);
    } catch {
      setError('계산 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  }, [selectedSpeciesId, parent1, parent2, buildParentPayload]);

  const handleReset = () => {
    setParent1(defaultParent());
    setParent2(defaultParent());
    setOutcomes(null);
    setError(null);
  };

  function updateParentGeneZygosity(
    setter: React.Dispatch<React.SetStateAction<ParentState>>,
    geneId: number,
    zygosity: Zygosity
  ) {
    setter((prev) => ({ ...prev, genes: { ...prev.genes, [geneId]: zygosity } }));
  }

  function renderParentPanel(
    label: string,
    parent: ParentState,
    setParent: React.Dispatch<React.SetStateAction<ParentState>>
  ) {
    return (
      <div className="genetics-parent-panel">
        <h3 className="genetics-parent-title">{label}</h3>

        <div className="genetics-mode-tabs">
          <button
            className={`genetics-mode-tab ${parent.mode === 'morph' ? 'active' : ''}`}
            onClick={() => setParent((p) => ({ ...p, mode: 'morph' }))}
          >
            모프 선택
          </button>
          <button
            className={`genetics-mode-tab ${parent.mode === 'manual' ? 'active' : ''}`}
            onClick={() => setParent((p) => ({ ...p, mode: 'manual' }))}
          >
            직접 입력
          </button>
        </div>

        {parent.mode === 'morph' ? (
          <div className="genetics-morph-select-wrap">
            <select
              className="genetics-select"
              value={parent.morphId ?? ''}
              onChange={(e) =>
                setParent((p) => ({ ...p, morphId: e.target.value ? Number(e.target.value) : null }))
              }
            >
              <option value="">모프 선택 (야생형)</option>
              {morphs.map((m) => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
            {parent.morphId && (() => {
              const morph = morphs.find((m) => m.id === parent.morphId);
              return morph ? (
                <div className="genetics-morph-preview">
                  {morph.genes.map((g) => (
                    <span
                      key={g.geneId}
                      className="genetics-badge"
                      style={{ backgroundColor: BADGE_FALLBACK[g.zygosity] }}
                    >
                      {g.zygosity !== 'VISUAL' && g.zygosity !== 'SUPER' ? `${ZYGOSITY_LABELS[g.zygosity]} ` : ''}{g.geneName}
                    </span>
                  ))}
                </div>
              ) : null;
            })()}
          </div>
        ) : (
          <div className="genetics-gene-list">
            {genes.length === 0 ? (
              <p className="genetics-empty-hint">종을 먼저 선택해주세요</p>
            ) : (
              genes.map((gene) => {
                const options = getZygosityOptions(gene.inheritanceType);
                const current = parent.genes[gene.id] ?? 'NORMAL';
                return (
                  <div key={gene.id} className="genetics-gene-row">
                    <span className="genetics-gene-name">{gene.name}</span>
                    <div className="genetics-gene-options">
                      {options.map((z) => (
                        <button
                          key={z}
                          className={`genetics-zygosity-btn ${current === z ? 'active' : ''}`}
                          style={current === z && z !== 'NORMAL' ? {
                            backgroundColor: gene.badgeColor ?? BADGE_FALLBACK[z],
                            borderColor: gene.badgeColor ?? BADGE_FALLBACK[z],
                          } : {}}
                          onClick={() => updateParentGeneZygosity(setParent, gene.id, z)}
                        >
                          {ZYGOSITY_LABELS[z]}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <section className="genetics-page">
      <div className="genetics-header">
        <h1 className="genetics-title">유전자 계산기</h1>
        <p className="genetics-subtitle">멘델 유전법칙으로 자손의 유전자 조합을 계산합니다</p>
      </div>

      {/* 종 선택 */}
      <div className="genetics-species-section">
        <label className="genetics-label">종 선택</label>
        {speciesLoading ? (
          <div className="genetics-loading-hint">종 목록 로딩 중...</div>
        ) : (
          <select
            className="genetics-select genetics-species-select"
            value={selectedSpeciesId ?? ''}
            onChange={(e) => setSelectedSpeciesId(e.target.value ? Number(e.target.value) : null)}
          >
            <option value="">종을 선택하세요</option>
            {species.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        )}
      </div>

      {/* 부모 패널 */}
      {selectedSpeciesId && (
        <div className="genetics-parents">
          {renderParentPanel('부모 1', parent1, setParent1)}
          <div className="genetics-cross-symbol">×</div>
          {renderParentPanel('부모 2', parent2, setParent2)}
        </div>
      )}

      {/* 버튼 */}
      {selectedSpeciesId && (
        <div className="genetics-actions">
          <button
            className="genetics-btn-calc"
            onClick={handleCalculate}
            disabled={loading}
          >
            {loading ? '계산 중...' : '계산하기'}
          </button>
          <button className="genetics-btn-reset" onClick={handleReset}>
            초기화
          </button>
        </div>
      )}

      {/* 에러 */}
      {error && <div className="genetics-error">{error}</div>}

      {/* 결과 */}
      {outcomes && (
        <div className="genetics-results">
          <h2 className="genetics-results-title">결과 (총 {totalOutcomes}가지)</h2>
          <div className="genetics-table-wrap">
            <table className="genetics-table">
              <thead>
                <tr>
                  <th>확률</th>
                  <th>형질</th>
                  <th>모프명</th>
                </tr>
              </thead>
              <tbody>
                {outcomes.map((outcome, i) => (
                  <tr key={i}>
                    <td className="genetics-td-prob">
                      <span className="genetics-fraction">{outcome.fraction}</span>
                      <span className="genetics-percentage">{outcome.percentage}</span>
                    </td>
                    <td className="genetics-td-traits">
                      {outcome.traitCount === 0 ? (
                        <span className="genetics-badge genetics-badge-normal">Normal</span>
                      ) : (
                        outcome.genes.map((g, j) => <TraitBadge key={j} gene={g} />)
                      )}
                    </td>
                    <td className="genetics-td-name">{outcome.displayName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
