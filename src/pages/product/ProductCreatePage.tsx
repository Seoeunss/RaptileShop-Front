import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { productApi } from '../../services/productApi';
import { uploadApi } from '../../services/uploadApi';
import './style/ProductCreatePage.css';

interface MediaItem {
  file: File;
  previewUrl: string;
  isVideo: boolean;
}

export default function ProductCreatePage() {
  const navigate = useNavigate();

  const [mediaItems, setMediaItems]   = useState<MediaItem[]>([]);
  const [title, setTitle]             = useState('');
  const [species, setSpecies]         = useState('');
  const [sex, setSex]                 = useState('UNKNOWN');
  const [birthYm, setBirthYm]         = useState('');
  const [region, setRegion]           = useState('');
  const [price, setPrice]             = useState('');
  const [priceNeg, setPriceNeg]       = useState(false);
  const [description, setDescription] = useState('');
  const [morphInput, setMorphInput]   = useState('');
  const [morphTags, setMorphTags]     = useState<string[]>([]);
  const [submitting, setSubmitting]   = useState(false);
  const [error, setError]             = useState('');

  const galleryRef  = useRef<HTMLInputElement>(null);
  const cameraRef   = useRef<HTMLInputElement>(null);
  const videoCapRef = useRef<HTMLInputElement>(null);

  const addFiles = (files: FileList | null) => {
    if (!files) return;
    const items: MediaItem[] = Array.from(files).map(f => ({
      file: f,
      previewUrl: URL.createObjectURL(f),
      isVideo: f.type.startsWith('video/'),
    }));
    setMediaItems(prev => [...prev, ...items].slice(0, 10));
  };

  const removeMedia = (i: number) => {
    setMediaItems(prev => {
      URL.revokeObjectURL(prev[i].previewUrl);
      return prev.filter((_, idx) => idx !== i);
    });
  };

  const addMorphTag = () => {
    const t = morphInput.trim();
    if (t && !morphTags.includes(t)) {
      setMorphTags(prev => [...prev, t]);
      setMorphInput('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim())   { setError('제목을 입력해주세요.'); return; }
    if (!species.trim()) { setError('종을 입력해주세요.'); return; }
    setSubmitting(true);
    setError('');
    try {
      const allUrls: string[] = [];
      for (const item of mediaItems) {
        const url = await uploadApi.uploadImage(item.file);
        allUrls.push(url);
      }
      await productApi.create({
        title: title.trim(),
        species: species.trim(),
        morphTags,
        sex,
        birthYm: birthYm || undefined,
        region: region.trim() || undefined,
        price: price ? Number(price) : undefined,
        priceNegotiable: priceNeg,
        description: description.trim(),
        imageUrls: allUrls,
      });
      navigate('/products');
    } catch {
      setError('매물 등록에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="create-page">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← 목록으로
      </button>

      <h1 className="create-title">
        <span className="create-title-icon">🦎</span> 매물 등록
      </h1>

      <form className="create-form" onSubmit={handleSubmit}>

        {/* ─── 사진 / 동영상 ─── */}
        <div className="create-section">
          <h2 className="create-section-title">사진 / 동영상</h2>

          {/* 미리보기 그리드 */}
          <div className="media-grid">
            {mediaItems.map((m, i) => (
              <div key={i} className="media-preview-item">
                {m.isVideo ? (
                  <>
                    <video src={m.previewUrl} />
                    <span className="media-type-badge">▶</span>
                  </>
                ) : (
                  <img src={m.previewUrl} alt={`미리보기 ${i + 1}`} />
                )}
                {i === 0 && <span className="media-main-badge">대표</span>}
                <button
                  type="button"
                  className="media-remove-btn"
                  onClick={() => removeMedia(i)}
                >
                  ×
                </button>
              </div>
            ))}

            {mediaItems.length < 10 && (
              <button
                type="button"
                className="media-add-btn"
                onClick={() => galleryRef.current?.click()}
              >
                <span className="media-add-icon">+</span>
                <span>파일 선택</span>
              </button>
            )}
          </div>

          {/* 카메라/동영상 촬영 버튼 */}
          <div className="media-capture-row">
            <button
              type="button"
              className="capture-btn"
              onClick={() => cameraRef.current?.click()}
            >
              📷 사진 촬영
            </button>
            <button
              type="button"
              className="capture-btn"
              onClick={() => videoCapRef.current?.click()}
            >
              🎥 동영상 촬영
            </button>
          </div>

          <p className="media-note">
            최대 10개 업로드 가능 · 첫 번째 파일이 대표 이미지로 사용됩니다
          </p>

          {/* Hidden inputs */}
          <input
            ref={galleryRef}
            type="file"
            accept="image/*,video/*"
            multiple
            style={{ display: 'none' }}
            onChange={e => { addFiles(e.target.files); e.target.value = ''; }}
          />
          <input
            ref={cameraRef}
            type="file"
            accept="image/*"
            capture="environment"
            style={{ display: 'none' }}
            onChange={e => { addFiles(e.target.files); e.target.value = ''; }}
          />
          <input
            ref={videoCapRef}
            type="file"
            accept="video/*"
            capture="environment"
            style={{ display: 'none' }}
            onChange={e => { addFiles(e.target.files); e.target.value = ''; }}
          />
        </div>

        {/* ─── 기본 정보 ─── */}
        <div className="create-section">
          <h2 className="create-section-title">기본 정보</h2>

          <div className="form-field">
            <label>제목 <span className="required">*</span></label>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="매물 제목을 입력해주세요"
            />
          </div>

          <div className="form-field">
            <label>종 <span className="required">*</span></label>
            <input
              value={species}
              onChange={e => setSpecies(e.target.value)}
              placeholder="예: Ball Python, Crested Gecko"
            />
          </div>

          <div className="form-row">
            <div className="form-field">
              <label>성별</label>
              <select value={sex} onChange={e => setSex(e.target.value)}>
                <option value="UNKNOWN">미확인</option>
                <option value="MALE">수컷</option>
                <option value="FEMALE">암컷</option>
              </select>
            </div>
            <div className="form-field">
              <label>출생연월</label>
              <input
                type="month"
                value={birthYm}
                onChange={e => setBirthYm(e.target.value)}
              />
            </div>
          </div>

          <div className="form-field">
            <label>지역</label>
            <input
              value={region}
              onChange={e => setRegion(e.target.value)}
              placeholder="예: Seoul, Incheon"
            />
          </div>

          <div className="form-field">
            <label>모프 태그</label>
            <div className="morph-input-row">
              <input
                value={morphInput}
                onChange={e => setMorphInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.nativeEvent.isComposing) { e.preventDefault(); addMorphTag(); }
                }}
                placeholder="예: Pastel, Het Clown (Enter로 추가)"
              />
              <button type="button" className="morph-add-btn" onClick={addMorphTag}>
                추가
              </button>
            </div>
            {morphTags.length > 0 && (
              <div className="morph-tag-list">
                {morphTags.map(tag => (
                  <span key={tag} className="morph-tag-item">
                    {tag}
                    <button
                      type="button"
                      onClick={() => setMorphTags(p => p.filter(t => t !== tag))}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ─── 가격 ─── */}
        <div className="create-section">
          <h2 className="create-section-title">가격</h2>

          <div className="form-field">
            <label>가격 (원)</label>
            <div className="price-input-wrapper">
              <input
                type="number"
                value={price}
                onChange={e => setPrice(e.target.value)}
                placeholder="0"
                min="0"
              />
              <span className="price-unit">원</span>
            </div>
          </div>

          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={priceNeg}
              onChange={e => setPriceNeg(e.target.checked)}
            />
            가격 협의 가능
          </label>
        </div>

        {/* ─── 상세 설명 ─── */}
        <div className="create-section">
          <h2 className="create-section-title">상세 설명</h2>
          <textarea
            className="create-textarea"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder={`개체에 대한 상세 설명을 입력해주세요\n예: 건강하고 활발한 개체입니다.`}
            rows={5}
          />
        </div>

        {error && <p className="create-error">{error}</p>}

        <button type="submit" className="submit-btn" disabled={submitting}>
          {submitting ? '등록 중...' : '매물 등록하기'}
        </button>
      </form>
    </section>
  );
}
