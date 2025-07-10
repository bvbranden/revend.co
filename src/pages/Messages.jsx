import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useAuth } from '../contexts/AuthContext';
import supabase from '../lib/supabase';

const { FiMessageCircle, FiSend, FiSearch, FiMoreVertical } = FiIcons;

const Messages = () => {
  const { user } = useAuth();
  const [selectedChat, setSelectedChat] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchConversations = async () => {
      setIsLoading(true);
      try {
        // In a real app, you'd query a conversations or messages table
        // This is a simplified version that just fetches distinct users who have messaged with the current user
        const { data, error } = await supabase
          .from('messages_revend')
          .select('sender_id, receiver_id, created_at')
          .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching conversations:', error);
          return;
        }

        // Get unique user IDs from conversations
        const uniqueUserIds = new Set();
        data.forEach(msg => {
          const otherId = msg.sender_id === user.id ? msg.receiver_id : msg.sender_id;
          uniqueUserIds.add(otherId);
        });

        // Fetch user profiles for these IDs
        if (uniqueUserIds.size > 0) {
          const { data: profiles, error: profilesError } = await supabase
            .from('profiles_revend')
            .select('*')
            .in('id', Array.from(uniqueUserIds));

          if (profilesError) {
            console.error('Error fetching profiles:', profilesError);
            return;
          }

          // Create conversation objects
          const conversationsData = profiles.map(profile => ({
            id: profile.id,
            name: profile.name,
            company: profile.company,
            avatar: profile.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
            lastMessage: 'Click to view conversation',
            time: '...',
            unread: 0
          }));

          setConversations(conversationsData);
        }
      } catch (err) {
        console.error('Error in fetchConversations:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConversations();
  }, [user]);

  useEffect(() => {
    if (!selectedChat || !user) return;

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages_revend')
        .select('*')
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${selectedChat}),and(sender_id.eq.${selectedChat},receiver_id.eq.${user.id})`)
        .order('created_at');

      if (error) {
        console.error('Error fetching messages:', error);
        return;
      }

      // Format messages for display
      const formattedMessages = data.map(msg => ({
        id: msg.id,
        sender: msg.sender_id === user.id ? 'You' : conversations.find(c => c.id === selectedChat)?.name || 'User',
        message: msg.content,
        time: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isUser: msg.sender_id === user.id
      }));

      setMessages(formattedMessages);

      // Mark messages as read
      if (data.some(msg => !msg.is_read && msg.receiver_id === user.id)) {
        await supabase
          .from('messages_revend')
          .update({ is_read: true })
          .eq('receiver_id', user.id)
          .eq('sender_id', selectedChat);
      }
    };

    fetchMessages();

    // Subscribe to new messages
    const messagesSubscription = supabase
      .channel('messages_changes')
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages_revend', filter: `receiver_id=eq.${user.id}` },
        (payload) => {
          // Refresh messages if the current conversation is selected
          if (selectedChat === payload.new.sender_id) {
            fetchMessages();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(messagesSubscription);
    };
  }, [selectedChat, user, conversations]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !user || !selectedChat) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('messages_revend')
        .insert({
          sender_id: user.id,
          receiver_id: selectedChat,
          content: newMessage.trim()
        });
      
      if (error) {
        console.error('Error sending message:', error);
        return;
      }
      
      setNewMessage('');
      
      // Refresh messages
      const { data, error: fetchError } = await supabase
        .from('messages_revend')
        .select('*')
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${selectedChat}),and(sender_id.eq.${selectedChat},receiver_id.eq.${user.id})`)
        .order('created_at');
      
      if (fetchError) {
        console.error('Error fetching messages:', fetchError);
        return;
      }
      
      // Format messages for display
      const formattedMessages = data.map(msg => ({
        id: msg.id,
        sender: msg.sender_id === user.id ? 'You' : conversations.find(c => c.id === selectedChat)?.name || 'User',
        message: msg.content,
        time: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isUser: msg.sender_id === user.id
      }));
      
      setMessages(formattedMessages);
    } catch (err) {
      console.error('Error in handleSendMessage:', err);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Login</h2>
          <p className="text-gray-600">You need to be logged in to view messages.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden" style={{ height: '600px' }}>
          <div className="flex h-full">
            {/* Conversations List */}
            <div className="w-1/3 border-r border-gray-200 flex flex-col">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Messages</h2>
                <div className="relative">
                  <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto">
                {isLoading ? (
                  <div className="flex justify-center items-center h-32">
                    <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : conversations.length > 0 ? (
                  conversations.map(conversation => (
                    <motion.div
                      key={conversation.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      onClick={() => setSelectedChat(conversation.id)}
                      className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                        selectedChat === conversation.id ? 'bg-blue-50 border-blue-200' : ''
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <img
                          src={conversation.avatar}
                          alt={conversation.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium text-gray-900 truncate">
                              {conversation.name}
                            </h3>
                            <span className="text-xs text-gray-500">{conversation.time}</span>
                          </div>
                          <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                        </div>
                        {conversation.unread > 0 && (
                          <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-blue-600 rounded-full">
                            {conversation.unread}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <SafeIcon icon={FiMessageCircle} className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">No conversations yet</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
              {selectedChat ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={conversations.find(c => c.id === selectedChat)?.avatar}
                        alt=""
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {conversations.find(c => c.id === selectedChat)?.name}
                        </h3>
                        <p className="text-sm text-green-600">Online</p>
                      </div>
                    </div>
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <SafeIcon icon={FiMoreVertical} className="w-5 h-5" />
                    </button>
                  </div>
                  
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.length > 0 ? (
                      messages.map(message => (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              message.isUser
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 text-gray-900'
                            }`}
                          >
                            <p className="text-sm">{message.message}</p>
                            <p
                              className={`text-xs mt-1 ${
                                message.isUser ? 'text-blue-100' : 'text-gray-500'
                              }`}
                            >
                              {message.time}
                            </p>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <SafeIcon icon={FiMessageCircle} className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-500">No messages yet</p>
                          <p className="text-sm text-gray-400 mt-1">Start the conversation</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Message Input */}
                  <div className="p-4 border-t border-gray-200">
                    <form onSubmit={handleSendMessage} className="flex space-x-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <SafeIcon icon={FiSend} className="w-5 h-5" />
                      </button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <SafeIcon icon={FiMessageCircle} className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Select a conversation
                    </h3>
                    <p className="text-gray-600">
                      Choose a conversation from the list to start messaging
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;