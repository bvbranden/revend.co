import supabase from '../lib/supabase';

const EMAIL_TYPES = {
  VERIFICATION: 'verification',
  WELCOME: 'welcome',
  PASSWORD_RESET: 'password_reset',
  ORDER_CONFIRMATION: 'order_confirmation',
  LISTING_INTEREST: 'listing_interest',
  MESSAGE_RECEIVED: 'message_received'
};

class EmailService {
  async sendEmail(userId, type, data = {}) {
    try {
      // Get user's email preferences
      const { data: userPrefs, error: prefsError } = await supabase
        .from('user_preferences')
        .select('email_notifications')
        .eq('user_id', userId)
        .single();

      if (prefsError) throw prefsError;

      // Check if user has enabled this type of notification
      if (!userPrefs?.email_notifications?.[type]) {
        return { success: false, message: 'User has disabled this notification type' };
      }

      // Send email via Supabase Edge Function
      const { data: result, error } = await supabase.functions.invoke('send-email', {
        body: {
          type,
          userId,
          ...data
        }
      });

      if (error) throw error;

      // Log email sent
      await this.logEmailSent(userId, type, data);

      return { success: true, data: result };
    } catch (error) {
      console.error('Error sending email:', error);
      return { success: false, error: error.message };
    }
  }

  async logEmailSent(userId, type, data) {
    try {
      await supabase
        .from('email_logs')
        .insert({
          user_id: userId,
          type,
          metadata: data,
          sent_at: new Date().toISOString()
        });
    } catch (error) {
      console.error('Error logging email:', error);
    }
  }

  // Specific email sending methods
  async sendWelcomeEmail(userId, userName) {
    return this.sendEmail(userId, EMAIL_TYPES.WELCOME, {
      userName,
      template: 'welcome'
    });
  }

  async sendVerificationEmail(userId, email) {
    return this.sendEmail(userId, EMAIL_TYPES.VERIFICATION, {
      email,
      template: 'verification'
    });
  }

  async sendPasswordResetEmail(userId, email) {
    return this.sendEmail(userId, EMAIL_TYPES.PASSWORD_RESET, {
      email,
      template: 'password-reset'
    });
  }

  async sendListingInterestEmail(userId, listingId, message) {
    return this.sendEmail(userId, EMAIL_TYPES.LISTING_INTEREST, {
      listingId,
      message,
      template: 'listing-interest'
    });
  }

  async sendMessageNotification(userId, senderId, messagePreview) {
    return this.sendEmail(userId, EMAIL_TYPES.MESSAGE_RECEIVED, {
      senderId,
      messagePreview,
      template: 'new-message'
    });
  }
}

export const emailService = new EmailService();
export { EMAIL_TYPES };