// lib/api.js
export class ApiClient {
    constructor() {
      this.baseUrl = process.env.NEXT_PUBLIC_API_URL;
    }
    
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
            feature,        // e.g., 'study-tools', 'writing-help', 'code-generator'
            subFeature      // e.g., 'flashcards', 'notes', 'summarizer'
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
    
    // Add method to get chat history by feature
    async getChatsByFeature(feature, subFeature = null, page = 1, limit = 10) {
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
        
        return await response.json();
      } catch (error) {
        console.error('API error:', error);
        throw error;
      }
    }
  }
  
  export default new ApiClient();