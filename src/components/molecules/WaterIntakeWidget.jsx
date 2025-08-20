import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import memberService from "@/services/api/memberService";

function WaterIntakeWidget() {
  const navigate = useNavigate();
  const [dailyIntake, setDailyIntake] = useState(0);
  const [dailyGoal, setDailyGoal] = useState(8);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWaterData();
  }, []);

  const loadWaterData = async () => {
    try {
      const memberData = await memberService.getCurrentMember();
      setDailyIntake(memberData.dailyWaterIntake || 0);
      setDailyGoal(memberData.waterIntakeGoal || 8);
    } catch (err) {
      console.error("Water widget load error:", err);
    } finally {
      setLoading(false);
    }
  };

  const logWater = async () => {
    try {
      const newIntake = dailyIntake + 1;
      await memberService.updateWaterIntake(newIntake);
      setDailyIntake(newIntake);
      toast.success("Added 1 glass of water! 💧");
      
      if (newIntake >= dailyGoal && dailyIntake < dailyGoal) {
        toast.success("🎉 Daily water goal achieved!");
      }
    } catch (err) {
      toast.error("Failed to log water intake");
    }
  };

  const progressPercentage = Math.min((dailyIntake / dailyGoal) * 100, 100);
  const isGoalReached = dailyIntake >= dailyGoal;

  if (loading) {
    return (
      <Card className="p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-8 bg-gray-200 rounded"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 cursor-pointer card-hover" onClick={() => navigate("/water-tracker")}>
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-gray-900 flex items-center gap-2">
          <ApperIcon name="Droplets" className="h-4 w-4 text-blue-500" />
          Hydration
        </h4>
        <span className="text-xs text-gray-500">
          {dailyIntake}/{dailyGoal}
        </span>
      </div>

      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm text-gray-600">Today's Progress</span>
          <span className="text-sm font-medium text-gray-900">
            {Math.round(progressPercentage)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              isGoalReached ? 'bg-green-500' : 'bg-blue-500'
            }`}
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            logWater();
          }}
          icon="Plus"
          className="flex-1 text-xs"
        >
          Add Glass
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            navigate("/water-tracker");
          }}
          className="px-3"
        >
          <ApperIcon name="ChevronRight" size={14} />
        </Button>
      </div>

      {isGoalReached && (
        <div className="mt-2 text-xs text-green-600 flex items-center gap-1">
          <ApperIcon name="CheckCircle" className="h-3 w-3" />
          Goal achieved!
        </div>
      )}
    </Card>
  );
}

export default WaterIntakeWidget;