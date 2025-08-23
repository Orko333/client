import { io, Socket } from 'socket.io-client';
import { baseURL } from '../api/client';

class SocketService {
  private socket: Socket | null = null;
  private token: string | null = null;

  connect(token: string) {
    if (this.socket?.connected) return;
    
    this.token = token;
  // Use baseURL from client api (comes from VITE_API_URL or default)
  const url = baseURL.replace(/\/$/, '');
  this.socket = io(url, {
      auth: { token },
      transports: ['websocket', 'polling']
    });

    this.socket.on('connect', () => {
      console.log('Connected to server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Приєднатися до кімнати замовлення
  joinOrderRoom(orderId: string) {
    if (this.socket) {
  this.socket.emit('join_order_room', { order_id: orderId, token: this.token });
    }
  }

  // Покинути кімнату замовлення
  leaveOrderRoom(orderId: string) {
    if (this.socket) {
  this.socket.emit('leave_order_room', { order_id: orderId, token: this.token });
    }
  }

  // Слухати нові повідомлення
  onNewMessage(callback: (message: any) => void) {
    if (this.socket) {
      this.socket.on('new_message', callback);
    }
  }

  // Слухати нові повідомлення від служби підтримки / адмінів
  onNewSupportMessage(callback: (message: any) => void) {
    if (this.socket) {
      this.socket.on('new_support_message', callback);
    }
  }

  // Слухати оновлення статусу замовлення
  onOrderStatusUpdate(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('order_status_updated', callback);
    }
  }

  // Відправити повідомлення
  sendMessage(orderId: string, text: string, clientMessageId: string) {
    if (this.socket) {
      this.socket.emit('send_message', {
        order_id: orderId,
        text,
        direction: 'in',
  client_message_id: clientMessageId,
  token: this.token
      });
    }
  }

  // Відправити повідомлення підтримці (без order_id)
  sendUserMessage(text: string, clientMessageId?: string) {
    if (this.socket) {
      this.socket.emit('send_user_message', {
        text,
  client_message_id: clientMessageId,
  token: this.token
      });
    }
  }

  // Приєднатися до персональної кімнати (через emit 'join' з токеном)
  joinUserRoom() {
    if (this.socket && this.token) {
  this.socket.emit('join', { token: this.token });
    }
  }

  // Сповіщення
  onNotification(callback: (notification: any) => void) {
    if (this.socket) {
      this.socket.on('notification', callback);
    }
  }

  // Видалити всі слухачі
  removeAllListeners() {
    if (this.socket) {
      this.socket.removeAllListeners();
    }
  }

  get isConnected() {
    return this.socket?.connected || false;
  }
}

export const socketService = new SocketService();
export default socketService;
