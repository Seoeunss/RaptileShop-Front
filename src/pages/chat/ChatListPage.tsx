import { useNavigate } from 'react-router-dom';
import './style/ChatListPage.css';

type ChatRoom = {
    id: number;
    partnerName: string;
    avatarEmoji: string;
    productName: string;
    productPrice: number;
    lastMessage: string;
    time: string;
    unread: number;
};

const chatRooms: ChatRoom[] = [
    {
        id: 1,
        partnerName: '김민준',
        avatarEmoji: '🦎',
        productName: '볼 파이톤',
        productPrice: 300000,
        lastMessage: '안녕하세요! 볼 파이톤 아직 판매 중인가요?',
        time: '오후 3:24',
        unread: 2,
    },
    {
        id: 2,
        partnerName: '이서연',
        avatarEmoji: '🐍',
        productName: '콘스네이크',
        productPrice: 180000,
        lastMessage: '네, 건강하게 잘 지내고 있어요 😊',
        time: '오전 11:05',
        unread: 0,
    },
    {
        id: 3,
        partnerName: '박도현',
        avatarEmoji: '🦕',
        productName: '킹스네이크',
        productPrice: 250000,
        lastMessage: '직거래 가능하신가요? 서울 강남 쪽으로요',
        time: '어제',
        unread: 1,
    },
    {
        id: 4,
        partnerName: '최지우',
        avatarEmoji: '🐊',
        productName: '볼 파이톤2',
        productPrice: 300000,
        lastMessage: '택배 발송 완료했습니다! 운송장번호 드릴게요',
        time: '월요일',
        unread: 0,
    },
    {
        id: 5,
        partnerName: '정하은',
        avatarEmoji: '🦖',
        productName: '콘스네이크2',
        productPrice: 180000,
        lastMessage: '혹시 사진 더 보내주실 수 있나요?',
        time: '지난주',
        unread: 0,
    },
];

export default function ChatListPage() {
    const navigate = useNavigate();
    const totalUnread = chatRooms.reduce((sum, r) => sum + r.unread, 0);

    return (
        <section className="chat-list-page">
            <div className="chat-list-header">
                <h1 className="chat-list-title">채팅</h1>
                {totalUnread > 0 && (
                    <span className="chat-count-badge">{totalUnread}</span>
                )}
            </div>

            {chatRooms.length === 0 ? (
                <div className="chat-list-empty">
                    <div className="chat-list-empty-icon">💬</div>
                    <p className="chat-list-empty-text">아직 채팅이 없어요</p>
                    <p className="chat-list-empty-desc">
                        마음에 드는 파충류를 발견하면<br />판매자에게 문의해보세요!
                    </p>
                </div>
            ) : (
                <div className="chat-list">
                    {chatRooms.map((room, index) => (
                        <div key={room.id}>
                            <div
                                className="chat-item"
                                onClick={() => navigate(`/chat/${room.id}`)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => e.key === 'Enter' && navigate(`/chat/${room.id}`)}
                            >
                                <div className="chat-avatar">{room.avatarEmoji}</div>

                                <div className="chat-item-body">
                                    <div className="chat-item-top">
                                        <span className="chat-item-name">{room.partnerName}</span>
                                        <span className="chat-item-time">{room.time}</span>
                                    </div>
                                    <div className="chat-item-bottom">
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
                                            <span className="chat-item-product">
                                                {room.productName} · {room.productPrice.toLocaleString()}원
                                            </span>
                                            <span className="chat-item-preview">{room.lastMessage}</span>
                                        </div>
                                        <div className="chat-item-meta">
                                            {room.unread > 0 && (
                                                <span className="unread-badge">{room.unread}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {index < chatRooms.length - 1 && (
                                <div className="chat-divider" />
                            )}
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}
