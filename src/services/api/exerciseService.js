import exercisesData from "@/services/mockData/exercises.json";

let exercises = [...exercisesData];

const exerciseService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...exercises];
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const exercise = exercises.find(ex => ex.Id === parseInt(id));
    if (!exercise) throw new Error("Exercise not found");
    return { ...exercise };
  },

  async getByIds(ids) {
    await new Promise(resolve => setTimeout(resolve, 250));
    return exercises.filter(ex => ids.includes(ex.Id));
  },

  async getByCategory(category) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return exercises.filter(ex => 
      ex.category.toLowerCase() === category.toLowerCase()
    );
  },

  async searchExercises(query) {
    await new Promise(resolve => setTimeout(resolve, 350));
    const searchTerm = query.toLowerCase();
    return exercises.filter(ex => 
      ex.name.toLowerCase().includes(searchTerm) ||
      ex.category.toLowerCase().includes(searchTerm) ||
      ex.targetMuscles.some(muscle => muscle.toLowerCase().includes(searchTerm))
    );
  }
};

export default exerciseService;