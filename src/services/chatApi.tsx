import api from '../lib/api';

export interface SendMessageData {
  type: string;
  content: string;
  attachmentUrls?: string[];
}

export const chatApi = {
  createOrGetRoom: (productId: number) =>
    api.post('/chat/rooms/by-post', { productId }).then((r) => r.data.data),

  getRooms: () =>
    api.get('/chat/rooms').then((r) => r.data.data),

  getMessages: (roomId: number, cursor?: number, size = 30) =>
    api.get(`/chat/rooms/${roomId}/messages`, { params: { cursor, size } })
       .then((r) => r.data.data),

  sendMessage: (roomId: number, data: SendMessageData) =>
    api.post(`/chat/rooms/${roomId}/messages`, data).then((r) => r.data.data),

  markAsRead: (roomId: number, lastReadMessageId: number) =>
    api.post(`/chat/rooms/${roomId}/read`, { lastReadMessageId }).then((r) => r.data),
};
