import { useState, useEffect } from "react";
import { format } from "date-fns";
import WorkoutCard from "@/components/molecules/WorkoutCard";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import workoutService from "@/services/api/workoutService";

const WorkoutsPage = () => {
  const [workouts, setWorkouts] = useState([]);
  const [filteredWorkouts, setFilteredWorkouts] = useState([]);
  const [selectedType, setSelectedType] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [showCompleted, setShowCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const workoutTypes = ["all", "Strength", "Cardio", "HIIT", "Core", "Flexibility"];
  const difficulties = ["all", "Beginner", "Intermediate", "Advanced"];

  useEffect(() => {
    loadWorkouts();
  }, []);

  useEffect(() => {
    filterWorkouts();
  }, [workouts, selectedType, selectedDifficulty, showCompleted]);

  const loadWorkouts = async () => {
    try {
      setLoading(true);
      setError("");
      const workoutData = await workoutService.getAll();
      setWorkouts(workoutData);
    } catch (err) {
      setError("Failed to load workouts. Please try again.");
      console.error("Workouts load error:", err);
    } finally {
      setLoading(false);
    }
  };

  const filterWorkouts = () => {
    let filtered = workouts;

    // Filter by completion status
    if (!showCompleted) {
      filtered = filtered.filter(workout => !workout.completed);
    }

    // Filter by type
    if (selectedType !== "all") {
      filtered = filtered.filter(workout => 
        workout.type?.toLowerCase() === selectedType.toLowerCase()
      );
    }

    // Filter by difficulty
    if (selectedDifficulty !== "all") {
      filtered = filtered.filter(workout => 
        workout.difficulty?.toLowerCase() === selectedDifficulty.toLowerCase()
      );
    }

    // Sort by date (upcoming first)
    filtered.sort((a, b) => new Date(a.targetDate) - new Date(b.targetDate));

    setFilteredWorkouts(filtered);
  };

  const getWorkoutStats = () => {
    const total = workouts.length;
    const completed = workouts.filter(w => w.completed).length;
    const pending = total - completed;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, completed, pending, completionRate };
  };

  if (loading) return <Loading message="Loading your workouts..." variant="grid" />;
  if (error) return <Error message="Workouts Error" description={error} onRetry={loadWorkouts} />;

  const stats = getWorkoutStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
            My Workouts
          </h1>
          <p className="text-gray-600">
            Track your progress and crush your fitness goals
          </p>
        </div>
        <Button
          variant="primary"
          icon="Plus"
          onClick={() => window.open("mailto:support@fithubpro.com?subject=Request New Workout Plan", "_blank")}
        >
          Request Plan
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Total Plans</span>
            <ApperIcon name="FileText" className="h-4 w-4 text-gray-400" />
          </div>
          <div className="text-2xl font-display font-bold text-gray-900">
            {stats.total}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Completed</span>
            <ApperIcon name="CheckCircle" className="h-4 w-4 text-success" />
          </div>
          <div className="text-2xl font-display font-bold text-success">
            {stats.completed}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Pending</span>
            <ApperIcon name="Clock" className="h-4 w-4 text-warning" />
          </div>
          <div className="text-2xl font-display font-bold text-warning">
            {stats.pending}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Success Rate</span>
            <ApperIcon name="TrendingUp" className="h-4 w-4 text-primary" />
          </div>
          <div className="text-2xl font-display font-bold text-primary">
            {stats.completionRate}%
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-display font-bold text-gray-900 mb-4">
          Filter Workouts
        </h3>
        
        <div className="space-y-4">
          {/* Show Completed Toggle */}
          <div className="flex items-center gap-3">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={showCompleted}
                onChange={(e) => setShowCompleted(e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              <span className="ml-3 text-sm font-medium text-gray-700">
                Show completed workouts
              </span>
            </label>
          </div>

          {/* Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Workout Type
            </label>
            <div className="flex flex-wrap gap-2">
              {workoutTypes.map((type) => (
                <Button
                  key={type}
                  variant={selectedType === type ? "primary" : "outline"}
                  size="sm"
                  onClick={() => setSelectedType(type)}
                >
                  {type === "all" ? "All Types" : type}
                </Button>
              ))}
            </div>
          </div>

          {/* Difficulty Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Difficulty Level
            </label>
            <div className="flex flex-wrap gap-2">
              {difficulties.map((difficulty) => (
                <Button
                  key={difficulty}
                  variant={selectedDifficulty === difficulty ? "primary" : "outline"}
                  size="sm"
                  onClick={() => setSelectedDifficulty(difficulty)}
                >
                  {difficulty === "all" ? "All Levels" : difficulty}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-display font-bold text-gray-900">
            {showCompleted ? "Completed Workouts" : "Upcoming Workouts"}
          </h2>
          <Badge variant="gray">
            {filteredWorkouts.length} {filteredWorkouts.length === 1 ? "workout" : "workouts"}
          </Badge>
        </div>
      </div>

      {/* Workouts Grid */}
      {filteredWorkouts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorkouts.map((workout) => (
            <WorkoutCard
              key={workout.Id}
              workout={workout}
              showProgress
            />
          ))}
        </div>
      ) : (
        <Empty
          title={showCompleted ? "No completed workouts" : "No upcoming workouts"}
          description={
            showCompleted
              ? "Complete your first workout to see it here!"
              : "You're all caught up! Request a new workout plan to continue your fitness journey."
          }
          icon="Dumbbell"
          actionLabel="Browse All Workouts"
          onAction={() => {
            setSelectedType("all");
            setSelectedDifficulty("all");
            setShowCompleted(!showCompleted);
          }}
        />
      )}

      {/* Workout Tips */}
      <div className="bg-gradient-primary/5 rounded-lg border border-primary/20 p-6">
        <h3 className="text-lg font-display font-bold text-primary mb-4 flex items-center gap-2">
          <ApperIcon name="Lightbulb" className="h-5 w-5" />
          Workout Tips
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
          <div className="flex items-start gap-2">
            <ApperIcon name="CheckCircle" className="h-4 w-4 text-success mt-0.5" />
            <span>Warm up for 5-10 minutes before starting any workout</span>
          </div>
          <div className="flex items-start gap-2">
            <ApperIcon name="CheckCircle" className="h-4 w-4 text-success mt-0.5" />
            <span>Stay hydrated throughout your session</span>
          </div>
          <div className="flex items-start gap-2">
            <ApperIcon name="CheckCircle" className="h-4 w-4 text-success mt-0.5" />
            <span>Focus on proper form over heavy weights</span>
          </div>
          <div className="flex items-start gap-2">
            <ApperIcon name="CheckCircle" className="h-4 w-4 text-success mt-0.5" />
            <span>Rest 48-72 hours between intense muscle group sessions</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkoutsPage;