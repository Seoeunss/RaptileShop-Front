import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { chatApi } from '../../services/chatApi';
import './style/ChatListPage.css';

interface ApiRoom {
    id: number;
    partnerName: string;
    productName: string;
    productPrice: number;
    lastMessage?: string;
    lastMessageAt?: string;
    unreadCount: number;
}

function formatTime(dateStr?: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const target = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const diffDays = Math.floor((today.getTime() - target.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
        const hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? '오후' : '오전';
        return `${ampm} ${hours % 12 || 12}:${minutes}`;
    }
    if (diffDays === 1) return '어제';
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    if (diffDays < 7) return `${days[date.getDay()]}요일`;
    return `${date.getMonth() + 1}/${date.getDate()}`;
}

export default function ChatListPage() {
    const navigate = useNavigate();
    const [rooms, setRooms] = useState<ApiRoom[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        chatApi.getRooms()
            .then((data) => setRooms(data ?? []))
            .catch(() => setError(true))
            .finally(() => setLoading(false));
    }, []);

    const totalUnread = rooms.reduce((sum, r) => sum + (r.unreadCount ?? 0), 0);

    if (loading) {
        return (
            <section className="chat-list-page">
                <div className="chat-list-header">
                    <h1 className="chat-list-title">채팅</h1>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0', color: 'var(--text-sub)' }}>
                    로딩 중...
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="chat-list-page">
                <div className="chat-list-header">
                    <h1 className="chat-list-title">채팅</h1>
                </div>
                <div className="chat-list-empty">
                    <div className="chat-list-empty-icon">⚠️</div>
                    <p className="chat-list-empty-text">채팅 목록을 불러올 수 없어요</p>
                    <p className="chat-list-empty-desc">잠시 후 다시 시도해주세요</p>
                </div>
            </section>
        );
    }

    return (
        <section className="chat-list-page">
            <div className="chat-list-header">
                <h1 className="chat-list-title">채팅</h1>
                {totalUnread > 0 && (
                    <span className="chat-count-badge">{totalUnread}</span>
                )}
            </div>

            {rooms.length === 0 ? (
                <div className="chat-list-empty">
                    <div className="chat-list-empty-icon">💬</div>
                    <p className="chat-list-empty-text">아직 채팅이 없어요</p>
                    <p className="chat-list-empty-desc">
                        마음에 드는 파충류를 발견하면<br />판매자에게 문의해보세요!
                    </p>
                </div>
            ) : (
                <div className="chat-list">
                    {rooms.map((room, index) => (
                        <div key={room.id}>
                            <div
                                className="chat-item"
                                onClick={() => navigate(`/chat/${room.id}`)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => e.key === 'Enter' && navigate(`/chat/${room.id}`)}
                            >
                                <div className="chat-avatar">
                                    {room.partnerName?.charAt(0) ?? '?'}
                                </div>

                                <div className="chat-item-body">
                                    <div className="chat-item-top">
                                        <span className="chat-item-name">{room.partnerName}</span>
                                        <span className="chat-item-time">{formatTime(room.lastMessageAt)}</span>
                                    </div>
                                    <div className="chat-item-bottom">
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
                                            <span className="chat-item-product">
                                                {room.productName} · {room.productPrice.toLocaleString()}원
                                            </span>
                                            <span className="chat-item-preview">{room.lastMessage ?? ''}</span>
                                        </div>
                                        <div className="chat-item-meta">
                                            {(room.unreadCount ?? 0) > 0 && (
                                                <span className="unread-badge">{room.unreadCount}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {index < rooms.length - 1 && (
                                <div className="chat-divider" />
                            )}
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}
