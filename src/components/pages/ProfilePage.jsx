import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Badge from "@/components/atoms/Badge";
import Progress from "@/components/atoms/Progress";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import memberService from "@/services/api/memberService";

const ProfilePage = () => {
  const [member, setMember] = useState(null);
  const [memberStats, setMemberStats] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [memberData, statsData] = await Promise.all([
        memberService.getCurrentMember(),
        memberService.getMemberStats(1)
      ]);
      
      setMember(memberData);
      setMemberStats(statsData);
      setFormData(memberData);
    } catch (err) {
      setError("Failed to load profile data. Please try again.");
      console.error("Profile load error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      
      const updatedMember = await memberService.updateMember(member.Id, formData);
      setMember(updatedMember);
      setEditMode(false);
      
      toast.success("Profile updated successfully! ✨");
    } catch (error) {
      toast.error("Failed to update profile. Please try again.");
      console.error("Profile update error:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setFormData(member);
    setEditMode(false);
  };

  const getMembershipColor = () => {
    switch (member?.membershipType?.toLowerCase()) {
      case "premium": return "primary";
      case "standard": return "warning";
      case "basic": return "gray";
      default: return "gray";
    }
  };

  const getGoalProgress = () => {
    if (!member?.currentWeight || !member?.goalWeight) return 0;
    
    const startWeight = member.goalWeight + 10; // Assuming started 10 lbs above goal
    const progress = ((startWeight - member.currentWeight) / (startWeight - member.goalWeight)) * 100;
    
    return Math.min(Math.max(progress, 0), 100);
  };

  const getDaysUntilExpiry = () => {
    if (!member?.expiryDate) return 0;
    
    const today = new Date();
    const expiry = new Date(member.expiryDate);
    const diffTime = expiry - today;
    
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  if (loading) return <Loading message="Loading your profile..." />;
  if (error) return <Error message="Profile Error" description={error} onRetry={loadProfileData} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
            My Profile
          </h1>
          <p className="text-gray-600">
            Manage your account settings and track your fitness journey
          </p>
        </div>
        {!editMode && (
          <Button
            variant="primary"
            icon="Edit"
            onClick={() => setEditMode(true)}
          >
            Edit Profile
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-display font-bold text-gray-900 flex items-center gap-2">
                <ApperIcon name="User" className="h-6 w-6 text-primary" />
                Personal Information
              </h2>
              {editMode && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancelEdit}
                    icon="X"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleSaveProfile}
                    loading={saving}
                    icon="Check"
                  >
                    Save
                  </Button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                {editMode ? (
                  <Input
                    value={formData.name || ""}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter your full name"
                  />
                ) : (
                  <p className="text-gray-900 font-medium">{member?.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                {editMode ? (
                  <Input
                    type="email"
                    value={formData.email || ""}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="Enter your email"
                  />
                ) : (
                  <p className="text-gray-900 font-medium">{member?.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                {editMode ? (
                  <Input
                    value={formData.phone || ""}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="Enter your phone number"
                  />
                ) : (
                  <p className="text-gray-900 font-medium">{member?.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Emergency Contact
                </label>
                {editMode ? (
                  <Input
                    value={formData.emergencyContact || ""}
                    onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
                    placeholder="Emergency contact info"
                  />
                ) : (
                  <p className="text-gray-900 font-medium">{member?.emergencyContact}</p>
                )}
              </div>
            </div>
          </Card>

          {/* Fitness Information */}
          <Card>
            <h2 className="text-xl font-display font-bold text-gray-900 mb-6 flex items-center gap-2">
              <ApperIcon name="Activity" className="h-6 w-6 text-primary" />
              Fitness Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Weight (lbs)
                </label>
                {editMode ? (
                  <Input
                    type="number"
                    value={formData.currentWeight || ""}
                    onChange={(e) => handleInputChange("currentWeight", parseFloat(e.target.value))}
                    placeholder="Enter current weight"
                  />
                ) : (
                  <p className="text-gray-900 font-medium">{member?.currentWeight} lbs</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Goal Weight (lbs)
                </label>
                {editMode ? (
                  <Input
                    type="number"
                    value={formData.goalWeight || ""}
                    onChange={(e) => handleInputChange("goalWeight", parseFloat(e.target.value))}
                    placeholder="Enter goal weight"
                  />
                ) : (
                  <p className="text-gray-900 font-medium">{member?.goalWeight} lbs</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Height (cm)
                </label>
                {editMode ? (
                  <Input
                    type="number"
                    value={formData.height || ""}
                    onChange={(e) => handleInputChange("height", parseFloat(e.target.value))}
                    placeholder="Enter height in cm"
                  />
                ) : (
                  <p className="text-gray-900 font-medium">{member?.height} cm</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Workout Time
                </label>
                {editMode ? (
                  <select
                    value={formData.preferredWorkoutTime || ""}
                    onChange={(e) => handleInputChange("preferredWorkoutTime", e.target.value)}
                    className="flex h-12 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    <option value="">Select preferred time</option>
                    <option value="Morning">Morning</option>
                    <option value="Afternoon">Afternoon</option>
                    <option value="Evening">Evening</option>
                    <option value="Night">Night</option>
                  </select>
                ) : (
                  <p className="text-gray-900 font-medium">{member?.preferredWorkoutTime}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fitness Goal
                </label>
                {editMode ? (
                  <Input
                    value={formData.fitnessGoal || ""}
                    onChange={(e) => handleInputChange("fitnessGoal", e.target.value)}
                    placeholder="Describe your fitness goals"
                  />
                ) : (
                  <p className="text-gray-900 font-medium">{member?.fitnessGoal}</p>
                )}
              </div>
            </div>
          </Card>

          {/* Favorite Classes */}
          <Card>
            <h2 className="text-xl font-display font-bold text-gray-900 mb-4 flex items-center gap-2">
              <ApperIcon name="Heart" className="h-6 w-6 text-primary" />
              Favorite Classes
            </h2>
            <div className="flex flex-wrap gap-2">
              {member?.favoriteClasses?.map((classType, index) => (
                <Badge key={index} variant="primary">
                  {classType}
                </Badge>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column - Stats & Membership */}
        <div className="space-y-6">
          {/* Membership Status */}
          <Card className="bg-gradient-secondary text-white border-0">
            <h3 className="text-lg font-display font-bold mb-4 flex items-center gap-2">
              <ApperIcon name="CreditCard" className="h-5 w-5" />
              Membership Status
            </h3>
            
            <div className="space-y-4">
              <div>
                <Badge 
                  variant={getMembershipColor()} 
                  className="bg-white/20 text-white border-white/30"
                >
                  {member?.membershipType} Member
                </Badge>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-white/80">Plan</span>
                  <span>{member?.membershipPlan}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/80">Joined</span>
                  <span>{new Date(member?.joinDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/80">Expires</span>
                  <span>{new Date(member?.expiryDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/80">Days Remaining</span>
                  <span className={getDaysUntilExpiry() <= 30 ? "text-warning" : ""}>
                    {getDaysUntilExpiry()} days
                  </span>
                </div>
              </div>

              <Button
                variant="accent"
                className="w-full bg-white/20 hover:bg-white/30 text-white border-0"
                icon="CreditCard"
                onClick={() => window.open("mailto:billing@fithubpro.com", "_blank")}
              >
                Manage Billing
              </Button>
            </div>
          </Card>

          {/* Fitness Stats */}
          {memberStats && (
            <Card>
              <h3 className="text-lg font-display font-bold text-gray-900 mb-4 flex items-center gap-2">
                <ApperIcon name="TrendingUp" className="h-5 w-5 text-primary" />
                Fitness Progress
              </h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Current Streak</span>
                    <span className="text-2xl font-display font-bold text-primary">
                      {memberStats.streak}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">days in a row</p>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Total Workouts</span>
                    <span className="text-2xl font-display font-bold text-gray-900">
                      {memberStats.totalWorkouts}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">completed this year</p>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Weight Goal Progress</span>
                    <span className="text-sm font-semibold text-success">
                      {Math.round(getGoalProgress())}%
                    </span>
                  </div>
                  <Progress 
                    value={getGoalProgress()} 
                    variant="success" 
                    size="sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {Math.abs(member?.currentWeight - member?.goalWeight).toFixed(1)} lbs to goal
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* Quick Actions */}
          <Card>
            <h3 className="text-lg font-display font-bold text-gray-900 mb-4 flex items-center gap-2">
              <ApperIcon name="Settings" className="h-5 w-5 text-primary" />
              Account Settings
            </h3>
            
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                icon="Bell"
                onClick={() => toast.info("Notification settings coming soon!")}
              >
                Notification Settings
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                icon="Shield"
                onClick={() => toast.info("Privacy settings coming soon!")}
              >
                Privacy Settings
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                icon="HelpCircle"
                onClick={() => window.open("mailto:support@fithubpro.com", "_blank")}
              >
                Help & Support
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-error border-error hover:bg-error hover:text-white"
                icon="LogOut"
                onClick={() => toast.info("Logout functionality would be implemented here")}
              >
                Sign Out
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;