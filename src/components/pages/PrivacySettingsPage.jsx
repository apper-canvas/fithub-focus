import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import ApperIcon from '@/components/ApperIcon';
import privacyService from '@/services/api/privacyService';

export default function PrivacySettingsPage() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadPrivacySettings();
  }, []);

  const loadPrivacySettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await privacyService.getSettings();
      setSettings(data);
    } catch (err) {
      setError('Failed to load privacy settings');
      console.error('Error loading privacy settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (category, setting) => {
    try {
      setSaving(true);
      const updatedSettings = {
        ...settings,
        [category]: {
          ...settings[category],
          [setting]: !settings[category][setting]
        }
      };
      
      await privacyService.updateSettings(updatedSettings);
      setSettings(updatedSettings);
      toast.success('Privacy preference updated');
    } catch (err) {
      toast.error('Failed to update privacy preference');
      console.error('Error updating privacy settings:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleExportData = async () => {
    try {
      setSaving(true);
      const dataExport = await privacyService.exportUserData();
      
      // Create and download the file
      const blob = new Blob([JSON.stringify(dataExport, null, 2)], {
        type: 'application/json'
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `fithub-data-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success('Your data has been exported successfully');
    } catch (err) {
      toast.error('Failed to export data');
      console.error('Error exporting data:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.'
    );
    
    if (confirmed) {
      try {
        setSaving(true);
        await privacyService.deleteUserAccount();
        toast.success('Account deletion request submitted');
        // In a real app, this would redirect to a confirmation page or logout
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      } catch (err) {
        toast.error('Failed to process account deletion');
        console.error('Error deleting account:', err);
      } finally {
        setSaving(false);
      }
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadPrivacySettings} />;

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Button
              variant="ghost"
              icon="ArrowLeft"
              onClick={() => window.history.back()}
              className="p-2"
            />
            <h1 className="text-3xl font-display font-bold text-gray-900">
              Privacy Settings
            </h1>
          </div>
          <p className="text-gray-600">
            Control how your data is used and shared within FitHub Pro
          </p>
        </div>

        <div className="space-y-6">
          {/* Profile Visibility */}
          <Card>
            <div className="flex items-center gap-3 mb-6">
              <ApperIcon name="Eye" className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-display font-bold text-gray-900">
                Profile Visibility
              </h2>
            </div>

            <div className="space-y-4">
              {Object.entries(settings.profileVisibility).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div>
                    <h3 className="font-medium text-gray-900 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {getPrivacyDescription('profileVisibility', key)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleToggle('profileVisibility', key)}
                    disabled={saving}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                      value ? 'bg-primary' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        value ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </Card>

          {/* Data Sharing */}
          <Card>
            <div className="flex items-center gap-3 mb-6">
              <ApperIcon name="Share2" className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-display font-bold text-gray-900">
                Data Sharing
              </h2>
            </div>

            <div className="space-y-4">
              {Object.entries(settings.dataSharing).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div>
                    <h3 className="font-medium text-gray-900 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {getPrivacyDescription('dataSharing', key)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleToggle('dataSharing', key)}
                    disabled={saving}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                      value ? 'bg-primary' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        value ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </Card>

          {/* Communication Preferences */}
          <Card>
            <div className="flex items-center gap-3 mb-6">
              <ApperIcon name="MessageCircle" className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-display font-bold text-gray-900">
                Communication Preferences
              </h2>
            </div>

            <div className="space-y-4">
              {Object.entries(settings.communication).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div>
                    <h3 className="font-medium text-gray-900 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {getPrivacyDescription('communication', key)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleToggle('communication', key)}
                    disabled={saving}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                      value ? 'bg-primary' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        value ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </Card>

          {/* Data Management */}
          <Card>
            <div className="flex items-center gap-3 mb-6">
              <ApperIcon name="Database" className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-display font-bold text-gray-900">
                Data Management
              </h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-4 border-b border-gray-100">
                <div>
                  <h3 className="font-medium text-gray-900">Export My Data</h3>
                  <p className="text-sm text-gray-500">
                    Download a copy of all your data stored in FitHub Pro
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={handleExportData}
                  disabled={saving}
                  icon="Download"
                >
                  Export Data
                </Button>
              </div>

              <div className="flex items-center justify-between py-4">
                <div>
                  <h3 className="font-medium text-error">Delete My Account</h3>
                  <p className="text-sm text-gray-500">
                    Permanently delete your account and all associated data
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={handleDeleteAccount}
                  disabled={saving}
                  className="text-error border-error hover:bg-error hover:text-white"
                  icon="Trash2"
                >
                  Delete Account
                </Button>
              </div>
            </div>
          </Card>

          {/* Account Security */}
          <Card>
            <div className="flex items-center gap-3 mb-6">
              <ApperIcon name="Lock" className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-display font-bold text-gray-900">
                Account Security
              </h2>
            </div>

            <div className="space-y-4">
              {Object.entries(settings.security).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div>
                    <h3 className="font-medium text-gray-900 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {getPrivacyDescription('security', key)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleToggle('security', key)}
                    disabled={saving}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                      value ? 'bg-primary' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        value ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function getPrivacyDescription(category, key) {
  const descriptions = {
    profileVisibility: {
      publicProfile: 'Allow other users to find and view your profile',
      showWorkoutStats: 'Display your workout statistics on your profile',
      showAchievements: 'Show your fitness achievements and milestones',
      allowFriendRequests: 'Let other users send you friend requests'
    },
    dataSharing: {
      anonymousAnalytics: 'Share anonymous usage data to improve the app',
      fitnessDataWithTrainers: 'Allow your trainers to view your fitness data',
      progressWithFriends: 'Share your workout progress with friends',
      leaderboardParticipation: 'Include your data in community leaderboards'
    },
    communication: {
      allowDirectMessages: 'Let other users send you private messages',
      showOnlineStatus: 'Display when you\'re online in the app',
      workoutReminders: 'Receive reminders about your scheduled workouts',
      socialUpdates: 'Get notified about friend activities and achievements'
    },
    security: {
      twoFactorAuth: 'Require two-factor authentication for login',
      loginNotifications: 'Get notified when someone logs into your account',
      deviceTracking: 'Track and manage devices that access your account',
      suspiciousActivityAlerts: 'Alert me about unusual account activity'
    }
  };

  return descriptions[category]?.[key] || 'Privacy preference';
}