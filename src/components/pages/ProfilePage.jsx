import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Chart from "react-apexcharts";
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
  const [bodyMetrics, setBodyMetrics] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [showMetricsForm, setShowMetricsForm] = useState(false);
  const [formData, setFormData] = useState({});
  const [metricsFormData, setMetricsFormData] = useState({
    weight: '',
    bodyFatPercentage: '',
    muscleMass: '',
    visceralFat: '',
    waterPercentage: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingMetrics, setSavingMetrics] = useState(false);
  const [error, setError] = useState("");

useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [memberData, statsData, metricsData] = await Promise.all([
        memberService.getCurrentMember(),
        memberService.getMemberStats(1),
        memberService.getBodyMetrics(1)
      ]);
      
      setMember(memberData);
      setMemberStats(statsData);
      setBodyMetrics(metricsData);
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

  const handleMetricsInputChange = (field, value) => {
    setMetricsFormData(prev => ({
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

  const handleSaveMetrics = async () => {
    try {
      // Validate required fields
      if (!metricsFormData.weight) {
        toast.error("Weight is required");
        return;
      }

      setSavingMetrics(true);
      
      const newMetric = await memberService.addBodyMetric(member.Id, {
        weight: parseFloat(metricsFormData.weight),
        bodyFatPercentage: metricsFormData.bodyFatPercentage ? parseFloat(metricsFormData.bodyFatPercentage) : null,
        muscleMass: metricsFormData.muscleMass ? parseFloat(metricsFormData.muscleMass) : null,
        visceralFat: metricsFormData.visceralFat ? parseFloat(metricsFormData.visceralFat) : null,
        waterPercentage: metricsFormData.waterPercentage ? parseFloat(metricsFormData.waterPercentage) : null,
        date: metricsFormData.date
      });

      // Update the metrics list
      setBodyMetrics(prev => [...prev, newMetric]);
      
      // Reset form
      setMetricsFormData({
        weight: '',
        bodyFatPercentage: '',
        muscleMass: '',
        visceralFat: '',
        waterPercentage: '',
        date: new Date().toISOString().split('T')[0]
      });
      setShowMetricsForm(false);
      
      toast.success("Body metrics saved successfully! 📊");
    } catch (error) {
      toast.error("Failed to save metrics. Please try again.");
      console.error("Metrics save error:", error);
    } finally {
      setSavingMetrics(false);
    }
  };

  const handleCancelEdit = () => {
    setFormData(member);
    setEditMode(false);
  };

  const handleCancelMetrics = () => {
    setMetricsFormData({
      weight: '',
      bodyFatPercentage: '',
      muscleMass: '',
      visceralFat: '',
      waterPercentage: '',
      date: new Date().toISOString().split('T')[0]
    });
    setShowMetricsForm(false);
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

  const getChartData = () => {
    const sortedMetrics = [...bodyMetrics].sort((a, b) => new Date(a.date) - new Date(b.date));
    
    return {
      weight: {
        series: [{
          name: 'Weight (kg)',
          data: sortedMetrics.map(m => ({ x: m.date, y: m.weight }))
        }],
        options: {
          chart: { type: 'line', height: 300, toolbar: { show: false } },
          colors: ['#FF6B35'],
          stroke: { curve: 'smooth', width: 3 },
          xaxis: { type: 'datetime', labels: { style: { fontSize: '12px' } } },
          yaxis: { labels: { style: { fontSize: '12px' } } },
          grid: { borderColor: '#f1f5f9' },
          tooltip: { theme: 'light' }
        }
      },
      bodyFat: {
        series: [{
          name: 'Body Fat %',
          data: sortedMetrics.filter(m => m.bodyFatPercentage).map(m => ({ x: m.date, y: m.bodyFatPercentage }))
        }],
        options: {
          chart: { type: 'line', height: 300, toolbar: { show: false } },
          colors: ['#00D9FF'],
          stroke: { curve: 'smooth', width: 3 },
          xaxis: { type: 'datetime', labels: { style: { fontSize: '12px' } } },
          yaxis: { labels: { style: { fontSize: '12px' } } },
          grid: { borderColor: '#f1f5f9' },
          tooltip: { theme: 'light' }
        }
      },
      composition: {
        series: [
          {
            name: 'Muscle Mass (kg)',
            data: sortedMetrics.filter(m => m.muscleMass).map(m => ({ x: m.date, y: m.muscleMass }))
          },
          {
            name: 'Water %',
            data: sortedMetrics.filter(m => m.waterPercentage).map(m => ({ x: m.date, y: m.waterPercentage }))
          }
        ],
        options: {
          chart: { type: 'line', height: 300, toolbar: { show: false } },
          colors: ['#00C853', '#2196F3'],
          stroke: { curve: 'smooth', width: 3 },
          xaxis: { type: 'datetime', labels: { style: { fontSize: '12px' } } },
          yaxis: { labels: { style: { fontSize: '12px' } } },
          grid: { borderColor: '#f1f5f9' },
          tooltip: { theme: 'light' },
          legend: { position: 'top' }
        }
      }
    };
  };

  const getCurrentMetrics = () => {
    if (bodyMetrics.length === 0) return null;
    
    const latest = [...bodyMetrics].sort((a, b) => new Date(b.date) - new Date(a.date))[0];
    const previous = bodyMetrics.length > 1 ? [...bodyMetrics].sort((a, b) => new Date(b.date) - new Date(a.date))[1] : null;
    
    const getChange = (current, prev) => {
      if (!prev || !current) return null;
      const change = current - prev;
      return { value: Math.abs(change), isIncrease: change > 0 };
    };

    return {
      current: latest,
      changes: {
        weight: getChange(latest.weight, previous?.weight),
        bodyFat: getChange(latest.bodyFatPercentage, previous?.bodyFatPercentage),
        muscleMass: getChange(latest.muscleMass, previous?.muscleMass)
      }
    };
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

          {/* Body Metrics Tracking */}
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-display font-bold text-gray-900 flex items-center gap-2">
                <ApperIcon name="Activity" className="h-6 w-6 text-primary" />
                Body Metrics
              </h2>
              <Button
                onClick={() => setShowMetricsForm(!showMetricsForm)}
                size="sm"
                variant="outline"
                className="flex items-center gap-2"
              >
                <ApperIcon name="Plus" className="h-4 w-4" />
                Add Metrics
              </Button>
            </div>

            {/* Current Metrics Summary */}
            {getCurrentMetrics() && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {getCurrentMetrics().current.weight && (
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-blue-700 font-medium">Current Weight</p>
                        <p className="text-2xl font-display font-bold text-blue-900">
                          {getCurrentMetrics().current.weight} kg
                        </p>
                        {getCurrentMetrics().changes.weight && (
                          <div className="flex items-center gap-1 mt-1">
                            <ApperIcon 
                              name={getCurrentMetrics().changes.weight.isIncrease ? "TrendingUp" : "TrendingDown"}
                              className={`h-3 w-3 ${getCurrentMetrics().changes.weight.isIncrease ? "text-red-600" : "text-green-600"}`}
                            />
                            <span className={`text-xs font-medium ${getCurrentMetrics().changes.weight.isIncrease ? "text-red-600" : "text-green-600"}`}>
                              {getCurrentMetrics().changes.weight.value.toFixed(1)} kg
                            </span>
                          </div>
                        )}
                      </div>
                      <ApperIcon name="Weight" className="h-8 w-8 text-blue-600" />
                    </div>
                  </div>
                )}

                {getCurrentMetrics().current.bodyFatPercentage && (
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-orange-700 font-medium">Body Fat</p>
                        <p className="text-2xl font-display font-bold text-orange-900">
                          {getCurrentMetrics().current.bodyFatPercentage}%
                        </p>
                        {getCurrentMetrics().changes.bodyFat && (
                          <div className="flex items-center gap-1 mt-1">
                            <ApperIcon 
                              name={getCurrentMetrics().changes.bodyFat.isIncrease ? "TrendingUp" : "TrendingDown"}
                              className={`h-3 w-3 ${getCurrentMetrics().changes.bodyFat.isIncrease ? "text-red-600" : "text-green-600"}`}
                            />
                            <span className={`text-xs font-medium ${getCurrentMetrics().changes.bodyFat.isIncrease ? "text-red-600" : "text-green-600"}`}>
                              {getCurrentMetrics().changes.bodyFat.value.toFixed(1)}%
                            </span>
                          </div>
                        )}
                      </div>
                      <ApperIcon name="Percent" className="h-8 w-8 text-orange-600" />
                    </div>
                  </div>
                )}

                {getCurrentMetrics().current.muscleMass && (
                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-green-700 font-medium">Muscle Mass</p>
                        <p className="text-2xl font-display font-bold text-green-900">
                          {getCurrentMetrics().current.muscleMass} kg
                        </p>
                        {getCurrentMetrics().changes.muscleMass && (
                          <div className="flex items-center gap-1 mt-1">
                            <ApperIcon 
                              name={getCurrentMetrics().changes.muscleMass.isIncrease ? "TrendingUp" : "TrendingDown"}
                              className={`h-3 w-3 ${getCurrentMetrics().changes.muscleMass.isIncrease ? "text-green-600" : "text-red-600"}`}
                            />
                            <span className={`text-xs font-medium ${getCurrentMetrics().changes.muscleMass.isIncrease ? "text-green-600" : "text-red-600"}`}>
                              {getCurrentMetrics().changes.muscleMass.value.toFixed(1)} kg
                            </span>
                          </div>
                        )}
                      </div>
                      <ApperIcon name="Zap" className="h-8 w-8 text-green-600" />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Add Metrics Form */}
            {showMetricsForm && (
              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <h3 className="font-display font-bold text-gray-900 mb-4">Add New Metrics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Weight (kg) *
                    </label>
                    <Input
                      type="number"
                      step="0.1"
                      value={metricsFormData.weight}
                      onChange={(e) => handleMetricsInputChange('weight', e.target.value)}
                      placeholder="e.g. 75.5"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Body Fat Percentage (%)
                    </label>
                    <Input
                      type="number"
                      step="0.1"
                      value={metricsFormData.bodyFatPercentage}
                      onChange={(e) => handleMetricsInputChange('bodyFatPercentage', e.target.value)}
                      placeholder="e.g. 15.2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Muscle Mass (kg)
                    </label>
                    <Input
                      type="number"
                      step="0.1"
                      value={metricsFormData.muscleMass}
                      onChange={(e) => handleMetricsInputChange('muscleMass', e.target.value)}
                      placeholder="e.g. 45.8"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Visceral Fat Level
                    </label>
                    <Input
                      type="number"
                      step="0.1"
                      value={metricsFormData.visceralFat}
                      onChange={(e) => handleMetricsInputChange('visceralFat', e.target.value)}
                      placeholder="e.g. 8"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Water Percentage (%)
                    </label>
                    <Input
                      type="number"
                      step="0.1"
                      value={metricsFormData.waterPercentage}
                      onChange={(e) => handleMetricsInputChange('waterPercentage', e.target.value)}
                      placeholder="e.g. 65.5"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date
                    </label>
                    <Input
                      type="date"
                      value={metricsFormData.date}
                      onChange={(e) => handleMetricsInputChange('date', e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <Button
                    onClick={handleSaveMetrics}
                    disabled={savingMetrics}
                    className="flex items-center gap-2"
                  >
                    {savingMetrics ? (
                      <>
                        <ApperIcon name="Loader2" className="h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <ApperIcon name="Save" className="h-4 w-4" />
                        Save Metrics
                      </>
                    )}
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={handleCancelMetrics}
                    disabled={savingMetrics}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {/* Charts */}
            {bodyMetrics.length > 0 ? (
              <div className="space-y-6">
                {/* Weight Chart */}
                {getChartData().weight.series[0].data.length > 0 && (
                  <div>
                    <h3 className="font-display font-bold text-gray-900 mb-3">Weight Progress</h3>
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <Chart
                        options={getChartData().weight.options}
                        series={getChartData().weight.series}
                        type="line"
                        height={300}
                      />
                    </div>
                  </div>
                )}

                {/* Body Fat Chart */}
                {getChartData().bodyFat.series[0].data.length > 0 && (
                  <div>
                    <h3 className="font-display font-bold text-gray-900 mb-3">Body Fat Progress</h3>
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <Chart
                        options={getChartData().bodyFat.options}
                        series={getChartData().bodyFat.series}
                        type="line"
                        height={300}
                      />
                    </div>
                  </div>
                )}

                {/* Body Composition Chart */}
                {(getChartData().composition.series[0].data.length > 0 || getChartData().composition.series[1].data.length > 0) && (
                  <div>
                    <h3 className="font-display font-bold text-gray-900 mb-3">Body Composition</h3>
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <Chart
                        options={getChartData().composition.options}
                        series={getChartData().composition.series}
                        type="line"
                        height={300}
                      />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <ApperIcon name="BarChart3" className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 mb-4">No metrics data yet</p>
                <p className="text-sm text-gray-500">
                  Start tracking your progress by adding your first body metrics above
                </p>
              </div>
            )}
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