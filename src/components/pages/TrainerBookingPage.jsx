import { useState, useEffect } from "react";
import { format } from "date-fns";
import { toast } from "react-toastify";
import TrainerCard from "@/components/molecules/TrainerCard";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import trainerService from "@/services/api/trainerService";

const TrainerBookingPage = () => {
  const [trainerSlots, setTrainerSlots] = useState([]);
  const [filteredSlots, setFilteredSlots] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [selectedTrainer, setSelectedTrainer] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const sessionTypes = ["all", "Personal Training", "Wellness Session", "Strength Training", "Cardio Training", "Cycling Training", "Functional Training", "Boxing Training"];

  useEffect(() => {
    loadTrainerData();
  }, []);

  useEffect(() => {
    filterSlots();
  }, [trainerSlots, selectedTrainer, selectedType]);

  const loadTrainerData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [slotsData, trainersData] = await Promise.all([
        trainerService.getAvailableSlots(),
        trainerService.getTrainers()
      ]);
      
      setTrainerSlots(slotsData);
      setTrainers(trainersData);
    } catch (err) {
      setError("Failed to load trainer data. Please try again.");
      console.error("Trainer data load error:", err);
    } finally {
      setLoading(false);
    }
  };

  const filterSlots = () => {
    let filtered = trainerSlots;

    // Filter by trainer
    if (selectedTrainer !== "all") {
      filtered = filtered.filter(slot => slot.trainerId === selectedTrainer);
    }

    // Filter by session type
    if (selectedType !== "all") {
      filtered = filtered.filter(slot => slot.type === selectedType);
    }

    // Sort by date and time
    filtered.sort((a, b) => new Date(a.datetime) - new Date(b.datetime));

    setFilteredSlots(filtered);
  };

  const handleBookSlot = async (slotId) => {
    try {
      const slot = trainerSlots.find(s => s.Id === slotId);
      if (!slot) return;

      const confirmed = window.confirm(
        `Book session with ${slot.trainerName} on ${format(slot.datetime, "MMM d, yyyy")} at ${format(slot.datetime, "h:mm a")} for $${slot.price}?`
      );

      if (!confirmed) return;

      await trainerService.bookSlot(slotId, 1); // Using member ID 1
      toast.success(`Session booked with ${slot.trainerName}! 🎉`);
      loadTrainerData();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getTrainerStats = () => {
    const totalSlots = trainerSlots.length;
    const uniqueTrainers = new Set(trainerSlots.map(slot => slot.trainerId)).size;
    const avgPrice = trainerSlots.length > 0 
      ? Math.round(trainerSlots.reduce((sum, slot) => sum + slot.price, 0) / trainerSlots.length)
      : 0;

    return { totalSlots, uniqueTrainers, avgPrice };
  };

  if (loading) return <Loading message="Loading trainer availability..." variant="grid" />;
  if (error) return <Error message="Booking Error" description={error} onRetry={loadTrainerData} />;

  const stats = getTrainerStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
            Book Personal Trainer
          </h1>
          <p className="text-gray-600">
            Get personalized training with our certified fitness professionals
          </p>
        </div>
        <Button
          variant="primary"
          icon="Calendar"
          onClick={() => window.open("mailto:trainers@fithubpro.com?subject=Custom Training Request", "_blank")}
        >
          Request Custom Session
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Available Sessions</span>
            <ApperIcon name="Calendar" className="h-4 w-4 text-primary" />
          </div>
          <div className="text-2xl font-display font-bold text-primary">
            {stats.totalSlots}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Expert Trainers</span>
            <ApperIcon name="Users" className="h-4 w-4 text-accent" />
          </div>
          <div className="text-2xl font-display font-bold text-accent">
            {stats.uniqueTrainers}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Avg. Price</span>
            <ApperIcon name="DollarSign" className="h-4 w-4 text-success" />
          </div>
          <div className="text-2xl font-display font-bold text-success">
            ${stats.avgPrice}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-display font-bold text-gray-900 mb-4">
          Filter Sessions
        </h3>
        
        <div className="space-y-4">
          {/* Trainer Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Trainer
            </label>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedTrainer === "all" ? "primary" : "outline"}
                size="sm"
                onClick={() => setSelectedTrainer("all")}
              >
                All Trainers
              </Button>
              {trainers.map((trainer) => (
                <Button
                  key={trainer.id}
                  variant={selectedTrainer === trainer.id ? "primary" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTrainer(trainer.id)}
                >
                  {trainer.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Session Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Session Type
            </label>
            <div className="flex flex-wrap gap-2">
              {sessionTypes.map((type) => (
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
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-display font-bold text-gray-900">
          Available Sessions
        </h2>
        <Badge variant="gray">
          {filteredSlots.length} {filteredSlots.length === 1 ? "session" : "sessions"}
        </Badge>
      </div>

      {/* Trainer Sessions Grid */}
      {filteredSlots.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSlots.map((slot) => (
            <TrainerCard
              key={slot.Id}
              trainerSlot={slot}
              onBook={handleBookSlot}
            />
          ))}
        </div>
      ) : (
        <Empty
          title="No sessions available"
          description={
            selectedTrainer === "all" && selectedType === "all"
              ? "No trainer sessions are currently available. Check back later!"
              : "No sessions match your current filters. Try adjusting your selection."
          }
          icon="UserX"
          actionLabel="Clear Filters"
          onAction={() => {
            setSelectedTrainer("all");
            setSelectedType("all");
          }}
        />
      )}

      {/* Booking Information */}
      <div className="bg-gradient-accent/5 rounded-lg border border-accent/20 p-6">
        <h3 className="text-lg font-display font-bold text-accent mb-4 flex items-center gap-2">
          <ApperIcon name="Info" className="h-5 w-5" />
          Booking Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
          <div className="flex items-start gap-2">
            <ApperIcon name="Clock" className="h-4 w-4 text-accent mt-0.5" />
            <span>Sessions can be cancelled up to 24 hours in advance</span>
          </div>
          <div className="flex items-start gap-2">
            <ApperIcon name="CreditCard" className="h-4 w-4 text-accent mt-0.5" />
            <span>Payment is processed upon booking confirmation</span>
          </div>
          <div className="flex items-start gap-2">
            <ApperIcon name="MapPin" className="h-4 w-4 text-accent mt-0.5" />
            <span>All sessions include equipment and gym access</span>
          </div>
          <div className="flex items-start gap-2">
            <ApperIcon name="Award" className="h-4 w-4 text-accent mt-0.5" />
            <span>All trainers are certified fitness professionals</span>
          </div>
        </div>
      </div>

      {/* Trainer Specialties */}
      {trainers.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-display font-bold text-gray-900 mb-4">
            Our Expert Trainers
          </h3>
          <div className="space-y-4">
            {trainers.map((trainer) => (
              <div key={trainer.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                  <span className="text-white font-display font-bold text-lg">
                    {trainer.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-display font-bold text-gray-900">
                      {trainer.name}
                    </h4>
                    <div className="flex items-center gap-1">
                      <ApperIcon name="Star" className="h-4 w-4 fill-warning text-warning" />
                      <span className="text-sm text-gray-600">{trainer.rating}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{trainer.experience} experience</p>
                  <div className="flex flex-wrap gap-1">
                    {trainer.specialties?.map((specialty, index) => (
                      <Badge key={index} variant="gray" size="sm">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainerBookingPage;