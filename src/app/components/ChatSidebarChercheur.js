'use client';
import { useState, useEffect } from 'react';
import { getChercheurConversations } from '../utils/messaging-chercheur';

export default function ChatSidebarChercheur({ currentUserId, selectedUserId, onUserSelect }) {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConversations = async () => {
      if (!currentUserId) return;
      
      try {
        setLoading(true);
        console.log('🔍 ChatSidebarChercheur: Récupération des conversations pour:', currentUserId);
        
        const conversationsData = await getChercheurConversations(currentUserId);
        console.log('✅ ChatSidebarChercheur: Conversations récupérées:', conversationsData);
        
        setConversations(conversationsData);

        // Si un utilisateur est sélectionné mais pas dans la liste, essayer de le trouver
        if (selectedUserId && conversationsData.length > 0) {
          const targetConversation = conversationsData.find(conv => 
            conv.id === parseInt(selectedUserId)
          );
          
          if (!targetConversation) {
            console.log('🔍 ChatSidebarChercheur: Utilisateur sélectionné non trouvé dans les conversations, création d\'une nouvelle conversation...');
            // L'utilisateur sera ajouté à la liste après la création de conversation
          }
        }
      } catch (error) {
        console.error('❌ ChatSidebarChercheur: Erreur lors de la récupération des conversations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [currentUserId, selectedUserId]);

  const handleUserClick = (userId) => {
    console.log('🔍 ChatSidebarChercheur: Clic sur utilisateur:', userId);
    onUserSelect(userId);
  };

  if (loading) {
    return (
      <div className="w-80 bg-white border-r border-gray-200 p-4">
        <div className="flex items-center justify-center h-32">
          <div className="text-gray-500">Chargement des conversations...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-white border-r border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">Messages Chercheur</h2>
        <p className="text-sm text-gray-500">Vos conversations</p>
      </div>
      
      <div className="overflow-y-auto h-full">
        {conversations.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            <div className="text-4xl mb-2">💬</div>
            <p>Aucune conversation</p>
            <p className="text-sm">Commencez par contacter quelqu'un</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {conversations.map((conversation) => {
              return (
                <div
                  key={conversation.id}
                  onClick={() => handleUserClick(conversation.id)}
                  className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedUserId === conversation.id ? 'bg-green-50 border-r-2 border-green-500' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 font-semibold">
                        {conversation.name?.charAt(0) || '?'}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {conversation.name || 'Utilisateur inconnu'}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {conversation.lastMessage || 'Aucun message'}
                      </p>
                    </div>
                    {conversation.messageCount > 0 && (
                      <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-medium">
                          {conversation.unreadCount}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
} 