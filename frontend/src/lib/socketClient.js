import { io } from 'socket.io-client';

class SocketClient {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.token = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectTimeout = null;
  }

  connect(token) {
    this.token = token; // Store token for reconnection
    
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
      this.reconnectAttempts = 0; // Reset reconnect attempts on successful connection
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
    // Clear any pending reconnect timeout
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  // Auto-reconnect method
  async attemptReconnect() {
    if (!this.token || this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached or no token available');
      return false;
    }

    this.reconnectAttempts++;
    console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);

    try {
      // Disconnect existing socket first
      if (this.socket) {
        this.socket.disconnect();
        this.socket = null;
        this.isConnected = false;
      }

      // Wait a bit before reconnecting
      await new Promise(resolve => setTimeout(resolve, 1000 * this.reconnectAttempts));

      // Attempt to reconnect
      this.connect(this.token);

      // Wait for connection to establish
      return new Promise((resolve) => {
        const checkConnection = () => {
          if (this.isConnected) {
            resolve(true);
          } else {
            // Check again after a short delay
            setTimeout(() => {
              if (this.isConnected) {
                resolve(true);
              } else {
                resolve(false);
              }
            }, 2000);
          }
        };
        checkConnection();
      });
    } catch (error) {
      console.error('Reconnection failed:', error);
      return false;
    }
  }

  async sendMessage(data, callbacks = {}) {
    // If not connected, try to reconnect first
    if (!this.socket || !this.isConnected) {
      console.log('Socket not connected, attempting to reconnect...');
      
      try {
        const reconnected = await this.attemptReconnect();
        if (!reconnected) {
          throw new Error('Failed to reconnect to server. Please refresh the page.');
        }
      } catch (error) {
        throw new Error('Socket connection failed. Please check your internet connection and refresh the page.');
      }
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
    try {
      this.socket.emit('chat_message', data);
    } catch (error) {
      console.error('Failed to send message:', error);
      // Try to reconnect and send again
      try {
        const reconnected = await this.attemptReconnect();
        if (reconnected) {
          this.socket.emit('chat_message', data);
        } else {
          throw new Error('Failed to send message after reconnection attempt');
        }
      } catch (reconnectError) {
        if (onError) {
          onError(reconnectError);
        } else {
          throw reconnectError;
        }
      }
    }
  }

  isSocketConnected() {
    return this.socket && this.isConnected;
  }
}

// Create singleton instance
const socketClient = new SocketClient();

export default socketClient;