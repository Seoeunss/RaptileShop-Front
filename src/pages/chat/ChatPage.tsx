import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './style/ChatPage.css';

type Message = {
    id: number;
    text: string;
    isMine: boolean;
    time: string;
    date: string;
};

type ChatRoom = {
    id: number;
    partnerName: string;
    avatarEmoji: string;
    productName: string;
    productPrice: number;
    productId: number;
    messages: Message[];
};

const chatData: Record<number, ChatRoom> = {
    1: {
        id: 1,
        partnerName: '김민준',
        avatarEmoji: '🦎',
        productName: '볼 파이톤',
        productPrice: 300000,
        productId: 1,
        messages: [
            { id: 1, text: '안녕하세요! 볼 파이톤 아직 판매 중인가요?', isMine: false, time: '오후 3:20', date: '오늘' },
            { id: 2, text: '네, 판매 중입니다! 관심 있으신가요?', isMine: true, time: '오후 3:21', date: '오늘' },
            { id: 3, text: '혹시 나이가 어떻게 되나요? 그리고 먹이는 잘 먹고 있나요?', isMine: false, time: '오후 3:22', date: '오늘' },
            { id: 4, text: '생후 8개월이고요, 핑크마우스 해동해서 잘 먹고 있어요 🐭', isMine: true, time: '오후 3:23', date: '오늘' },
            { id: 5, text: '안녕하세요! 볼 파이톤 아직 판매 중인가요?', isMine: false, time: '오후 3:24', date: '오늘' },
        ],
    },
    2: {
        id: 2,
        partnerName: '이서연',
        avatarEmoji: '🐍',
        productName: '콘스네이크',
        productPrice: 180000,
        productId: 2,
        messages: [
            { id: 1, text: '콘스네이크 분양가 좀 더 내려주실 수 있나요?', isMine: false, time: '오전 10:50', date: '오늘' },
            { id: 2, text: '죄송한데 가격은 조정이 어렵습니다 ㅠ', isMine: true, time: '오전 10:55', date: '오늘' },
            { id: 3, text: '알겠어요, 그럼 택배 가능한가요?', isMine: false, time: '오전 11:00', date: '오늘' },
            { id: 4, text: '네, 택배 가능합니다! 항공택배로 보내드려요', isMine: true, time: '오전 11:03', date: '오늘' },
            { id: 5, text: '네, 건강하게 잘 지내고 있어요 😊', isMine: false, time: '오전 11:05', date: '오늘' },
        ],
    },
    3: {
        id: 3,
        partnerName: '박도현',
        avatarEmoji: '🦕',
        productName: '킹스네이크',
        productPrice: 250000,
        productId: 3,
        messages: [
            { id: 1, text: '킹스네이크 사진 좀 더 보내주실 수 있나요?', isMine: false, time: '어제', date: '어제' },
            { id: 2, text: '물론이죠! 잠깐만요', isMine: true, time: '어제', date: '어제' },
            { id: 3, text: '직거래 가능하신가요? 서울 강남 쪽으로요', isMine: false, time: '어제', date: '어제' },
        ],
    },
    4: {
        id: 4,
        partnerName: '최지우',
        avatarEmoji: '🐊',
        productName: '볼 파이톤2',
        productPrice: 300000,
        productId: 4,
        messages: [
            { id: 1, text: '입금 완료했습니다!', isMine: false, time: '월요일', date: '월요일' },
            { id: 2, text: '확인했어요! 바로 발송할게요 📦', isMine: true, time: '월요일', date: '월요일' },
            { id: 3, text: '택배 발송 완료했습니다! 운송장번호 드릴게요', isMine: true, time: '월요일', date: '월요일' },
        ],
    },
    5: {
        id: 5,
        partnerName: '정하은',
        avatarEmoji: '🦖',
        productName: '콘스네이크2',
        productPrice: 180000,
        productId: 5,
        messages: [
            { id: 1, text: '안녕하세요~ 혹시 사진 더 보내주실 수 있나요?', isMine: false, time: '지난주', date: '지난주' },
        ],
    },
};

export default function ChatPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [inputText, setInputText] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    const roomId = Number(id);
    const room = chatData[roomId];

    useEffect(() => {
        if (room) {
            setMessages(room.messages);
        }
    }, [roomId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = () => {
        const text = inputText.trim();
        if (!text) return;

        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? '오후' : '오전';
        const displayHours = hours % 12 || 12;
        const timeStr = `${ampm} ${displayHours}:${minutes}`;

        const newMsg: Message = {
            id: messages.length + 1,
            text,
            isMine: true,
            time: timeStr,
            date: '오늘',
        };

        setMessages((prev) => [...prev, newMsg]);
        setInputText('');
        inputRef.current?.focus();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

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
    const groupedMessages = messages.reduce<{ date: string; msgs: Message[] }[]>((acc, msg) => {
        const last = acc[acc.length - 1];
        if (last && last.date === msg.date) {
            last.msgs.push(msg);
        } else {
            acc.push({ date: msg.date, msgs: [msg] });
        }
        return acc;
    }, []);

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
                <div className="chat-header-avatar">{room.avatarEmoji}</div>
                <div className="chat-header-info">
                    <p className="chat-header-name">{room.partnerName}</p>
                    <p className="chat-header-sub">{room.productName} · {room.productPrice.toLocaleString()}원</p>
                </div>
            </div>

            {/* 상품 배너 */}
            <div className="chat-product-banner">
                <div
                    className="chat-product-thumb"
                    style={{ background: 'linear-gradient(135deg, #eaf6f3, #d1faf5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}
                >
                    {room.avatarEmoji}
                </div>
                <div className="chat-product-info">
                    <p className="chat-product-name">{room.productName}</p>
                    <p className="chat-product-price">{room.productPrice.toLocaleString()}원</p>
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
                                    <div className="chat-msg-avatar">{room.avatarEmoji}</div>
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
