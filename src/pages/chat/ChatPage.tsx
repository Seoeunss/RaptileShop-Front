import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { chatApi } from '../../services/chatApi';
import { useStompChat, ChatMessage } from '../../hooks/useStompChat';
import { useAuthStore } from '../../store/authStore';
import './style/ChatPage.css';

interface ApiRoom {
    id: number;
    partnerName: string;
    productName: string;
    productPrice: number;
    productId: number;
}

interface DisplayMessage {
    id: number;
    text: string;
    isMine: boolean;
    time: string;
    date: string;
}

function formatTime(dateStr: string): string {
    const date = new Date(dateStr);
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? '오후' : '오전';
    return `${ampm} ${hours % 12 || 12}:${minutes}`;
}

function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const target = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const diffDays = Math.floor((today.getTime() - target.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return '오늘';
    if (diffDays === 1) return '어제';
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    if (diffDays < 7) return `${days[date.getDay()]}요일`;
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
}

function toDisplayMessage(msg: ChatMessage, currentUserId: number): DisplayMessage {
    return {
        id: msg.id,
        text: msg.content,
        isMine: msg.senderId === currentUserId,
        time: formatTime(msg.createdAt),
        date: formatDate(msg.createdAt),
    };
}

interface LocationState {
    productName?: string;
    productPrice?: number;
    productId?: number;
}

export default function ChatPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const locationState = (location.state as LocationState) ?? {};
    const { user } = useAuthStore();
    const [room, setRoom] = useState<ApiRoom | null>(null);
    const [messages, setMessages] = useState<DisplayMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [inputText, setInputText] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    const roomId = Number(id);

    const handleMessage = useCallback((msg: ChatMessage) => {
        if (!user) return;
        setMessages((prev) => [...prev, toDisplayMessage(msg, user.id)]);
    }, [user]);

    const { sendMessage } = useStompChat({ roomId, onMessage: handleMessage });

    useEffect(() => {
        if (!roomId) return;

        Promise.all([
            chatApi.getRooms(),
            chatApi.getMessages(roomId),
        ])
            .then(([rooms, msgsData]) => {
                const roomList: ApiRoom[] = Array.isArray(rooms) ? rooms : (rooms?.content ?? []);
                const foundRoom = roomList.find((r: ApiRoom) => r.id === roomId);
                const found: ApiRoom | null = foundRoom
                    ? {
                        ...foundRoom,
                        productName: foundRoom.productName ?? locationState.productName ?? '',
                        productPrice: foundRoom.productPrice ?? locationState.productPrice ?? 0,
                        productId: foundRoom.productId ?? locationState.productId ?? 0,
                    }
                    : locationState.productName
                        ? { id: roomId, partnerName: '', productName: locationState.productName, productPrice: locationState.productPrice ?? 0, productId: locationState.productId ?? 0 }
                        : null;
                setRoom(found);

                // 응답이 페이지네이션 형태({ content: [...] }) 또는 배열 모두 처리
                const msgList: ChatMessage[] = Array.isArray(msgsData)
                    ? msgsData
                    : (msgsData?.content ?? []);

                if (user) {
                    setMessages(msgList.map((m: ChatMessage) => toDisplayMessage(m, user.id)));
                }

                // 읽음 처리
                if (msgList.length > 0) {
                    const lastId = msgList[msgList.length - 1].id;
                    chatApi.markAsRead(roomId, lastId).catch(() => {});
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [roomId, user]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = () => {
        const text = inputText.trim();
        if (!text) return;
        sendMessage(text);
        setInputText('');
        inputRef.current?.focus();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', color: 'var(--text-sub)' }}>
                로딩 중...
            </div>
        );
    }

    if (!room) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: 12 }}>
                <p style={{ fontSize: 48 }}>💬</p>
                <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>채팅방을 찾을 수 없어요</p>
                <button
                    onClick={() => navigate('/chat')}
                    style={{ background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 12, padding: '10px 20px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}
                >
                    채팅 목록으로
                </button>
            </div>
        );
    }

    // 날짜별 메시지 그룹화
    const groupedMessages = messages.reduce<{ date: string; msgs: DisplayMessage[] }[]>((acc, msg) => {
        const last = acc[acc.length - 1];
        if (last && last.date === msg.date) {
            last.msgs.push(msg);
        } else {
            acc.push({ date: msg.date, msgs: [msg] });
        }
        return acc;
    }, []);

    const partnerInitial = room.partnerName?.charAt(0) ?? '?';

    return (
        <div className="chat-page">
            {/* 채팅 헤더 */}
            <div className="chat-header">
                <button
                    className="chat-back-btn"
                    onClick={() => navigate('/chat')}
                    aria-label="뒤로가기"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
                <div className="chat-header-avatar">{partnerInitial}</div>
                <div className="chat-header-info">
                    <p className="chat-header-name">{room.partnerName}</p>
                    <p className="chat-header-sub">{room.productName}{room.productPrice != null ? ` · ${room.productPrice.toLocaleString()}원` : ''}</p>
                </div>
            </div>

            {/* 상품 배너 */}
            <div className="chat-product-banner">
                <div
                    className="chat-product-thumb"
                    style={{ background: 'linear-gradient(135deg, #eaf6f3, #d1faf5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}
                >
                    {partnerInitial}
                </div>
                <div className="chat-product-info">
                    <p className="chat-product-name">{room.productName}</p>
                    <p className="chat-product-price">{room.productPrice != null ? `${room.productPrice.toLocaleString()}원` : '가격 정보 없음'}</p>
                </div>
                <button
                    className="chat-buy-btn"
                    onClick={() => navigate(`/orders/${room.productId}`)}
                >
                    구매하기
                </button>
            </div>

            {/* 메시지 목록 */}
            <div className="chat-messages">
                {groupedMessages.map((group) => (
                    <div key={group.date}>
                        <div className="chat-date-divider">{group.date}</div>
                        {group.msgs.map((msg) => (
                            <div key={msg.id} className={`chat-msg-row ${msg.isMine ? 'mine' : ''}`}>
                                {!msg.isMine && (
                                    <div className="chat-msg-avatar">{partnerInitial}</div>
                                )}
                                <div className="chat-msg-content">
                                    <div className="chat-bubble">{msg.text}</div>
                                    <span className="chat-bubble-time">{msg.time}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* 입력 영역 */}
            <div className="chat-input-area">
                <div className="chat-input-wrap">
                    <textarea
                        ref={inputRef}
                        className="chat-input"
                        placeholder="메시지를 입력하세요"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={handleKeyDown}
                        rows={1}
                    />
                </div>
                <button
                    className="chat-send-btn"
                    onClick={handleSend}
                    disabled={!inputText.trim()}
                    aria-label="전송"
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M22 2L15 22 11 13 2 9l20-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
