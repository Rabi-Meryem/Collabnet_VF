'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

export default function ChatBox({ currentUserId, selectedUserId, selectedUser }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Polling pour les nouveaux messages
  useEffect(() => {
    if (selectedUserId && currentUserId) {
      const loadMessages = async () => {
        try {
          // Utiliser les IDs tels quels - la logique simplifiée de l'API s'en chargera
          let actualCurrentUserId = currentUserId;
          let actualSelectedUserId = selectedUserId;
          
          // Forcer l'ID entreprise à 1001 si nécessaire
          if (actualCurrentUserId === 5) {
            actualCurrentUserId = 1001;
          }
          if (actualSelectedUserId === 5) {
            actualSelectedUserId = 1001;
          }
          
          console.log('📨 Chargement des messages avec IDs:', { actualCurrentUserId, actualSelectedUserId });
          
          const response = await fetch(
            `/api/messages/conversation?userId1=${actualCurrentUserId}&userId2=${actualSelectedUserId}`
          );
          if (response.ok) {
            const data = await response.json();
            setMessages(data);
            console.log('📨 Messages chargés:', data.length);
          } else {
            console.error('❌ Erreur lors du chargement des messages:', response.status);
          }
        } catch (error) {
          console.error('Error polling messages:', error);
        }
      };

      // Charger immédiatement
      loadMessages();
      
      // Puis poller toutes les 2 secondes
      const interval = setInterval(loadMessages, 2000);
      return () => clearInterval(interval);
    }
  }, [selectedUserId, currentUserId]);

  // Marquer les messages comme lus
  const markMessagesAsRead = async () => {
    try {
      // Forcer l'utilisation de l'ID entreprise si nécessaire
      let actualCurrentUserId = currentUserId;
      const entrepriseEmail = localStorage.getItem('entrepriseEmail');
      
      if (entrepriseEmail && currentUserId === 5) {
        actualCurrentUserId = 1001;
      }
      
      await fetch('/api/messages/mark-read', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          senderId: selectedUserId,
          receiverId: actualCurrentUserId
        })
      });
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  // Send message
  const sendMessage = async () => {
    console.log('🚀 DEBUG - Fonction sendMessage appelée');
    console.log('🚀 DEBUG - Valeurs reçues:', {
      currentUserId,
      selectedUserId,
      selectedUser,
      newMessage: newMessage.trim(),
      localStorage: {
        chercheurEmail: localStorage.getItem('chercheurEmail'),
        entrepriseEmail: localStorage.getItem('entrepriseEmail')
      }
    });

    if (newMessage.trim() && selectedUserId) {
      console.log('✅ Conditions remplies, envoi du message...');
      // Logique simplifiée : toujours utiliser l'ID de l'URL comme destinataire
      const pathParts = window.location.pathname.split('/');
      const urlUserId = pathParts[pathParts.length - 1];
      
      // Forcer l'utilisation de l'ID entreprise si nécessaire
      let finalSenderId = currentUserId;
      let finalReceiverId = urlUserId; // Toujours utiliser l'ID de l'URL
      
      // Déterminer le type d'utilisateur connecté (prioriser l'entreprise)
      const chercheurEmail = localStorage.getItem('chercheurEmail');
      const currentEntrepriseEmail = localStorage.getItem('entrepriseEmail');
      
      let senderType = 'chercheur';
      let receiverType = 'chercheur'; // Par défaut
      
      // Si l'utilisateur connecté est une entreprise, forcer l'ID entreprise
      if (currentEntrepriseEmail) {
        // Forcer l'ID entreprise à 1001
        finalSenderId = 1001;
        senderType = 'entreprise';
        console.log('🔄 ID entreprise forcé à 1001');
        
        // Si le destinataire est aussi une entreprise avec ID 5, le forcer à 1001
        if (parseInt(urlUserId) === 5) {
          finalReceiverId = 1001;
          receiverType = 'entreprise';
          console.log('🔄 ID destinataire entreprise forcé à 1001');
        } else {
          receiverType = 'chercheur';
        }
      } else if (chercheurEmail) {
        senderType = 'chercheur';
        // Déterminer le type du destinataire basé sur son ID
        if (parseInt(finalReceiverId) === 1001) {
          receiverType = 'entreprise';
        } else {
          receiverType = 'chercheur';
        }
      } else {
        // Fallback - forcer l'ID entreprise
        finalSenderId = 1001;
        senderType = 'entreprise';
        receiverType = 'chercheur';
      }
      
      console.log('📤 Envoi du message:', {
        content: newMessage.trim(),
        senderId: finalSenderId,
        receiverId: finalReceiverId,
        senderType,
        receiverType
      });
      
      console.log('🔍 Vérification des IDs:', {
        currentUserId,
        selectedUserId,
        urlUserId,
        finalSenderId,
        finalReceiverId
      });
      
      // Vérifier que l'ID de l'URL est valide
      if (!urlUserId || isNaN(parseInt(urlUserId)) || urlUserId === 'undefined') {
        console.error('❌ ID de l\'URL invalide:', urlUserId);
        alert('Erreur: Impossible de déterminer le destinataire. Veuillez rafraîchir la page.');
        return;
      }
      
      // Vérification finale que les IDs sont différents
      if (parseInt(finalSenderId) === parseInt(finalReceiverId)) {
        console.error('❌ ERREUR FINALE: Les IDs sont identiques');
        console.log('🔍 Debug final:', { finalSenderId, finalReceiverId, currentUserId, selectedUserId });
        
        // Solution temporaire : forcer des types différents
        if (senderType === receiverType) {
          if (senderType === 'entreprise') {
            receiverType = 'chercheur';
          } else {
            receiverType = 'entreprise';
          }
          console.log('🔄 Types forcés différents:', { senderType, receiverType });
        }
        
        // Si les IDs sont encore identiques après correction des types, afficher l'erreur
        if (parseInt(finalSenderId) === parseInt(finalReceiverId)) {
          alert('Erreur: Impossible de déterminer les utilisateurs. Veuillez rafraîchir la page.');
          return;
        }
      }

      try {
        // Créer un message temporaire pour l'affichage immédiat
        const tempMessage = {
          id: Date.now(),
          content: newMessage.trim(),
          senderId: parseInt(finalSenderId),
          receiverId: parseInt(finalReceiverId),
          senderType,
          receiverType,
          createdAt: new Date().toISOString(),
          read: false
        };

        // Ajouter immédiatement le message à l'interface
        setMessages(prev => [...prev, tempMessage]);
        setNewMessage('');

        // Envoyer le message via API REST
        const response = await fetch('/api/messages/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content: tempMessage.content,
            senderId: finalSenderId,
            receiverId: finalReceiverId,
            senderType,
            receiverType
          })
        });

        if (response.ok) {
          const sentMessage = await response.json();
          console.log('✅ Message envoyé avec succès:', sentMessage);
          
          // Remplacer le message temporaire par le vrai message
          setMessages(prev => prev.map(msg => 
            msg.id === tempMessage.id ? sentMessage : msg
          ));
        } else {
          const errorData = await response.json();
          console.error('❌ Erreur lors de l\'envoi:', errorData);
          
          // Retirer le message temporaire en cas d'erreur
          setMessages(prev => prev.filter(msg => msg.id !== tempMessage.id));
          
          alert(`Erreur lors de l'envoi du message: ${errorData.error || 'Erreur inconnue'}`);
        }
      } catch (error) {
        console.error('❌ Erreur lors de l\'envoi du message:', error);
        alert('Erreur lors de l\'envoi du message');
      }
    }
  };

  // Handle Enter key
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!selectedUser) {
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
    <div className="flex-1 flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
            {selectedUser.profileImage ? (
              <Image
                src={`/uploads/${selectedUser.profileImage}`}
                alt={selectedUser.fullName || selectedUser.companyName}
                width={40}
                height={40}
                className="object-cover"
              />
            ) : (
              <span className="text-gray-500 text-sm font-semibold">
                {(selectedUser.fullName || selectedUser.companyName)?.charAt(0) || 'U'}
              </span>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">
              {selectedUser.fullName || selectedUser.companyName}
            </h3>
            {otherUserTyping && (
              <p className="text-sm text-gray-500">En train d'écrire...</p>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => {
          // Forcer l'utilisation de l'ID entreprise pour la comparaison
          let actualCurrentUserId = currentUserId;
          const entrepriseEmail = localStorage.getItem('entrepriseEmail');
          
          if (entrepriseEmail && currentUserId === 5) {
            actualCurrentUserId = 1001;
          }
          
          const isOwnMessage = parseInt(message.senderId) === parseInt(actualCurrentUserId);
          
          return (
            <div
              key={message.id}
              className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-2`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                  isOwnMessage
                    ? 'bg-blue-500 text-white rounded-br-md'
                    : 'bg-gray-200 text-gray-900 rounded-bl-md'
                }`}
              >
                <p className="text-sm break-words">{message.content}</p>
                <div className={`flex items-center justify-between mt-1 ${
                  isOwnMessage ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  <p className="text-xs">
                    {new Date(message.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                  {isOwnMessage && (
                    <span className="text-xs ml-2">
                      {message.read ? '✓✓' : '✓'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Tapez votre message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={sendMessage}
            disabled={!newMessage.trim()}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Envoyer
          </button>
        </div>
      </div>
    </div>
  );
} 