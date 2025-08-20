import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";
import exerciseService from "@/services/api/exerciseService";

const AIModificationPanel = ({ exercise, userGoals = [], injuryHistory = [] }) => {
  const [alternatives, setAlternatives] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedAlternative, setSelectedAlternative] = useState(null);

  // Mock user data - in real app this would come from user service
  const mockUserGoals = userGoals.length > 0 ? userGoals : ["strength", "muscle_building"];
  const mockInjuryHistory = injuryHistory.length > 0 ? injuryHistory : ["knee"];

  useEffect(() => {
    if (exercise) {
      loadAlternatives();
    }
  }, [exercise]);

  const loadAlternatives = async () => {
    setLoading(true);
    setError("");
    try {
      const alternativeExercises = await exerciseService.getAlternativeExercises(
        exercise.Id,
        mockUserGoals,
        mockInjuryHistory
      );
      setAlternatives(alternativeExercises);
    } catch (err) {
      setError("Failed to load AI recommendations");
      toast.error("Could not load exercise alternatives");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAlternative = (alternative) => {
    setSelectedAlternative(alternative);
    toast.success(`Selected alternative: ${alternative.name}`);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case "beginner":
        return "bg-green-100 text-green-800";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "advanced":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getInjuryIcon = (injuryType) => {
    const icons = {
      knee: "Zap",
      back: "AlertTriangle",
      shoulder: "Shield",
      wrist: "Hand",
      ankle: "Footprints",
      default: "Heart"
    };
    return icons[injuryType] || icons.default;
  };

  if (loading) {
    return (
      <Card className="p-4">
        <div className="flex items-center justify-center py-8">
          <Loading />
          <span className="ml-2 text-sm text-gray-600">Analyzing alternatives...</span>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-4 border-red-200">
        <div className="flex items-center text-red-600">
          <ApperIcon name="AlertCircle" size={16} />
          <span className="ml-2">{error}</span>
        </div>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="mt-4"
    >
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <div className="flex items-center mb-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <ApperIcon name="Brain" size={20} className="text-blue-600" />
          </div>
          <div className="ml-3">
            <h3 className="font-semibold text-gray-900">AI Exercise Alternatives</h3>
            <p className="text-sm text-gray-600">
              Personalized recommendations based on your goals and injury history
            </p>
          </div>
        </div>

        {/* User Context Display */}
        <div className="mb-4 p-3 bg-white rounded-lg border">
          <div className="flex flex-wrap gap-2 mb-2">
            <span className="text-xs font-medium text-gray-500">Your Goals:</span>
            {mockUserGoals.map((goal, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {goal.replace('_', ' ').toUpperCase()}
              </Badge>
            ))}
          </div>
          {mockInjuryHistory.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <span className="text-xs font-medium text-gray-500">Considerations:</span>
              {mockInjuryHistory.map((injury, index) => (
                <div key={index} className="flex items-center gap-1">
                  <ApperIcon name={getInjuryIcon(injury)} size={12} className="text-orange-600" />
                  <Badge variant="outline" className="text-xs text-orange-700">
                    {injury.toUpperCase()} SAFE
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Alternative Exercises */}
        <div className="space-y-3">
          {alternatives.map((alternative, index) => (
            <motion.div
              key={alternative.Id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`p-4 transition-all duration-200 cursor-pointer hover:shadow-md ${
                selectedAlternative?.Id === alternative.Id 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'hover:border-gray-300'
              }`}
              onClick={() => handleSelectAlternative(alternative)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900">{alternative.name}</h4>
                      <Badge 
                        className={getDifficultyColor(alternative.difficulty)}
                      >
                        {alternative.difficulty}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{alternative.category}</p>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {alternative.targetMuscles.map((muscle, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {muscle}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  {selectedAlternative?.Id === alternative.Id && (
                    <ApperIcon name="CheckCircle" size={20} className="text-green-600 ml-2" />
                  )}
                </div>

                {/* AI Recommendation Reason */}
                <div className="bg-gray-50 rounded-lg p-3 mb-3">
                  <div className="flex items-start gap-2">
                    <ApperIcon name="Lightbulb" size={14} className="text-yellow-600 mt-0.5" />
                    <div>
                      <p className="text-xs font-medium text-gray-700 mb-1">Why this alternative?</p>
                      <p className="text-xs text-gray-600">{alternative.recommendationReason}</p>
                    </div>
                  </div>
                </div>

                {/* Clear Instructions */}
                <div className="bg-white rounded-lg border p-3">
                  <h5 className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-2">
                    <ApperIcon name="BookOpen" size={14} />
                    Instructions
                  </h5>
                  <ol className="text-xs text-gray-700 space-y-1">
                    {alternative.instructions.map((instruction, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="flex-shrink-0 w-4 h-4 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs font-medium">
                          {idx + 1}
                        </span>
                        <span>{instruction}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Exercise Details */}
                <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-4">
                    {alternative.reps && (
                      <span className="flex items-center gap-1">
                        <ApperIcon name="RotateCcw" size={12} />
                        {alternative.reps} reps
                      </span>
                    )}
                    {alternative.sets && (
                      <span className="flex items-center gap-1">
                        <ApperIcon name="Layers" size={12} />
                        {alternative.sets} sets
                      </span>
                    )}
                    {alternative.duration && (
                      <span className="flex items-center gap-1">
                        <ApperIcon name="Clock" size={12} />
                        {alternative.duration}
                      </span>
                    )}
                  </div>
                  <span className="flex items-center gap-1">
                    <ApperIcon name="Target" size={12} />
                    Match: {alternative.matchScore}%
                  </span>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {alternatives.length === 0 && (
          <div className="text-center py-6">
            <ApperIcon name="Search" size={24} className="text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No alternative exercises found</p>
          </div>
        )}

        <div className="mt-4 pt-4 border-t">
          <Button
            onClick={loadAlternatives}
            variant="outline"
            size="sm"
            className="w-full"
          >
            <ApperIcon name="RefreshCw" size={14} />
            Refresh Recommendations
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};

export default AIModificationPanel;