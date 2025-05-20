// lib/api.js
export class ApiClient {
    constructor() {
      this.baseUrl = 'http://localhost:3002/api';
    }
    
    async sendMessage(content, chatId = null, aiProvider = null, model = null) {
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
            model
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
  }
  
  export default new ApiClient();