import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const TrainerCard = ({ trainerSlot, onBook }) => {
  const formatTime = (datetime) => {
    return new Date(datetime).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (datetime) => {
    return new Date(datetime).toLocaleDateString([], {
      month: 'short',
      day: 'numeric'
    });
  };

  const getSessionTypeColor = () => {
    switch (trainerSlot.type?.toLowerCase()) {
      case "personal training": return "primary";
      case "wellness session": return "accent";
      case "strength training": return "secondary";
      case "cardio training": return "error";
      case "cycling training": return "warning";
      case "functional training": return "success";
      case "boxing training": return "gray";
      default: return "gray";
    }
  };

  return (
    <Card hover className="h-full">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
            <span className="text-white font-display font-bold text-lg">
              {trainerSlot.trainerName?.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </span>
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-gray-900">
              {trainerSlot.trainerName}
            </h3>
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <ApperIcon name="Star" className="h-4 w-4 fill-warning text-warning" />
              <span>{trainerSlot.rating} • {trainerSlot.experience}</span>
            </div>
          </div>
        </div>
        <Badge variant={getSessionTypeColor()}>
          ${trainerSlot.price}
        </Badge>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <ApperIcon name="Calendar" className="h-4 w-4" />
          <span>{formatDate(trainerSlot.datetime)} at {formatTime(trainerSlot.datetime)}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <ApperIcon name="Clock" className="h-4 w-4" />
          <span>{trainerSlot.duration} minutes</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <ApperIcon name="MapPin" className="h-4 w-4" />
          <span>{trainerSlot.location}</span>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-600 font-medium mb-2">Specialties:</p>
        <div className="flex flex-wrap gap-1">
          {trainerSlot.specialties?.slice(0, 3).map((specialty, index) => (
            <Badge key={index} variant="gray" size="sm">
              {specialty}
            </Badge>
          ))}
          {trainerSlot.specialties?.length > 3 && (
            <Badge variant="gray" size="sm">
              +{trainerSlot.specialties.length - 3}
            </Badge>
          )}
        </div>
      </div>

      {trainerSlot.description && (
        <p className="text-sm text-gray-600 mb-4">{trainerSlot.description}</p>
      )}

      <Button
        variant="primary"
        className="w-full"
        onClick={() => onBook(trainerSlot.Id)}
        disabled={!trainerSlot.available}
        icon={trainerSlot.available ? "Calendar" : "X"}
      >
        {trainerSlot.available ? `Book Session - $${trainerSlot.price}` : "Unavailable"}
      </Button>
    </Card>
  );
};

export default TrainerCard;