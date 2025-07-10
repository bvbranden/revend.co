import React, { createContext, useContext, useState, useEffect } from 'react';
import { emailService, EMAIL_TYPES } from '../services/EmailService';
import { useAuth } from './AuthContext';
import supabase from '../lib/supabase';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadPreferences();
      subscribeToNotifications();
    }
  }, [user]);

  const loadPreferences = async () => {
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      setPreferences(data || {});
    } catch (error) {
      console.error('Error loading notification preferences:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updatePreferences = async (newPreferences) => {
    try {
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          ...newPreferences
        });

      if (error) throw error;
      setPreferences(newPreferences);
      return { success: true };
    } catch (error) {
      console.error('Error updating preferences:', error);
      return { success: false, error: error.message };
    }
  };

  const subscribeToNotifications = () => {
    const subscription = supabase
      .channel('notifications')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${user.id}`
      }, handleNewNotification)
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  };

  const handleNewNotification = async (payload) => {
    const notification = payload.new;

    // Check if email notification should be sent
    if (preferences.email_notifications?.[notification.type]) {
      switch (notification.type) {
        case EMAIL_TYPES.MESSAGE_RECEIVED:
          await emailService.sendMessageNotification(
            user.id,
            notification.sender_id,
            notification.content
          );
          break;
        case EMAIL_TYPES.LISTING_INTEREST:
          await emailService.sendListingInterestEmail(
            user.id,
            notification.listing_id,
            notification.content
          );
          break;
        // Add other notification types as needed
      }
    }
  };

  const value = {
    preferences,
    updatePreferences,
    isLoading
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};