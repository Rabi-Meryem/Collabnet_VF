'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function ChatSidebar({ currentUserId, selectedUserId, onUserSelect }) {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        console.log('🔍 Chargement des conversations pour userId:', currentUserId);
        const response = await fetch(`/api/conversations/${currentUserId}`);
        if (response.ok) {
          const data = await response.json();
          console.log('✅ Conversations chargées:', data.length);
          setConversations(data);
        } else {
          console.error('❌ Erreur lors du chargement des conversations:', response.status);
        }
      } catch (error) {
        console.error('Error fetching conversations:', error);
      } finally {
        setLoading(false);
      }
    };

    if (currentUserId) {
      fetchConversations();
      
      // Polling pour mettre à jour les conversations
      const interval = setInterval(fetchConversations, 5000);
      return () => clearInterval(interval);
    }
  }, [currentUserId]);

  if (loading) {
    return (
      <div className="w-80 bg-gray-50 border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Messages</h2>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-gray-500">Chargement...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-gray-50 border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Messages</h2>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            Aucune conversation
          </div>
        ) : (
          conversations.filter(conversation => conversation.otherUser).map((conversation) => {
            const otherUser = conversation.otherUser;
            const lastMessage = conversation.lastMessage;
            const isSelected = selectedUserId === otherUser.id;

            return (
              <div
                key={otherUser.id}
                onClick={() => onUserSelect(otherUser.id)}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors ${
                  isSelected ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  {/* Avatar */}
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                      {otherUser.profileImage ? (
                        <Image
                          src={`/uploads/${otherUser.profileImage}`}
                          alt={otherUser.fullName}
                          width={48}
                          height={48}
                          className="object-cover"
                        />
                      ) : (
                        <span className="text-gray-500 text-lg font-semibold">
                          {(otherUser.fullName || otherUser.companyName)?.charAt(0) || 'U'}
                        </span>
                      )}
                    </div>
                    {conversation.unreadCount > 0 && (
                      <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {conversation.unreadCount}
                      </div>
                    )}
                  </div>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-gray-900 truncate">
                        {otherUser.fullName || otherUser.companyName}
                      </h3>
                      {lastMessage && (
                        <span className="text-xs text-gray-500">
                          {new Date(lastMessage.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      )}
                    </div>
                    {lastMessage && (
                      <p className="text-sm text-gray-600 truncate mt-1">
                        {lastMessage.sender.id === currentUserId ? 'Vous: ' : ''}
                        {lastMessage.content}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
} 