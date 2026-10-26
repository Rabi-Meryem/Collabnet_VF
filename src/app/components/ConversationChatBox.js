'use client';
import { useState, useEffect, useRef } from 'react';
import { initSocket, getSocket } from '../../lib/socket';
import Image from 'next/image';

export default function ConversationChatBox({ currentUser, selectedConversation }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize socket connection
  useEffect(() => {
    const setupSocket = async () => {
      const socket = await initSocket();
      
      socket.on('new-message', (message) => {
        if (message.conversationId === selectedConversation?.id) {
          setMessages(prev => [...prev, message]);
        }
      });

      socket.on('user-typing', (data) => {
        if (data.conversationId === selectedConversation?.id && data.senderId !== currentUser?.id) {
          setOtherUserTyping(data.isTyping);
        }
      });

      // Join user room
      if (currentUser?.id) {
        socket.emit('join-user', currentUser.id);
      }
    };

    if (currentUser?.id && selectedConversation?.id) {
      setupSocket();
    }
  }, [currentUser?.id, selectedConversation?.id]);

  // Load messages when selected conversation changes
  useEffect(() => {
    if (selectedConversation?.id && currentUser?.id) {
      const loadMessages = async () => {
        try {
          console.log('🔄 Chargement des messages pour la conversation:', selectedConversation.id);
          const response = await fetch(`/api/messages?conversationId=${selectedConversation.id}`);
          if (response.ok) {
            const data = await response.json();
            console.log('📨 Messages chargés:', data);
            setMessages(data);
          } else {
            console.error('❌ Erreur lors du chargement des messages');
          }
        } catch (error) {
          console.error('Error loading messages:', error);
        }
      };

      loadMessages();
    }
  }, [selectedConversation?.id, currentUser?.id]);

  // Handle typing indicator
  const handleTyping = () => {
    const socket = getSocket();
    if (socket && selectedConversation?.id) {
      socket.emit('typing', {
        conversationId: selectedConversation.id,
        senderId: currentUser?.id,
        isTyping: true
      });

      // Clear previous timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Set timeout to stop typing indicator
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('typing', {
          conversationId: selectedConversation.id,
          senderId: currentUser?.id,
          isTyping: false
        });
      }, 1000);
    }
  };

  // Send message
  const sendMessage = async () => {
    if (newMessage.trim() && selectedConversation?.id && currentUser?.id) {
      try {
        // Déterminer le type d'utilisateur connecté
        const chercheurEmail = localStorage.getItem('chercheurEmail');
        const entrepriseEmail = localStorage.getItem('entrepriseEmail');
        
        let senderType, receiverType;
        if (chercheurEmail) {
          senderType = 'chercheur';
          receiverType = 'entreprise';
        } else if (entrepriseEmail) {
          senderType = 'entreprise';
          receiverType = 'chercheur';
        }

        const messageData = {
          content: newMessage,
          conversationId: selectedConversation.id,
          senderId: currentUser.id,
          receiverId: selectedConversation.participantId,
          senderType: senderType,
          receiverType: receiverType
        };

        console.log('📤 Envoi du message:', messageData);

        const response = await fetch('/api/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(messageData),
        });

        if (response.ok) {
          const savedMessage = await response.json();
          console.log('✅ Message envoyé:', savedMessage);
          
          // Add message to local state
          setMessages(prev => [...prev, savedMessage]);
          
          // Clear input
          setNewMessage('');
          
          // Stop typing indicator
          const socket = getSocket();
          if (socket) {
            socket.emit('typing', {
              conversationId: selectedConversation.id,
              senderId: currentUser.id,
              isTyping: false
            });
          }
        } else {
          console.error('❌ Erreur lors de l\'envoi du message');
          alert('Erreur lors de l\'envoi du message');
        }
      } catch (error) {
        console.error('Error sending message:', error);
        alert('Erreur lors de l\'envoi du message');
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!selectedConversation) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-500">
          <div className="text-6xl mb-4">💬</div>
          <h3 className="text-xl font-semibold mb-2">Sélectionnez une conversation</h3>
          <p className="text-gray-400">Choisissez un utilisateur pour commencer à discuter</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((message, index) => (
          <div
            key={message.id || index}
            className={`flex ${message.senderId === currentUser?.id ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                message.senderId === currentUser?.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-800 shadow-sm'
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <p className={`text-xs mt-1 ${
                message.senderId === currentUser?.id ? 'text-blue-100' : 'text-gray-500'
              }`}>
                {new Date(message.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </p>
            </div>
          </div>
        ))}
        
        {otherUserTyping && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-800 px-4 py-2 rounded-2xl shadow-sm">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input - WhatsApp Style */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex items-center space-x-3">
          <button className="p-2 text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
              handleTyping();
            }}
            onKeyPress={handleKeyPress}
            placeholder="Tapez votre message..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
          />
          <button
            onClick={sendMessage}
            disabled={!newMessage.trim()}
            className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
} 