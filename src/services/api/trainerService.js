import trainerSlotsData from "@/services/mockData/trainerSlots.json";

let trainerSlots = [...trainerSlotsData];

const trainerService = {
  async getAvailableSlots() {
    await new Promise(resolve => setTimeout(resolve, 350));
    return trainerSlots
      .filter(slot => slot.available && new Date(slot.datetime) > new Date())
      .map(slot => ({
        ...slot,
        datetime: new Date(slot.datetime)
      }))
      .sort((a, b) => a.datetime - b.datetime);
  },

  async getSlotById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const slot = trainerSlots.find(s => s.Id === parseInt(id));
    if (!slot) throw new Error("Trainer slot not found");
    
    return {
      ...slot,
      datetime: new Date(slot.datetime)
    };
  },

  async bookSlot(slotId, memberId, notes = "") {
    await new Promise(resolve => setTimeout(resolve, 400));
    const slotIndex = trainerSlots.findIndex(s => s.Id === parseInt(slotId));
    if (slotIndex === -1) throw new Error("Trainer slot not found");
    
    if (!trainerSlots[slotIndex].available) {
      throw new Error("Trainer slot is no longer available");
    }
    
    trainerSlots[slotIndex].available = false;
    return {
      success: true,
      message: "Trainer session booked successfully",
      booking: {
        slotId,
        memberId,
        notes,
        bookingTime: new Date()
      }
    };
  },

  async cancelSlot(slotId, memberId) {
    await new Promise(resolve => setTimeout(resolve, 350));
    const slotIndex = trainerSlots.findIndex(s => s.Id === parseInt(slotId));
    if (slotIndex === -1) throw new Error("Trainer slot not found");
    
    trainerSlots[slotIndex].available = true;
    return {
      success: true,
      message: "Trainer session cancelled successfully"
    };
  },

  async getTrainers() {
    await new Promise(resolve => setTimeout(resolve, 250));
    const uniqueTrainers = [];
    const seenTrainers = new Set();
    
    trainerSlots.forEach(slot => {
      if (!seenTrainers.has(slot.trainerId)) {
        uniqueTrainers.push({
          id: slot.trainerId,
          name: slot.trainerName,
          specialties: slot.specialties,
          rating: slot.rating,
          experience: slot.experience
        });
        seenTrainers.add(slot.trainerId);
      }
    });
    
    return uniqueTrainers;
  }
};

export default trainerService;