import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Progress from "@/components/atoms/Progress";
import ApperIcon from "@/components/ApperIcon";

const WorkoutCard = ({ workout, showProgress = false }) => {
  const navigate = useNavigate();

  const getDifficultyColor = () => {
    switch (workout.difficulty?.toLowerCase()) {
      case "beginner": return "success";
      case "intermediate": return "warning";
      case "advanced": return "error";
      default: return "gray";
    }
  };

  const getTypeIcon = () => {
    switch (workout.type?.toLowerCase()) {
      case "strength": return "Dumbbell";
      case "cardio": return "Heart";
      case "hiit": return "Zap";
      case "core": return "Target";
      case "flexibility": return "Flower2";
      default: return "Activity";
    }
  };

  const handleStartWorkout = () => {
    navigate(`/workout/${workout.Id}`);
  };

  return (
    <Card hover className="h-full">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <ApperIcon name={getTypeIcon()} className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-gray-900">
              {workout.name}
            </h3>
            <p className="text-sm text-gray-600">
              {format(new Date(workout.targetDate), "MMM d, yyyy")}
            </p>
          </div>
        </div>
        <Badge variant={getDifficultyColor()}>
          {workout.difficulty}
        </Badge>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <ApperIcon name="Clock" className="h-4 w-4" />
          <span>{workout.duration} minutes</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <ApperIcon name="Target" className="h-4 w-4" />
          <span>{workout.exercises?.length || 0} exercises</span>
        </div>
        {workout.estimatedCalories && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <ApperIcon name="Flame" className="h-4 w-4" />
            <span>~{workout.estimatedCalories} calories</span>
          </div>
        )}
      </div>

      {workout.description && (
        <p className="text-sm text-gray-600 mb-4">{workout.description}</p>
      )}

      {workout.muscleGroups && (
        <div className="flex flex-wrap gap-1 mb-4">
          {workout.muscleGroups.slice(0, 3).map((group, index) => (
            <Badge key={index} variant="gray" size="sm">
              {group}
            </Badge>
          ))}
          {workout.muscleGroups.length > 3 && (
            <Badge variant="gray" size="sm">
              +{workout.muscleGroups.length - 3}
            </Badge>
          )}
        </div>
      )}

      {showProgress && (
        <div className="mb-4">
          <Progress 
            value={workout.completed ? 100 : 0} 
            variant={workout.completed ? "success" : "primary"} 
            showValue 
          />
        </div>
      )}

      <div className="flex items-center justify-between">
        {workout.completed ? (
          <Badge variant="success" className="flex-1 justify-center">
            <ApperIcon name="Check" className="h-4 w-4" />
            Completed
          </Badge>
        ) : (
          <Button
            variant="primary"
            className="flex-1"
            onClick={handleStartWorkout}
            icon="Play"
          >
            Start Workout
          </Button>
        )}
      </div>
    </Card>
  );
};

export default WorkoutCard;