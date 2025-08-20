import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Progress from "@/components/atoms/Progress";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import memberService from "@/services/api/memberService";
import Layout from "@/components/organisms/Layout";

function WaterIntakeTrackerPage() {
  const [member, setMember] = useState(null);
  const [dailyIntake, setDailyIntake] = useState(0);
  const [dailyGoal, setDailyGoal] = useState(8);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [tempGoal, setTempGoal] = useState(8);

  useEffect(() => {
    loadWaterData();
  }, []);

  const loadWaterData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const memberData = await memberService.getCurrentMember();
      setMember(memberData);
      setDailyIntake(memberData.dailyWaterIntake || 0);
      setDailyGoal(memberData.waterIntakeGoal || 8);
      setTempGoal(memberData.waterIntakeGoal || 8);
    } catch (err) {
      setError("Failed to load water intake data. Please try again.");
      console.error("Water data load error:", err);
    } finally {
      setLoading(false);
    }
  };

  const logWater = async (glasses) => {
    try {
      const newIntake = Math.max(0, dailyIntake + glasses);
      await memberService.updateWaterIntake(newIntake);
      setDailyIntake(newIntake);
      
      if (glasses > 0) {
        toast.success(`Added ${glasses} glass${glasses > 1 ? 'es' : ''} of water! 💧`);
        
        if (newIntake >= dailyGoal && dailyIntake < dailyGoal) {
          toast.success("🎉 Daily water goal achieved! Great job staying hydrated!");
        }
      } else {
        toast.info("Removed water from today's intake");
      }
    } catch (err) {
      toast.error("Failed to update water intake. Please try again.");
      console.error("Water logging error:", err);
    }
  };

  const resetDailyIntake = async () => {
    try {
      await memberService.updateWaterIntake(0);
      setDailyIntake(0);
      toast.info("Daily water intake reset");
    } catch (err) {
      toast.error("Failed to reset water intake. Please try again.");
    }
  };

  const updateGoal = async () => {
    try {
      if (tempGoal < 1 || tempGoal > 20) {
        toast.error("Daily goal must be between 1 and 20 glasses");
        return;
      }
      
      await memberService.updateWaterGoal(tempGoal);
      setDailyGoal(tempGoal);
      setIsEditingGoal(false);
      toast.success(`Daily water goal updated to ${tempGoal} glasses`);
    } catch (err) {
      toast.error("Failed to update water goal. Please try again.");
    }
  };

  const progressPercentage = Math.min((dailyIntake / dailyGoal) * 100, 100);
  const isGoalReached = dailyIntake >= dailyGoal;

  if (loading) return <Layout><Loading /></Layout>;
  if (error) return <Layout><Error message={error} onRetry={loadWaterData} /></Layout>;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <ApperIcon name="Droplets" className="h-8 w-8 text-blue-500" />
            <h1 className="text-2xl font-display font-bold text-gray-900">
              Water Intake Tracker
            </h1>
          </div>
          <p className="text-gray-600">
            Stay hydrated and track your daily water consumption
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Water Logging Card */}
          <Card className="p-8 text-center">
            <div className="mb-6">
              <div className="relative mx-auto w-32 h-32 mb-4">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="rgb(229, 231, 235)"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke={isGoalReached ? "rgb(34, 197, 94)" : "rgb(59, 130, 246)"}
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 56}`}
                    strokeDashoffset={`${2 * Math.PI * 56 * (1 - progressPercentage / 100)}`}
                    className="transition-all duration-500 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-display font-bold text-gray-900">
                    {dailyIntake}
                  </span>
                  <span className="text-sm text-gray-500">of {dailyGoal}</span>
                </div>
              </div>
              
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-900 mb-1">
                  {Math.round(progressPercentage)}% Complete
                </p>
                <p className="text-sm text-gray-600">
                  {isGoalReached ? "Goal achieved! 🎉" : `${dailyGoal - dailyIntake} glasses remaining`}
                </p>
              </div>
            </div>

            {/* Glass Counter */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <Button
                variant="outline"
                size="lg"
                onClick={() => logWater(-1)}
                disabled={dailyIntake === 0}
                className="w-12 h-12 rounded-full p-0"
              >
                <ApperIcon name="Minus" size={20} />
              </Button>
              
              <div className="flex flex-col items-center">
                <ApperIcon name="GlassWater" className="h-12 w-12 text-blue-500 mb-2" />
                <span className="text-sm font-medium text-gray-700">Glasses</span>
              </div>
              
              <Button
                size="lg"
                onClick={() => logWater(1)}
                className="w-12 h-12 rounded-full p-0"
              >
                <ApperIcon name="Plus" size={20} />
              </Button>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={() => logWater(2)}
                icon="Plus"
                className="text-sm"
              >
                +2 Glasses
              </Button>
              <Button
                variant="outline"
                onClick={resetDailyIntake}
                icon="RotateCcw"
                className="text-sm"
              >
                Reset Today
              </Button>
            </div>
          </Card>

          {/* Goal Management Card */}
          <Card className="p-6">
            <h3 className="text-lg font-display font-bold text-gray-900 mb-4 flex items-center gap-2">
              <ApperIcon name="Target" className="h-5 w-5 text-primary" />
              Daily Goal
            </h3>

            {isEditingGoal ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Glasses per day
                  </label>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setTempGoal(Math.max(1, tempGoal - 1))}
                      className="w-8 h-8 rounded-full p-0"
                    >
                      <ApperIcon name="Minus" size={16} />
                    </Button>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={tempGoal}
                      onChange={(e) => setTempGoal(parseInt(e.target.value) || 1)}
                      className="w-16 text-center border rounded-md p-2"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setTempGoal(Math.min(20, tempGoal + 1))}
                      className="w-8 h-8 rounded-full p-0"
                    >
                      <ApperIcon name="Plus" size={16} />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Recommended: 8 glasses per day
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button onClick={updateGoal} className="flex-1">
                    Save Goal
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditingGoal(false);
                      setTempGoal(dailyGoal);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Current Goal</span>
                  <span className="text-2xl font-bold text-gray-900">{dailyGoal} glasses</span>
                </div>
                
                <Button
                  variant="outline"
                  onClick={() => setIsEditingGoal(true)}
                  icon="Edit"
                  className="w-full"
                >
                  Change Goal
                </Button>
              </div>
            )}

            {/* Hydration Tips */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                <ApperIcon name="Lightbulb" className="h-4 w-4" />
                Hydration Tips
              </h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Start your day with a glass of water</li>
                <li>• Drink before, during, and after exercise</li>
                <li>• Set reminders throughout the day</li>
                <li>• Eat water-rich foods like fruits</li>
              </ul>
            </div>
          </Card>
        </div>

        {/* Weekly Progress */}
        <Card className="p-6">
          <h3 className="text-lg font-display font-bold text-gray-900 mb-4 flex items-center gap-2">
            <ApperIcon name="BarChart3" className="h-5 w-5 text-primary" />
            Weekly Hydration
          </h3>
          
          <div className="grid grid-cols-7 gap-2">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
              const isToday = index === new Date().getDay() - 1;
              const glasses = index === new Date().getDay() - 1 ? dailyIntake : Math.floor(Math.random() * dailyGoal + 2);
              const dayProgress = Math.min((glasses / dailyGoal) * 100, 100);
              
              return (
                <div key={day} className={`text-center p-3 rounded-lg ${isToday ? 'bg-blue-50 ring-2 ring-blue-200' : 'bg-gray-50'}`}>
                  <p className={`text-xs font-medium mb-2 ${isToday ? 'text-blue-900' : 'text-gray-600'}`}>
                    {day}
                  </p>
                  <div className="w-8 h-8 mx-auto mb-1 relative">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="16"
                        cy="16"
                        r="14"
                        stroke="rgb(229, 231, 235)"
                        strokeWidth="2"
                        fill="none"
                      />
                      <circle
                        cx="16"
                        cy="16"
                        r="14"
                        stroke={dayProgress >= 100 ? "rgb(34, 197, 94)" : "rgb(59, 130, 246)"}
                        strokeWidth="2"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 14}`}
                        strokeDashoffset={`${2 * Math.PI * 14 * (1 - dayProgress / 100)}`}
                      />
                    </svg>
                  </div>
                  <p className={`text-xs ${isToday ? 'text-blue-900 font-medium' : 'text-gray-500'}`}>
                    {glasses}
                  </p>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </Layout>
  );
}

export default WaterIntakeTrackerPage;