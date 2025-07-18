import socketClient from './socketClient';

// lib/api.js
export class ApiClient {
    constructor() {
      this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
    }
    
    // Initialize socket connection
    async initializeSocket() {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          return socketClient.connect(token);
        } catch (error) {
          console.error('Failed to initialize socket:', error);
          throw new Error('Failed to connect to real-time service');
        }
      }
      throw new Error('No authentication token found');
    }
    
    // Send message via WebSocket with enhanced error handling
    async sendMessageSocket(data, callbacks = {}) {
      try {
        // Ensure socket is connected, with automatic reconnection
        if (!socketClient.isSocketConnected()) {
          console.log('Socket not connected, initializing...');
          await this.initializeSocket();
        }

        return await socketClient.sendMessage(data, {
          ...callbacks,
          onError: (error) => {
            console.error('Socket message error:', error);
            if (callbacks.onError) {
              callbacks.onError(error);
            }
          }
        });
      } catch (error) {
        console.error('Socket message error:', error);
        
        // If socket fails, fall back to HTTP
        console.log('Falling back to HTTP messaging...');
        try {
          const response = await this.sendMessage(
            data.content,
            data.chatId,
            data.aiProvider,
            data.model,
            data.systemContext,
            data.feature,
            data.subFeature
          );
          
          // Simulate the callback format for HTTP fallback
          if (callbacks.onComplete) {
            callbacks.onComplete({
              chatId: response.data.chat._id,
              aiResponse: response.data.aiResponse
            });
          }
          
          return response;
        } catch (httpError) {
          console.error('HTTP fallback also failed:', httpError);
          throw new Error('Both WebSocket and HTTP messaging failed. Please check your connection.');
        }
      }
    }
    
    // Fallback HTTP message sending (for backward compatibility)
    async sendMessage(content, chatId = null, aiProvider = null, model = null, systemContext = undefined, feature = null, subFeature = null) {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      try {
        const response = await fetch(`${this.baseUrl}/chat/message`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            content,
            chatId,
            aiProvider,
            model,
            systemContext,
            feature,
            subFeature
          })
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to send message');
        }
        
        return await response.json();
      } catch (error) {
        console.error('API error:', error);
        throw error;
      }
    }
    
    async getChats() {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      try {
        const response = await fetch(`${this.baseUrl}/chat`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch chats');
        }
        
        return await response.json();
      } catch (error) {
        console.error('API error:', error);
        throw error;
      }
    }
    
    async getChat(chatId) {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      try {
        const response = await fetch(`${this.baseUrl}/chat/${chatId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch chat');
        }
        
        return await response.json();
      } catch (error) {
        console.error('API error:', error);
        throw error;
      }
    }
    
    async deleteChat(chatId) {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      try {
        const response = await fetch(`${this.baseUrl}/chat/${chatId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to delete chat');
        }
        
        return await response.json();
      } catch (error) {
        console.error('API error:', error);
        throw error;
      }
    }
    
    async updateChatCategory(chatId, category) {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      try {
        const response = await fetch(`${this.baseUrl}/chat/${chatId}/category`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            category
          })
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to update chat category');
        }
        
        return await response.json();
      } catch (error) {
        console.error('API error:', error);
        throw error;
      }
    }
    
    async getChatsByFeature(feature, subFeature = null, page = 1, limit = 20) {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      try {
        const params = new URLSearchParams({ 
          feature,
          page: page.toString(),
          limit: limit.toString()
        });
        if (subFeature) params.append('subFeature', subFeature);
        
        const response = await fetch(`${this.baseUrl}/chat/chat-history?${params}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch chat history');
        }
        
        const data = await response.json();
        
        // Normalize response structure
        return {
          success: data.success,
          data: data.data || data.chats || [],
          chats: data.data || data.chats || [],
          total: data.totalCount || data.total || 0,
          totalCount: data.totalCount || data.total || 0,
          totalPages: data.totalPages || Math.ceil((data.totalCount || data.total || 0) / limit),
          currentPage: data.currentPage || page,
          filters: data.filters || {}
        };
      } catch (error) {
        console.error('API error:', error);
        throw error;
      }
    }

    // EPlus Balance and Rewards
    async getEPlusBalance() {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Authentication required');
      }

      try {
        const response = await fetch(`${this.baseUrl}/eplus/balance`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch EPlus balance');
        }

        return await response.json();
      } catch (error) {
        console.error('API error:', error);
        throw error;
      }
    }

    async getRewardStats() {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Authentication required');
      }

      try {
        const response = await fetch(`${this.baseUrl}/eplus/stats`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch reward stats');
        }

        return await response.json();
      } catch (error) {
        console.error('API error:', error);
        throw error;
      }
    }

    async processDailyLogin() {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Authentication required');
      }

      try {
        const response = await fetch(`${this.baseUrl}/eplus/daily-login`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to process daily login');
        }

        return await response.json();
      } catch (error) {
        console.error('API error:', error);
        throw error;
      }
    }

    async streamChatGptResponse(payload, onChunk, onComplete, onError) {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      try {
        const response = await fetch(`${this.baseUrl}/chatgpt/stream`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to stream response');
        }
        
        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let buffer = '';
        let fullResponse = '';
        let chatData = null;
        
        while (true) {
          const { done, value } = await reader.read();
          
          if (done) break;
          
          buffer += decoder.decode(value, { stream: true });
          
          // Process buffer line by line to be more robust
          let eolIndex;
          while ((eolIndex = buffer.indexOf('\n')) >= 0) {
            const line = buffer.slice(0, eolIndex).trim();
            buffer = buffer.slice(eolIndex + 1);

            if (line === '') {
              // Empty line is an event separator, ignore.
              continue;
            }

            if (line.startsWith('data:')) {
              const jsonStr = line.substring(5).trim();
              if (jsonStr) {
                try {
                  const data = JSON.parse(jsonStr);
                  
                  if (data.type === 'chunk' && data.content) {
                    fullResponse += data.content;
                    if (onChunk) onChunk(data.content, fullResponse);
                  } else if (data.type === 'complete' && data.success) {
                    chatData = data.data;
                    if (onComplete) onComplete(chatData, fullResponse);
                  } else if (data.type === 'error') {
                    if (onError) onError(new Error(data.error));
                    return; // Stop processing on stream error
                  } else if (data.streaming && data.success) {
                    // Initial response with chat info
                    chatData = { chatId: data.chatId, isNewChat: data.isNewChat };
                  }
                } catch (parseError) {
                  console.error('Failed to parse SSE JSON:', jsonStr, parseError);
                  if (onError) {
                    onError(new Error('Failed to parse streaming data.'));
                  }
                }
              }
            } else {
              // Log any other lines that are not comments
              if (!line.startsWith(':')) {
                console.log('Received non-data SSE line:', line);
              }
            }
          }
        }
        
        return chatData;
      } catch (error) {
        console.error('API error:', error);
        throw error;
      }
    }

    // Disconnect socket when logging out
    disconnect() {
      socketClient.disconnect();
    }
  }
  
  const apiClient = new ApiClient();
  export default apiClient;