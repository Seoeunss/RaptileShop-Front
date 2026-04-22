import { useEffect } from 'react';
import TermsPage from '../../pages/TermsPage';
import PrivacyPage from '../../pages/PrivacyPage';
import './LegalModal.css';

type LegalModalProps = {
    type: 'terms' | 'privacy';
    onClose: () => void;
};

export default function LegalModal({ type, onClose }: LegalModalProps) {
    useEffect(() => {
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', handler);
        return () => {
            document.body.style.overflow = prev;
            document.removeEventListener('keydown', handler);
        };
    }, [onClose]);

    return (
        <div className="legal-modal-backdrop" onClick={onClose}>
            <div className="legal-modal-card" onClick={(e) => e.stopPropagation()}>
                <div className="legal-modal-header">
                    <span className="legal-modal-title">
                        {type === 'terms' ? '이용약관' : '개인정보 처리방침'}
                    </span>
                    <button className="legal-modal-close" onClick={onClose} aria-label="닫기">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                    </button>
                </div>
                <div className="legal-modal-body">
                    {type === 'terms' ? <TermsPage /> : <PrivacyPage />}
                </div>
                <div className="legal-modal-footer">
                    <button className="legal-modal-confirm-btn" onClick={onClose}>확인</button>
                </div>
            </div>
        </div>
    );
}
