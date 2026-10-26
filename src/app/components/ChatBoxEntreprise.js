'use client';
import { useState, useEffect, useRef } from 'react';
import { sendEntrepriseMessage } from '../utils/messaging-entreprise';

export default function ChatBoxEntreprise({ currentUserId, selectedUserId, selectedUser }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  
  // Déterminer le type de l'utilisateur sélectionné
  const selectedUserType = selectedUser?.fullName ? 'chercheur' : 'entreprise';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (selectedUserId) {
      fetchMessages();
    }
  }, [selectedUserId]);

  const fetchMessages = async () => {
    if (!selectedUserId || !currentUserId) return;
    
    try {
      setLoading(true);
      console.log('🔍 ChatBoxEntreprise: Récupération des messages pour la conversation:', selectedUserId);
      
      const response = await fetch(`/api/messages/entreprise/${currentUserId}/${selectedUserId}`);
      if (response.ok) {
        const messagesData = await response.json();
        console.log('✅ ChatBoxEntreprise: Messages récupérés:', messagesData);
        setMessages(messagesData);
      } else {
        console.error('❌ ChatBoxEntreprise: Erreur lors de la récupération des messages');
      }
    } catch (error) {
      console.error('❌ ChatBoxEntreprise: Erreur réseau:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUserId) return;

    try {
      console.log('🔍 ChatBoxEntreprise: Envoi du message:', newMessage);
      
      // Envoyer le message directement
      const messageResult = await sendEntrepriseMessage(null, currentUserId, newMessage, selectedUserId, selectedUserType);
      
      if (messageResult) {
        console.log('✅ ChatBoxEntreprise: Message envoyé avec succès');
        setNewMessage('');
        
        // Ajouter le message à la liste locale
        const newMessageObj = {
          id: messageResult.id,
          content: newMessage,
          senderId: currentUserId,
          senderType: 'entreprise',
          timestamp: new Date().toISOString()
        };
        
        setMessages(prev => [...prev, newMessageObj]);
      }
    } catch (error) {
      console.error('❌ ChatBoxEntreprise: Erreur lors de l\'envoi du message:', error);
    }
  };

  if (!selectedUserId) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-500">
          <div className="text-6xl mb-4">💬</div>
          <h3 className="text-xl font-semibold mb-2">Sélectionnez une conversation</h3>
          <p>Choisissez un contact pour commencer à discuter</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600 font-semibold">
              {selectedUser?.fullName?.charAt(0) || selectedUser?.companyName?.charAt(0) || '?'}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">
              {selectedUser?.fullName || selectedUser?.companyName || 'Utilisateur inconnu'}
            </h3>
            <p className="text-sm text-gray-500">En ligne</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="text-gray-500">Chargement des messages...</div>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <div className="text-4xl mb-2">💬</div>
            <p>Aucun message</p>
            <p className="text-sm">Commencez la conversation</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.senderId === currentUserId
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-900'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className={`text-xs mt-1 ${
                  message.senderId === currentUserId ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {new Date(message.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Tapez votre message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black font-medium"
            style={{ color: '#000000' }}
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Envoyer
          </button>
        </form>
      </div>
    </div>
  );
} 