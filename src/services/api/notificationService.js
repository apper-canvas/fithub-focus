// Notification Settings Service
class NotificationService {
  constructor() {
    this.storageKey = 'fithub_notification_settings';
    this.defaultSettings = {
      workout: {
        reminders: true,
        achievements: true,
        weeklyProgress: true,
        restDayReminders: false
      },
      membership: {
        expiryWarnings: true,
        paymentReminders: true,
        renewalOffers: false,
        upgradePrompts: false
      },
      social: {
        friendRequests: true,
        workoutInvites: true,
        challengeUpdates: true,
        leaderboardChanges: false
      },
      marketing: {
        promotions: false,
        newFeatures: true,
        tips: true,
        surveys: false
      }
    };
  }

  async getSettings() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const settings = JSON.parse(stored);
        // Merge with defaults to ensure all new settings are included
        return this.mergeWithDefaults(settings);
      }
      
      // Return default settings if none stored
      const defaultSettings = { ...this.defaultSettings };
      await this.saveSettings(defaultSettings);
      return defaultSettings;
    } catch (error) {
      console.error('Error loading notification settings:', error);
      return { ...this.defaultSettings };
    }
  }

  async updateSettings(settings) {
    try {
      await this.saveSettings(settings);
      return settings;
    } catch (error) {
      console.error('Error updating notification settings:', error);
      throw new Error('Failed to update notification settings');
    }
  }

  async saveSettings(settings) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(settings));
      
      // In a real app, you would also sync with backend
      // await this.syncWithBackend(settings);
      
      return settings;
    } catch (error) {
      console.error('Error saving notification settings:', error);
      throw new Error('Failed to save notification settings');
    }
  }

  async resetToDefaults() {
    try {
      const defaultSettings = { ...this.defaultSettings };
      await this.saveSettings(defaultSettings);
      return defaultSettings;
    } catch (error) {
      console.error('Error resetting notification settings:', error);
      throw new Error('Failed to reset notification settings');
    }
  }

  mergeWithDefaults(userSettings) {
    const merged = { ...this.defaultSettings };
    
    Object.keys(userSettings).forEach(category => {
      if (merged[category]) {
        merged[category] = { ...merged[category], ...userSettings[category] };
      }
    });
    
    return merged;
  }

  async getNotificationPermissions() {
    if ('Notification' in window) {
      return Notification.permission;
    }
    return 'denied';
  }

  async requestNotificationPermissions() {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission;
    }
    return 'denied';
  }

  async sendTestNotification() {
    const permission = await this.getNotificationPermissions();
    
    if (permission === 'granted') {
      new Notification('FitHub Pro Test', {
        body: 'Your notifications are working correctly!',
        icon: '/favicon.ico'
      });
      return true;
    } else if (permission === 'default') {
      const newPermission = await this.requestNotificationPermissions();
      if (newPermission === 'granted') {
        return await this.sendTestNotification();
      }
    }
    
    return false;
  }

  // Method to check if a specific notification should be sent
  async shouldNotify(category, type) {
    const settings = await this.getSettings();
    return settings[category]?.[type] ?? false;
  }
}

const notificationService = new NotificationService();
export default notificationService;