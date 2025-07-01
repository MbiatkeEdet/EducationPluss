import { io } from 'socket.io-client';

class SocketClient {
  constructor() {
    this.socket = null;
    this.isConnected = false;
  }

  connect(token) {
    if (this.socket && this.isConnected) {
      return this.socket;
    }

    const serverUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:3001';
    
    this.socket = io(serverUrl, {
      auth: {
        token: token
      },
      transports: ['websocket', 'polling']
    });

    this.socket.on('connect', () => {
      console.log('Connected to server');
      this.isConnected = true;
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
      this.isConnected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      this.isConnected = false;
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  sendMessage(data, callbacks = {}) {
    if (!this.socket || !this.isConnected) {
      throw new Error('Socket not connected');
    }

    const { onStarted, onInfo, onChunk, onComplete, onError } = callbacks;

    // Set up event listeners
    if (onStarted) {
      this.socket.once('chat_started', onStarted);
    }

    if (onInfo) {
      this.socket.once('chat_info', onInfo);
    }

    if (onChunk) {
      this.socket.on('chat_chunk', onChunk);
      this.socket.once('chat_complete_chunk', onChunk);
    }

    if (onComplete) {
      this.socket.once('chat_complete', (data) => {
        // Clean up chunk listener
        if (onChunk) {
          this.socket.off('chat_chunk', onChunk);
        }
        onComplete(data);
      });
    }

    if (onError) {
      this.socket.once('chat_error', (error) => {
        // Clean up all listeners on error
        if (onChunk) {
          this.socket.off('chat_chunk', onChunk);
        }
        onError(error);
      });
    }

    // Send the message
    this.socket.emit('chat_message', data);
  }

  isSocketConnected() {
    return this.socket && this.isConnected;
  }
}

// Create singleton instance
const socketClient = new SocketClient();

export default socketClient;