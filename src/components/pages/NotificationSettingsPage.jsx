import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import ApperIcon from '@/components/ApperIcon';
import notificationService from '@/services/api/notificationService';

export default function NotificationSettingsPage() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadNotificationSettings();
  }, []);

  const loadNotificationSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await notificationService.getSettings();
      setSettings(data);
    } catch (err) {
      setError('Failed to load notification settings');
      console.error('Error loading notification settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (category, type) => {
    try {
      setSaving(true);
      const updatedSettings = {
        ...settings,
        [category]: {
          ...settings[category],
          [type]: !settings[category][type]
        }
      };
      
      await notificationService.updateSettings(updatedSettings);
      setSettings(updatedSettings);
      toast.success('Notification preference updated');
    } catch (err) {
      toast.error('Failed to update notification preference');
      console.error('Error updating notification settings:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleResetToDefaults = async () => {
    try {
      setSaving(true);
      const defaultSettings = await notificationService.resetToDefaults();
      setSettings(defaultSettings);
      toast.success('Notification preferences reset to defaults');
    } catch (err) {
      toast.error('Failed to reset notification preferences');
      console.error('Error resetting notification settings:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadNotificationSettings} />;

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
              Notification Settings
            </h1>
          </div>
          <p className="text-gray-600">
            Manage how and when you receive notifications from FitHub Pro
          </p>
        </div>

        <div className="space-y-6">
          {/* Workout Notifications */}
          <Card>
            <div className="flex items-center gap-3 mb-6">
              <ApperIcon name="Dumbbell" className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-display font-bold text-gray-900">
                Workout Notifications
              </h2>
            </div>

            <div className="space-y-4">
              {Object.entries(settings.workout).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div>
                    <h3 className="font-medium text-gray-900 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {getNotificationDescription('workout', key)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleToggle('workout', key)}
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

          {/* Membership Notifications */}
          <Card>
            <div className="flex items-center gap-3 mb-6">
              <ApperIcon name="CreditCard" className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-display font-bold text-gray-900">
                Membership Notifications
              </h2>
            </div>

            <div className="space-y-4">
              {Object.entries(settings.membership).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div>
                    <h3 className="font-medium text-gray-900 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {getNotificationDescription('membership', key)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleToggle('membership', key)}
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

          {/* Social Notifications */}
          <Card>
            <div className="flex items-center gap-3 mb-6">
              <ApperIcon name="Users" className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-display font-bold text-gray-900">
                Social Notifications
              </h2>
            </div>

            <div className="space-y-4">
              {Object.entries(settings.social).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div>
                    <h3 className="font-medium text-gray-900 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {getNotificationDescription('social', key)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleToggle('social', key)}
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

          {/* Marketing Notifications */}
          <Card>
            <div className="flex items-center gap-3 mb-6">
              <ApperIcon name="Megaphone" className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-display font-bold text-gray-900">
                Marketing Notifications
              </h2>
            </div>

            <div className="space-y-4">
              {Object.entries(settings.marketing).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div>
                    <h3 className="font-medium text-gray-900 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {getNotificationDescription('marketing', key)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleToggle('marketing', key)}
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

          {/* Reset to Defaults */}
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Reset to Defaults</h3>
                <p className="text-sm text-gray-500">
                  Restore all notification preferences to their default settings
                </p>
              </div>
              <Button
                variant="outline"
                onClick={handleResetToDefaults}
                disabled={saving}
                icon="RotateCcw"
              >
                Reset All
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function getNotificationDescription(category, key) {
  const descriptions = {
    workout: {
      reminders: 'Get reminded about your scheduled workouts',
      achievements: 'Celebrate your fitness milestones and PRs',
      weeklyProgress: 'Weekly summary of your workout progress',
      restDayReminders: 'Reminders to take your scheduled rest days'
    },
    membership: {
      expiryWarnings: 'Alerts when your membership is about to expire',
      paymentReminders: 'Reminders about upcoming payment dates',
      renewalOffers: 'Special offers for membership renewal',
      upgradePrompts: 'Notifications about membership upgrade benefits'
    },
    social: {
      friendRequests: 'When someone wants to connect with you',
      workoutInvites: 'Invitations to join group workouts',
      challengeUpdates: 'Updates on fitness challenges you\'re part of',
      leaderboardChanges: 'When your ranking changes on leaderboards'
    },
    marketing: {
      promotions: 'Special deals and promotional offers',
      newFeatures: 'Updates about new app features',
      tips: 'Fitness tips and workout suggestions',
      surveys: 'Feedback requests to improve our service'
    }
  };

  return descriptions[category]?.[key] || 'Notification preference';
}