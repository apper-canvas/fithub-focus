import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import StatCard from "@/components/molecules/StatCard";
import MembershipCard from "@/components/molecules/MembershipCard";
import ClassCard from "@/components/molecules/ClassCard";
import WorkoutCard from "@/components/molecules/WorkoutCard";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import memberService from "@/services/api/memberService";
import workoutService from "@/services/api/workoutService";
import classService from "@/services/api/classService";

const HomePage = () => {
  const navigate = useNavigate();
  const [member, setMember] = useState(null);
  const [todayWorkout, setTodayWorkout] = useState(null);
  const [upcomingClasses, setUpcomingClasses] = useState([]);
  const [memberStats, setMemberStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const [memberData, todayWorkoutData, upcomingClassesData, statsData] = await Promise.all([
        memberService.getCurrentMember(),
        workoutService.getTodaysWorkout(),
        classService.getUpcomingClasses(),
        memberService.getMemberStats(1)
      ]);

      setMember(memberData);
      setTodayWorkout(todayWorkoutData);
      setUpcomingClasses(upcomingClassesData);
      setMemberStats(statsData);
    } catch (err) {
      setError("Failed to load dashboard data. Please try again.");
      console.error("Dashboard load error:", err);
    } finally {
      setLoading(false);
    }
  };

const handleBookClass = async (classId) => {
    try {
      await classService.bookClass(classId, member.Id);
      
      // Enhanced success notification with member personalization
      toast.success(`🎉 Great choice, ${member?.name || 'Member'}! Class booked successfully!`, {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        className: "font-medium",
        bodyClassName: "text-white",
        progressClassName: "bg-white/30"
      });

      // Trigger notification sound for booking confirmation
      try {
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTOT3PO+bi4FL43v8+OUQgwXZ6rk8N2QQAoUXrTp66hVFApGn+DyvmwhBTOT3PO+bi4FL43v8+OUQgwX');
        audio.volume = 0.4;
        audio.play().catch(() => {}); // Graceful fail
      } catch (e) {
        // Silent fail for sound
      }

      loadDashboardData();
    } catch (error) {
      toast.error(`❌ Booking failed: ${error.message}`, {
        position: "top-right",
        autoClose: 6000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        className: "font-medium",
        bodyClassName: "text-white"
      });
    }
  };

  const handleStartWorkout = () => {
    if (todayWorkout) {
      navigate(`/workout/${todayWorkout.Id}`);
    }
  };

  if (loading) return <Loading message="Loading your dashboard..." />;
  if (error) return <Error message="Dashboard Error" description={error} onRetry={loadDashboardData} />;

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
            Ready to crush today's goals?
          </h1>
          <p className="text-gray-600">
            Here's your fitness overview for {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric"
            })}
          </p>
        </div>
        <div className="hidden lg:block">
          <Button
            variant="primary"
            size="lg"
            icon="Plus"
            onClick={() => navigate("/workouts")}
          >
            New Workout
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      {memberStats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Current Streak"
            value={`${memberStats.streak} days`}
            subtitle="Keep it going!"
            icon="Fire"
            variant="primary"
            trend="up"
            trendValue="+2"
          />
          <StatCard
            title="Total Workouts"
            value={memberStats.totalWorkouts}
            subtitle="This year"
            icon="Dumbbell"
            trend="up"
            trendValue="+12"
          />
          <StatCard
            title="Monthly Visits"
            value={memberStats.monthlyVisits}
            subtitle="This month"
            icon="Calendar"
            trend="up"
            trendValue="+3"
          />
          <StatCard
            title="Weight Progress"
            value={`${memberStats.weightProgress.current} lbs`}
            subtitle={`Goal: ${memberStats.weightProgress.goal} lbs`}
            icon="TrendingDown"
            variant="success"
            trend="down"
            trendValue="-7 lbs"
          />
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Today's Workout */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Workout */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-display font-bold text-gray-900 flex items-center gap-2">
                <ApperIcon name="Target" className="h-6 w-6 text-primary" />
                Today's Workout
              </h2>
              {todayWorkout && (
                <Button
                  variant="accent"
                  size="sm"
                  icon="Play"
                  onClick={handleStartWorkout}
                >
                  Start Now
                </Button>
              )}
            </div>
            
            {todayWorkout ? (
              <WorkoutCard workout={todayWorkout} showProgress />
            ) : (
              <div className="bg-white rounded-lg border-2 border-dashed border-gray-200 p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ApperIcon name="Calendar" className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="font-display font-bold text-gray-900 mb-2">
                  No workout scheduled for today
                </h3>
                <p className="text-gray-600 mb-4">
                  Browse your workout plans and start one today!
                </p>
                <Button
                  variant="primary"
                  onClick={() => navigate("/workouts")}
                  icon="Plus"
                >
                  Browse Workouts
                </Button>
              </div>
            )}
          </div>

          {/* Upcoming Classes */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-display font-bold text-gray-900 flex items-center gap-2">
                <ApperIcon name="Users" className="h-6 w-6 text-primary" />
                Upcoming Classes
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/schedule")}
                icon="ArrowRight"
                iconPosition="right"
              >
                View All
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {upcomingClasses.slice(0, 4).map((classData) => (
                <ClassCard
                  key={classData.Id}
                  classData={classData}
                  onBook={handleBookClass}
                />
              ))}
            </div>

            {upcomingClasses.length === 0 && (
              <div className="bg-white rounded-lg border-2 border-dashed border-gray-200 p-6 text-center">
                <ApperIcon name="Calendar" className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No upcoming classes found</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Membership & Quick Actions */}
        <div className="space-y-6">
          {/* Membership Card */}
          {member && <MembershipCard member={member} />}

          {/* Quick Actions */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-display font-bold text-gray-900 mb-4 flex items-center gap-2">
              <ApperIcon name="Zap" className="h-5 w-5 text-primary" />
              Quick Actions
            </h3>
            
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                icon="Calendar"
                onClick={() => navigate("/trainer-booking")}
              >
                Book Personal Trainer
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                icon="Users"
                onClick={() => navigate("/schedule")}
              >
                Browse All Classes
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                icon="Activity"
                onClick={() => navigate("/workouts")}
              >
                View Workout Plans
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                icon="Settings"
                onClick={() => navigate("/profile")}
              >
                Manage Profile
              </Button>
            </div>
          </div>

          {/* Weekly Progress */}
          {memberStats?.weeklyProgress && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-display font-bold text-gray-900 mb-4 flex items-center gap-2">
                <ApperIcon name="BarChart3" className="h-5 w-5 text-primary" />
                This Week
              </h3>
              
              <div className="space-y-3">
                {memberStats.weeklyProgress.map((day, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      {day.day}
                    </span>
                    <div className="flex items-center gap-2">
                      {day.workouts > 0 ? (
                        <div className="flex items-center gap-1 text-xs text-success">
                          <ApperIcon name="Check" className="h-3 w-3" />
                          <span>{day.calories} cal</span>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">Rest day</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;