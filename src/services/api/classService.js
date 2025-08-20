import classesData from "@/services/mockData/classes.json";

let classes = [...classesData];

const classService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 350));
    return classes.map(cls => ({
      ...cls,
      datetime: new Date(cls.datetime)
    }));
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const classItem = classes.find(cls => cls.Id === parseInt(id));
    if (!classItem) throw new Error("Class not found");
    
    return {
      ...classItem,
      datetime: new Date(classItem.datetime)
    };
  },

  async getTodaysClasses() {
    await new Promise(resolve => setTimeout(resolve, 300));
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    return classes
      .filter(cls => {
        const classDate = new Date(cls.datetime);
        return classDate >= today && classDate < tomorrow;
      })
      .map(cls => ({
        ...cls,
        datetime: new Date(cls.datetime)
      }));
  },

  async getUpcomingClasses() {
    await new Promise(resolve => setTimeout(resolve, 300));
    const now = new Date();
    
    return classes
      .filter(cls => new Date(cls.datetime) > now)
      .sort((a, b) => new Date(a.datetime) - new Date(b.datetime))
      .slice(0, 5)
      .map(cls => ({
        ...cls,
        datetime: new Date(cls.datetime)
      }));
  },

  async bookClass(classId, memberId) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const classIndex = classes.findIndex(cls => cls.Id === parseInt(classId));
    if (classIndex === -1) throw new Error("Class not found");
    
    if (classes[classIndex].booked >= classes[classIndex].capacity) {
      throw new Error("Class is fully booked");
    }
    
    classes[classIndex].booked += 1;
    return { success: true, message: "Class booked successfully" };
  },

  async cancelBooking(classId, memberId) {
    await new Promise(resolve => setTimeout(resolve, 350));
    const classIndex = classes.findIndex(cls => cls.Id === parseInt(classId));
    if (classIndex === -1) throw new Error("Class not found");
    
    if (classes[classIndex].booked > 0) {
      classes[classIndex].booked -= 1;
    }
    
    return { success: true, message: "Booking cancelled successfully" };
  }
};

export default classService;