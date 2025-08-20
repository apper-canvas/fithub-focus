import { useState } from "react";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const ExerciseLogItem = ({ exercise, onLogSet, completedSets = [] }) => {
  const [sets, setSets] = useState([]);
  const [showDetails, setShowDetails] = useState(false);

  const addSet = () => {
    const newSet = {
      id: Date.now(),
      reps: exercise.reps || 0,
      weight: exercise.weight || 0,
      completed: false
    };
    setSets([...sets, newSet]);
  };

  const updateSet = (setId, field, value) => {
    setSets(sets.map(set => 
      set.id === setId ? { ...set, [field]: value } : set
    ));
  };

  const completeSet = (setId) => {
    const updatedSets = sets.map(set => 
      set.id === setId ? { ...set, completed: true } : set
    );
    setSets(updatedSets);
    
    const completedSet = updatedSets.find(s => s.id === setId);
    onLogSet?.(exercise.Id, completedSet);
  };

  const getCategoryColor = () => {
    switch (exercise.category?.toLowerCase()) {
      case "chest": return "primary";
      case "back": return "secondary";
      case "legs": return "success";
      case "shoulders": return "warning";
      case "arms": return "accent";
      case "core": return "info";
      default: return "gray";
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-display font-bold text-lg text-gray-900">
              {exercise.name}
            </h3>
            <Badge variant={getCategoryColor()} size="sm">
              {exercise.category}
            </Badge>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
            <span>Target: {exercise.sets} sets × {exercise.reps} reps</span>
            {exercise.weight > 0 && (
              <span>@ {exercise.weight} lbs</span>
            )}
          </div>

          <div className="flex flex-wrap gap-1 mb-3">
            {exercise.targetMuscles?.map((muscle, index) => (
              <Badge key={index} variant="gray" size="sm">
                {muscle}
              </Badge>
            ))}
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          icon={showDetails ? "ChevronUp" : "ChevronDown"}
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? "Hide" : "Details"}
        </Button>
      </div>

      <motion.div
        initial={false}
        animate={{ height: showDetails ? "auto" : 0, opacity: showDetails ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden mb-4"
      >
        {exercise.instructions && (
          <div className="bg-gray-50 rounded-lg p-3 mb-3">
            <h4 className="font-semibold text-sm text-gray-900 mb-2">Instructions:</h4>
            <p className="text-sm text-gray-600">{exercise.instructions}</p>
          </div>
        )}
        
        {exercise.equipment?.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <ApperIcon name="Wrench" className="h-4 w-4" />
            <span>Equipment: {exercise.equipment.join(", ")}</span>
          </div>
        )}
      </motion.div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-gray-900">Log Sets</h4>
          <Button
            size="sm"
            variant="outline"
            icon="Plus"
            onClick={addSet}
          >
            Add Set
          </Button>
        </div>

        {sets.map((set, index) => (
          <motion.div
            key={set.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
          >
            <span className="font-semibold text-gray-900 w-8">
              {index + 1}.
            </span>
            
            <div className="flex-1 grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Reps
                </label>
                <Input
                  type="number"
                  value={set.reps}
                  onChange={(e) => updateSet(set.id, "reps", parseInt(e.target.value) || 0)}
                  className="h-10"
                  disabled={set.completed}
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Weight (lbs)
                </label>
                <Input
                  type="number"
                  value={set.weight}
                  onChange={(e) => updateSet(set.id, "weight", parseFloat(e.target.value) || 0)}
                  className="h-10"
                  disabled={set.completed}
                />
              </div>
            </div>

            <Button
              size="sm"
              variant={set.completed ? "success" : "primary"}
              icon={set.completed ? "Check" : "CheckCircle"}
              onClick={() => completeSet(set.id)}
              disabled={set.completed}
              className={set.completed ? "opacity-50" : ""}
            >
              {set.completed ? "Done" : "Complete"}
            </Button>
          </motion.div>
        ))}

        {sets.length === 0 && (
          <div className="text-center py-6 text-gray-500">
            <ApperIcon name="Plus" className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No sets logged yet. Add a set to start tracking!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExerciseLogItem;