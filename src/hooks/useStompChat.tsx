import { useEffect, useRef, useCallback } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:8082/ws';

export interface ChatMessage {
  id: number;
  roomId: number;
  type: string;
  content: string;
  attachmentUrls: string[];
  senderId: number;
  createdAt: string;
}

interface UseStompChatOptions {
  roomId: number | null;
  onMessage: (msg: ChatMessage) => void;
}

export function useStompChat({ roomId, onMessage }: UseStompChatOptions) {
  const clientRef = useRef<Client | null>(null);

  const connect = useCallback(() => {
    const token = sessionStorage.getItem('accessToken');
    if (!token || !roomId) return;

    const client = new Client({
      webSocketFactory: () => new SockJS(WS_URL) as WebSocket,
      connectHeaders: { Authorization: `Bearer ${token}` },
      reconnectDelay: 5000,
      onConnect: () => {
        client.subscribe(`/topic/chat/rooms/${roomId}`, (frame) => {
          try {
            const msg: ChatMessage = JSON.parse(frame.body);
            onMessage(msg);
          } catch (e) {
            console.error('[STOMP] 메시지 파싱 실패', e);
          }
        });
      },
      onStompError: (frame) => {
        console.error('[STOMP] 에러', frame);
      },
    });

    client.activate();
    clientRef.current = client;
  }, [roomId, onMessage]);

  const sendMessage = useCallback(
    (content: string, attachmentUrls: string[] = []) => {
      if (!clientRef.current?.connected || !roomId) return;
      clientRef.current.publish({
        destination: '/app/chat.send',
        body: JSON.stringify({ roomId, type: 'TEXT', content, attachmentUrls }),
      });
    },
    [roomId]
  );

  useEffect(() => {
    connect();
    return () => {
      clientRef.current?.deactivate();
      clientRef.current = null;
    };
  }, [connect]);

  return { sendMessage };
}
