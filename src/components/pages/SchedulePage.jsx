import { useState, useEffect } from "react";
import { format, startOfWeek, addDays, isSameDay } from "date-fns";
import { toast } from "react-toastify";
import ClassCard from "@/components/molecules/ClassCard";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import classService from "@/services/api/classService";

const SchedulePage = () => {
  const [classes, setClasses] = useState([]);
  const [filteredClasses, setFilteredClasses] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedType, setSelectedType] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const classTypes = ["all", "HIIT", "Yoga", "Strength", "Cardio", "Cycling", "Core", "Boxing", "Pilates"];

  useEffect(() => {
    loadClasses();
  }, []);

  useEffect(() => {
    filterClasses();
  }, [classes, selectedDate, selectedType]);

  const loadClasses = async () => {
    try {
      setLoading(true);
      setError("");
      const classData = await classService.getAll();
      setClasses(classData);
    } catch (err) {
      setError("Failed to load classes. Please try again.");
      console.error("Classes load error:", err);
    } finally {
      setLoading(false);
    }
  };

  const filterClasses = () => {
    let filtered = classes;

    // Filter by date
    filtered = filtered.filter(classData => 
      isSameDay(classData.datetime, selectedDate)
    );

    // Filter by type
    if (selectedType !== "all") {
      filtered = filtered.filter(classData => 
        classData.type?.toLowerCase() === selectedType.toLowerCase()
      );
    }

    // Sort by time
    filtered.sort((a, b) => a.datetime - b.datetime);

    setFilteredClasses(filtered);
  };

const handleBookClass = async (classId) => {
    try {
      await classService.bookClass(classId, 1); // Using member ID 1
      
      // Enhanced notification with sound and visual feedback
      toast.success("🎉 Class booked successfully!", {
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

      // Play notification sound if enabled (would check user preferences)
      try {
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTOT3PO+bi4FL43v8+OUQgwXZ6rk8N2QQAoUXrTp66hVFApGn+DyvmwhBTOT3PO+bi4FL43v8+OUQgwX');
        audio.volume = 0.3;
        audio.play().catch(() => {}); // Ignore errors if sound fails
      } catch (e) {
        // Silent fail for sound
      }

      loadClasses();
    } catch (error) {
      toast.error(`❌ ${error.message}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        className: "font-medium",
        bodyClassName: "text-white"
      });
    }
  };

  const getWeekDays = () => {
    const startDate = startOfWeek(selectedDate);
    return Array.from({ length: 7 }, (_, i) => addDays(startDate, i));
  };

  const getDayClasses = (date) => {
    return classes.filter(classData => isSameDay(classData.datetime, date));
  };

  if (loading) return <Loading message="Loading class schedule..." variant="grid" />;
  if (error) return <Error message="Schedule Error" description={error} onRetry={loadClasses} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
            Class Schedule
          </h1>
          <p className="text-gray-600">
            Book your favorite fitness classes and never miss a workout
          </p>
        </div>
        <Button
          variant="primary"
          icon="Calendar"
          onClick={() => setSelectedDate(new Date())}
        >
          Today
        </Button>
      </div>

      {/* Week View */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-display font-bold text-gray-900 mb-4">
          This Week
        </h2>
        
        <div className="grid grid-cols-7 gap-2">
          {getWeekDays().map((day) => {
            const dayClasses = getDayClasses(day);
            const isSelected = isSameDay(day, selectedDate);
            const isToday = isSameDay(day, new Date());
            
            return (
              <button
                key={day.toISOString()}
                onClick={() => setSelectedDate(day)}
                className={`p-3 rounded-lg text-center transition-all duration-200 ${
                  isSelected
                    ? "bg-gradient-primary text-white shadow-lg"
                    : isToday
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "hover:bg-gray-50 text-gray-700"
                }`}
              >
                <div className="text-xs font-medium opacity-80 mb-1">
                  {format(day, "EEE")}
                </div>
                <div className="text-lg font-bold mb-1">
                  {format(day, "d")}
                </div>
                <div className="text-xs">
                  {dayClasses.length > 0 && (
                    <Badge
                      variant={isSelected ? "accent" : "primary"}
                      size="sm"
                      className={isSelected ? "bg-white/20 text-white border-white/30" : ""}
                    >
                      {dayClasses.length}
                    </Badge>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm font-medium text-gray-700">Filter by type:</span>
        {classTypes.map((type) => (
          <Button
            key={type}
            variant={selectedType === type ? "primary" : "outline"}
            size="sm"
            onClick={() => setSelectedType(type)}
          >
            {type === "all" ? "All Classes" : type}
          </Button>
        ))}
      </div>

      {/* Selected Date Header */}
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-display font-bold text-gray-900">
          {format(selectedDate, "EEEE, MMMM d, yyyy")}
        </h2>
        {isSameDay(selectedDate, new Date()) && (
          <Badge variant="primary">Today</Badge>
        )}
        <Badge variant="gray">
          {filteredClasses.length} {filteredClasses.length === 1 ? "class" : "classes"}
        </Badge>
      </div>

      {/* Classes List */}
      {filteredClasses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClasses.map((classData) => (
            <ClassCard
              key={classData.Id}
              classData={classData}
              onBook={handleBookClass}
            />
          ))}
        </div>
      ) : (
        <Empty
          title="No classes found"
          description={
            selectedType === "all"
              ? `No classes scheduled for ${format(selectedDate, "MMMM d, yyyy")}`
              : `No ${selectedType} classes found for ${format(selectedDate, "MMMM d, yyyy")}`
          }
          icon="Calendar"
          actionLabel="View All Days"
          onAction={() => {
            setSelectedType("all");
            setSelectedDate(new Date());
          }}
        />
      )}

      {/* Class Legend */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-display font-bold text-gray-900 mb-4">
          Class Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <ApperIcon name="Users" className="h-4 w-4 text-gray-500" />
            <span>Class capacity and availability</span>
          </div>
          <div className="flex items-center gap-2">
            <ApperIcon name="Clock" className="h-4 w-4 text-gray-500" />
            <span>Duration and start time</span>
          </div>
          <div className="flex items-center gap-2">
            <ApperIcon name="Flame" className="h-4 w-4 text-gray-500" />
            <span>Estimated calories burned</span>
          </div>
          <div className="flex items-center gap-2">
            <ApperIcon name="Award" className="h-4 w-4 text-gray-500" />
            <span>Difficulty level indicator</span>
          </div>
          <div className="flex items-center gap-2">
            <ApperIcon name="User" className="h-4 w-4 text-gray-500" />
            <span>Certified instructor</span>
          </div>
          <div className="flex items-center gap-2">
            <ApperIcon name="Check" className="h-4 w-4 text-gray-500" />
            <span>One-click booking</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchedulePage;