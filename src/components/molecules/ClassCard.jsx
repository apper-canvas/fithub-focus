import { format } from "date-fns";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const ClassCard = ({ classData, onBook, isBooked = false, showActions = true }) => {
  const getAvailabilityColor = () => {
    const remaining = classData.capacity - classData.booked;
    if (remaining <= 3) return "error";
    if (remaining <= 8) return "warning";
    return "success";
  };

  const getDifficultyColor = () => {
    switch (classData.difficulty?.toLowerCase()) {
      case "beginner": return "success";
      case "intermediate": return "warning";
      case "advanced": return "error";
      default: return "gray";
    }
  };

  const getTypeIcon = () => {
    switch (classData.type?.toLowerCase()) {
      case "hiit": return "Zap";
      case "yoga": return "Flower2";
      case "strength": return "Dumbbell";
      case "cardio": return "Heart";
      case "cycling": return "Bike";
      case "core": return "Target";
      case "boxing": return "Shield";
      case "pilates": return "Waves";
      default: return "Activity";
    }
  };

  return (
    <Card hover={showActions} className="h-full">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <ApperIcon name={getTypeIcon()} className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-gray-900">
              {classData.name}
            </h3>
            <p className="text-sm text-gray-600">{classData.instructor}</p>
          </div>
        </div>
        <Badge variant={getDifficultyColor()}>
          {classData.difficulty}
        </Badge>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <ApperIcon name="Clock" className="h-4 w-4" />
          <span>{format(classData.datetime, "h:mm a")} • {classData.duration} min</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <ApperIcon name="Users" className="h-4 w-4" />
          <span>
            {classData.booked}/{classData.capacity} spots filled
          </span>
        </div>
        {classData.calories && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <ApperIcon name="Flame" className="h-4 w-4" />
            <span>~{classData.calories} calories</span>
          </div>
        )}
      </div>

      {classData.description && (
        <p className="text-sm text-gray-600 mb-4">{classData.description}</p>
      )}

      <div className="flex items-center justify-between">
        <Badge variant={getAvailabilityColor()} size="sm">
          {classData.capacity - classData.booked} spots left
        </Badge>
        
        {showActions && (
          <Button
            size="sm"
            variant={isBooked ? "outline" : "primary"}
            onClick={() => onBook?.(classData.Id)}
            disabled={!isBooked && classData.booked >= classData.capacity}
            icon={isBooked ? "Check" : "Plus"}
          >
            {isBooked ? "Booked" : "Book Class"}
          </Button>
        )}
      </div>
    </Card>
  );
};

export default ClassCard;