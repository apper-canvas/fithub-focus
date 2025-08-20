import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import ExerciseLogItem from "@/components/molecules/ExerciseLogItem";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Progress from "@/components/atoms/Progress";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import workoutService from "@/services/api/workoutService";

const WorkoutTrackerPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [workout, setWorkout] = useState(null);
  const [completedSets, setCompletedSets] = useState({});
  const [workoutStartTime, setWorkoutStartTime] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isCompleting, setIsCompleting] = useState(false);

  useEffect(() => {
    loadWorkout();
    setWorkoutStartTime(new Date());
    
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, [id]);

  const loadWorkout = async () => {
    try {
      setLoading(true);
      setError("");
      const workoutData = await workoutService.getById(id);
      setWorkout(workoutData);
    } catch (err) {
      setError("Failed to load workout. Please try again.");
      console.error("Workout load error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogSet = (exerciseId, setData) => {
    setCompletedSets(prev => ({
      ...prev,
      [exerciseId]: [...(prev[exerciseId] || []), setData]
    }));
    
    toast.success("Set logged! 💪", {
      position: "bottom-center",
      autoClose: 1000,
      hideProgressBar: true
    });
  };

  const getWorkoutProgress = () => {
    if (!workout?.exerciseDetails) return 0;
    
    const totalExercises = workout.exerciseDetails.length;
    const exercisesWithSets = Object.keys(completedSets).length;
    
    return totalExercises > 0 ? (exercisesWithSets / totalExercises) * 100 : 0;
  };

  const getElapsedTime = () => {
    if (!workoutStartTime) return "00:00:00";
    
    const elapsed = Math.floor((currentTime - workoutStartTime) / 1000);
    const hours = Math.floor(elapsed / 3600);
    const minutes = Math.floor((elapsed % 3600) / 60);
    const seconds = elapsed % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getTotalSetsLogged = () => {
    return Object.values(completedSets).reduce((total, sets) => total + sets.length, 0);
  };

  const getEstimatedCalories = () => {
    const setsLogged = getTotalSetsLogged();
    const baseCalories = workout?.estimatedCalories || 0;
    const progress = getWorkoutProgress() / 100;
    
    return Math.round(baseCalories * progress);
  };

  const handleCompleteWorkout = async () => {
    try {
      setIsCompleting(true);
      await workoutService.completeWorkout(workout.Id);
      
      toast.success("🎉 Workout completed! Great job!", {
        position: "top-center",
        autoClose: 3000
      });
      
      setTimeout(() => {
        navigate("/workouts");
      }, 2000);
    } catch (error) {
      toast.error("Failed to complete workout. Please try again.");
      console.error("Complete workout error:", error);
    } finally {
      setIsCompleting(false);
    }
  };

  const handleEndWorkout = () => {
    if (getTotalSetsLogged() > 0) {
      const confirmed = window.confirm(
        "Are you sure you want to end this workout? Your progress will be saved."
      );
      if (confirmed) {
        navigate("/workouts");
      }
    } else {
      navigate("/workouts");
    }
  };

  if (loading) return <Loading message="Loading workout..." />;
  if (error) return <Error message="Workout Error" description={error} onRetry={loadWorkout} />;
  if (!workout) return <Error message="Workout not found" description="This workout doesn't exist." />;

  const progress = getWorkoutProgress();
  const canComplete = progress > 50; // Allow completion if at least 50% done

  return (
    <div className="space-y-6 pb-6">
      {/* Header */}
      <div className="bg-gradient-secondary text-white rounded-lg p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12" />
        
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl font-display font-bold mb-2">
                {workout.name}
              </h1>
              <p className="text-white/80">
                {format(new Date(workout.targetDate), "MMMM d, yyyy")} • {workout.duration} minutes
              </p>
            </div>
            <Badge variant="accent" className="bg-white/20 text-white border-white/30">
              {workout.difficulty}
            </Badge>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-display font-bold">{getElapsedTime()}</div>
              <div className="text-white/80 text-sm">Time Elapsed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-display font-bold">{getTotalSetsLogged()}</div>
              <div className="text-white/80 text-sm">Sets Logged</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-display font-bold">{getEstimatedCalories()}</div>
              <div className="text-white/80 text-sm">Calories</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-display font-bold">{Math.round(progress)}%</div>
              <div className="text-white/80 text-sm">Complete</div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-display font-bold text-gray-900">
            Workout Progress
          </h2>
          <span className="text-sm text-gray-600">
            {Object.keys(completedSets).length} of {workout.exerciseDetails?.length || 0} exercises started
          </span>
        </div>
        <Progress 
          value={progress} 
          variant="primary" 
          size="lg"
          className="mb-2"
        />
        <p className="text-sm text-gray-600">
          Keep going! You're doing great! 💪
        </p>
      </div>

      {/* Exercise List */}
      <div className="space-y-4">
        <h2 className="text-xl font-display font-bold text-gray-900 flex items-center gap-2">
          <ApperIcon name="Target" className="h-6 w-6 text-primary" />
          Exercises ({workout.exerciseDetails?.length || 0})
        </h2>

        {workout.exerciseDetails?.map((exercise, index) => (
          <motion.div
            key={exercise.Id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <ExerciseLogItem
              exercise={exercise}
              onLogSet={handleLogSet}
              completedSets={completedSets[exercise.Id] || []}
            />
          </motion.div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            variant="outline"
            className="flex-1"
            onClick={handleEndWorkout}
            icon="ArrowLeft"
          >
            End Workout
          </Button>
          
          <Button
            variant="primary"
            className="flex-1"
            onClick={handleCompleteWorkout}
            disabled={!canComplete || isCompleting}
            loading={isCompleting}
            icon="Check"
          >
            {isCompleting ? "Completing..." : "Complete Workout"}
          </Button>
        </div>
        
        {!canComplete && (
          <p className="text-sm text-gray-500 text-center mt-3">
            Complete at least 50% of exercises to finish the workout
          </p>
        )}
      </div>

      {/* Workout Notes */}
      {workout.description && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-2">Workout Notes</h3>
          <p className="text-sm text-gray-600">{workout.description}</p>
        </div>
      )}
    </div>
  );
};

export default WorkoutTrackerPage;