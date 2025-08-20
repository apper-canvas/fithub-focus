import { useState } from 'react';
import { toast } from 'react-toastify';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import ApperIcon from '@/components/ApperIcon';

export default function HelpSupportPage() {
  const [activeTab, setActiveTab] = useState('faq');
  const [ticketForm, setTicketForm] = useState({
    subject: '',
    category: 'general',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const faqData = [
    {
      category: 'Getting Started',
      questions: [
        {
          q: 'How do I create my first workout plan?',
          a: 'Navigate to the Workouts page and click "Create New Workout". You can choose from our pre-built templates or create a custom workout by adding exercises, sets, and reps.'
        },
        {
          q: 'How do I book a session with a trainer?',
          a: 'Go to the Trainer Booking page, browse available trainers, and click "Book Session" on your preferred trainer. Select your preferred date and time from their available slots.'
        },
        {
          q: 'Can I track my progress over time?',
          a: 'Yes! Your profile page shows detailed progress charts, workout statistics, and achievement tracking. All your workout data is automatically saved and analyzed.'
        }
      ]
    },
    {
      category: 'Membership & Billing',
      questions: [
        {
          q: 'How do I upgrade my membership?',
          a: 'Visit your Profile page and click on your membership card. You can compare plans and upgrade instantly. Premium members get access to advanced features and unlimited trainer sessions.'
        },
        {
          q: 'When will I be charged for my membership?',
          a: 'Memberships are billed monthly on the date you first subscribed. You\'ll receive email reminders 3 days before each billing cycle.'
        },
        {
          q: 'Can I cancel my membership anytime?',
          a: 'Yes, you can cancel your membership at any time from your Privacy Settings. Your access will continue until the end of your current billing period.'
        }
      ]
    },
    {
      category: 'Technical Issues',
      questions: [
        {
          q: 'The app is running slowly, what can I do?',
          a: 'Try refreshing the page or clearing your browser cache. Make sure you\'re using an up-to-date browser. If issues persist, contact our support team.'
        },
        {
          q: 'I\'m not receiving notifications',
          a: 'Check your Notification Settings to ensure the relevant notifications are enabled. Also verify that your browser allows notifications from FitHub Pro.'
        },
        {
          q: 'My workout data isn\'t syncing',
          a: 'Ensure you have a stable internet connection. Your data is automatically saved, but you can try refreshing the page to force a sync.'
        }
      ]
    }
  ];

  const handleTicketSubmit = async (e) => {
    e.preventDefault();
    if (!ticketForm.subject.trim() || !ticketForm.message.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Support ticket submitted successfully! We\'ll get back to you within 24 hours.');
      setTicketForm({ subject: '', category: 'general', message: '' });
    } catch (error) {
      toast.error('Failed to submit support ticket. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleContactMethod = (method) => {
    switch (method) {
      case 'email':
        window.open('mailto:support@fithubpro.com?subject=FitHub Pro Support Request', '_blank');
        break;
      case 'phone':
        window.open('tel:+1-800-FITHUB', '_blank');
        break;
      case 'chat':
        toast.info('Live chat will be available soon! For now, please use email or submit a ticket.');
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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
              Help & Support
            </h1>
          </div>
          <p className="text-gray-600">
            Get help with FitHub Pro features, account issues, and technical support
          </p>
        </div>

        {/* Quick Contact Methods */}
        <Card className="mb-8">
          <h2 className="text-xl font-display font-bold text-gray-900 mb-6">
            Quick Contact
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="p-6 h-auto flex-col gap-3"
              onClick={() => handleContactMethod('email')}
            >
              <ApperIcon name="Mail" className="h-8 w-8 text-primary" />
              <div className="text-center">
                <div className="font-semibold">Email Support</div>
                <div className="text-sm text-gray-500">Response in 24 hours</div>
              </div>
            </Button>
            <Button
              variant="outline"
              className="p-6 h-auto flex-col gap-3"
              onClick={() => handleContactMethod('chat')}
            >
              <ApperIcon name="MessageCircle" className="h-8 w-8 text-primary" />
              <div className="text-center">
                <div className="font-semibold">Live Chat</div>
                <div className="text-sm text-gray-500">Available 9am-6pm EST</div>
              </div>
            </Button>
            <Button
              variant="outline"
              className="p-6 h-auto flex-col gap-3"
              onClick={() => handleContactMethod('phone')}
            >
              <ApperIcon name="Phone" className="h-8 w-8 text-primary" />
              <div className="text-center">
                <div className="font-semibold">Phone Support</div>
                <div className="text-sm text-gray-500">1-800-FITHUB</div>
              </div>
            </Button>
          </div>
        </Card>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-white rounded-lg p-1 shadow-sm">
            <button
              onClick={() => setActiveTab('faq')}
              className={`px-6 py-3 rounded-md font-medium transition-colors ${
                activeTab === 'faq'
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              FAQ
            </button>
            <button
              onClick={() => setActiveTab('ticket')}
              className={`px-6 py-3 rounded-md font-medium transition-colors ${
                activeTab === 'ticket'
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Submit Ticket
            </button>
            <button
              onClick={() => setActiveTab('resources')}
              className={`px-6 py-3 rounded-md font-medium transition-colors ${
                activeTab === 'resources'
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Resources
            </button>
          </div>
        </div>

        {/* FAQ Tab */}
        {activeTab === 'faq' && (
          <div className="space-y-6">
            {faqData.map((category, categoryIndex) => (
              <Card key={categoryIndex}>
                <h3 className="text-lg font-display font-bold text-gray-900 mb-4">
                  {category.category}
                </h3>
                <div className="space-y-4">
                  {category.questions.map((item, index) => (
                    <details key={index} className="group">
                      <summary className="flex items-center justify-between cursor-pointer py-2 font-medium text-gray-900 hover:text-primary">
                        {item.q}
                        <ApperIcon 
                          name="ChevronDown" 
                          className="h-5 w-5 transition-transform group-open:rotate-180" 
                        />
                      </summary>
                      <div className="mt-2 pb-2 text-gray-600 leading-relaxed">
                        {item.a}
                      </div>
                    </details>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Support Ticket Tab */}
        {activeTab === 'ticket' && (
          <Card>
            <h3 className="text-lg font-display font-bold text-gray-900 mb-6">
              Submit a Support Ticket
            </h3>
            <form onSubmit={handleTicketSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <Input
                    value={ticketForm.subject}
                    onChange={(e) => setTicketForm(prev => ({...prev, subject: e.target.value}))}
                    placeholder="Brief description of your issue"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={ticketForm.category}
                    onChange={(e) => setTicketForm(prev => ({...prev, category: e.target.value}))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="general">General Question</option>
                    <option value="technical">Technical Issue</option>
                    <option value="billing">Billing & Membership</option>
                    <option value="feature">Feature Request</option>
                    <option value="bug">Bug Report</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  value={ticketForm.message}
                  onChange={(e) => setTicketForm(prev => ({...prev, message: e.target.value}))}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Please describe your issue in detail..."
                  required
                />
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={submitting}
                  icon={submitting ? "Loader2" : "Send"}
                  className={submitting ? "animate-spin" : ""}
                >
                  {submitting ? 'Submitting...' : 'Submit Ticket'}
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Resources Tab */}
        {activeTab === 'resources' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <div className="flex items-center gap-3 mb-4">
                <ApperIcon name="BookOpen" className="h-6 w-6 text-primary" />
                <h3 className="text-lg font-display font-bold text-gray-900">
                  User Guide
                </h3>
              </div>
              <p className="text-gray-600 mb-4">
                Comprehensive guide covering all FitHub Pro features and functionalities.
              </p>
              <Button variant="outline" className="w-full">
                View User Guide
              </Button>
            </Card>

            <Card>
              <div className="flex items-center gap-3 mb-4">
                <ApperIcon name="Video" className="h-6 w-6 text-primary" />
                <h3 className="text-lg font-display font-bold text-gray-900">
                  Video Tutorials
                </h3>
              </div>
              <p className="text-gray-600 mb-4">
                Step-by-step video tutorials for getting the most out of your workouts.
              </p>
              <Button variant="outline" className="w-full">
                Watch Tutorials
              </Button>
            </Card>

            <Card>
              <div className="flex items-center gap-3 mb-4">
                <ApperIcon name="Users" className="h-6 w-6 text-primary" />
                <h3 className="text-lg font-display font-bold text-gray-900">
                  Community Forum
                </h3>
              </div>
              <p className="text-gray-600 mb-4">
                Connect with other FitHub Pro users and share fitness tips and experiences.
              </p>
              <Button variant="outline" className="w-full">
                Join Community
              </Button>
            </Card>

            <Card>
              <div className="flex items-center gap-3 mb-4">
                <ApperIcon name="Download" className="h-6 w-6 text-primary" />
                <h3 className="text-lg font-display font-bold text-gray-900">
                  Mobile App
                </h3>
              </div>
              <p className="text-gray-600 mb-4">
                Download our mobile app for iOS and Android for fitness tracking on the go.
              </p>
              <Button variant="outline" className="w-full">
                Download App
              </Button>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}