// Privacy Settings Service
class PrivacyService {
  constructor() {
    this.storageKey = 'fithub_privacy_settings';
    this.defaultSettings = {
      profileVisibility: {
        publicProfile: true,
        showWorkoutStats: true,
        showAchievements: true,
        allowFriendRequests: true
      },
      dataSharing: {
        anonymousAnalytics: true,
        fitnessDataWithTrainers: true,
        progressWithFriends: true,
        leaderboardParticipation: true
      },
      communication: {
        allowDirectMessages: true,
        showOnlineStatus: true,
        workoutReminders: true,
        socialUpdates: true
      },
      security: {
        twoFactorAuth: false,
        loginNotifications: true,
        deviceTracking: true,
        suspiciousActivityAlerts: true
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
      console.error('Error loading privacy settings:', error);
      return { ...this.defaultSettings };
    }
  }

  async updateSettings(settings) {
    try {
      await this.saveSettings(settings);
      return settings;
    } catch (error) {
      console.error('Error updating privacy settings:', error);
      throw new Error('Failed to update privacy settings');
    }
  }

  async saveSettings(settings) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(settings));
      
      // In a real app, you would also sync with backend
      // await this.syncWithBackend(settings);
      
      return settings;
    } catch (error) {
      console.error('Error saving privacy settings:', error);
      throw new Error('Failed to save privacy settings');
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

  async exportUserData() {
    try {
      // In a real app, this would fetch data from multiple services
      const userData = {
        profile: this.getMockProfileData(),
        workouts: this.getMockWorkoutData(),
        achievements: this.getMockAchievementData(),
        settings: {
          privacy: await this.getSettings(),
          notifications: JSON.parse(localStorage.getItem('fithub_notification_settings') || '{}')
        },
        exportDate: new Date().toISOString(),
        exportVersion: '1.0'
      };

      return userData;
    } catch (error) {
      console.error('Error exporting user data:', error);
      throw new Error('Failed to export user data');
    }
  }

  getMockProfileData() {
    return {
      Id: 1,
      name: 'John Smith',
      email: 'john.smith@example.com',
      joinDate: '2023-01-15',
      membershipType: 'Premium',
      profilePicture: null
    };
  }

  getMockWorkoutData() {
    return [
      {
        Id: 1,
        date: '2024-01-15',
        type: 'Strength Training',
        duration: 60,
        exercises: ['Bench Press', 'Squats', 'Deadlifts']
      },
      {
        Id: 2,
        date: '2024-01-17',
        type: 'Cardio',
        duration: 30,
        exercises: ['Treadmill', 'Cycling']
      }
    ];
  }

  getMockAchievementData() {
    return [
      {
        Id: 1,
        name: 'First Workout',
        description: 'Complete your first workout',
        earnedDate: '2023-01-16'
      },
      {
        Id: 2,
        name: '30-Day Streak',
        description: 'Work out for 30 consecutive days',
        earnedDate: '2023-02-15'
      }
    ];
  }

  async deleteUserAccount() {
    try {
      // In a real app, this would make an API call to delete the account
      // For demo purposes, we'll clear local storage and show success
      
      // Clear all stored data
      const keysToRemove = [
        'fithub_privacy_settings',
        'fithub_notification_settings',
        'fithub_user_profile',
        'fithub_workout_data',
        'fithub_achievements'
      ];
      
      keysToRemove.forEach(key => {
        localStorage.removeItem(key);
      });

      // In a real implementation, you would:
      // 1. Send account deletion request to backend
      // 2. Handle authentication logout
      // 3. Redirect to goodbye page
      
      return { success: true, message: 'Account deletion request submitted' };
    } catch (error) {
      console.error('Error deleting user account:', error);
      throw new Error('Failed to delete user account');
    }
  }

  async getDataUsageSummary() {
    try {
      // Mock data usage summary
      return {
        profileData: { size: '2.3 KB', lastUpdated: '2024-01-15' },
        workoutData: { size: '156.7 KB', lastUpdated: '2024-01-20' },
        mediaFiles: { size: '45.2 MB', lastUpdated: '2024-01-18' },
        totalSize: '45.4 MB'
      };
    } catch (error) {
      console.error('Error getting data usage summary:', error);
      throw new Error('Failed to get data usage summary');
    }
  }

  // Method to check if a specific privacy setting is enabled
  async isPrivacySettingEnabled(category, setting) {
    const settings = await this.getSettings();
    return settings[category]?.[setting] ?? false;
  }
}

const privacyService = new PrivacyService();
export default privacyService;