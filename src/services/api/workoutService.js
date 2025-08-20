import workoutsData from "@/services/mockData/workouts.json";
import exercisesData from "@/services/mockData/exercises.json";

let workouts = [...workoutsData];
let exercises = [...exercisesData];

const workoutService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 350));
    return workouts.map(workout => ({
      ...workout,
      targetDate: new Date(workout.targetDate)
    }));
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const workout = workouts.find(w => w.Id === parseInt(id));
    if (!workout) throw new Error("Workout not found");
    
    const workoutExercises = exercises.filter(ex => 
      workout.exercises.includes(ex.Id)
    );
    
    return {
      ...workout,
      targetDate: new Date(workout.targetDate),
      exerciseDetails: workoutExercises
    };
  },

  async getTodaysWorkout() {
    await new Promise(resolve => setTimeout(resolve, 250));
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todaysWorkout = workouts.find(workout => {
      const workoutDate = new Date(workout.targetDate);
      workoutDate.setHours(0, 0, 0, 0);
      return workoutDate.getTime() === today.getTime();
    });
    
    if (!todaysWorkout) return null;
    
    const workoutExercises = exercises.filter(ex => 
      todaysWorkout.exercises.includes(ex.Id)
    );
    
    return {
      ...todaysWorkout,
      targetDate: new Date(todaysWorkout.targetDate),
      exerciseDetails: workoutExercises
    };
  },

  async getUpcomingWorkouts() {
    await new Promise(resolve => setTimeout(resolve, 300));
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return workouts
      .filter(workout => new Date(workout.targetDate) >= today)
      .sort((a, b) => new Date(a.targetDate) - new Date(b.targetDate))
      .slice(0, 7)
      .map(workout => ({
        ...workout,
        targetDate: new Date(workout.targetDate)
      }));
  },

  async completeWorkout(id) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const workoutIndex = workouts.findIndex(w => w.Id === parseInt(id));
    if (workoutIndex === -1) throw new Error("Workout not found");
    
    workouts[workoutIndex].completed = true;
    return { ...workouts[workoutIndex], targetDate: new Date(workouts[workoutIndex].targetDate) };
  },

  async logExercise(workoutId, exerciseId, logData) {
    await new Promise(resolve => setTimeout(resolve, 350));
    
    // In a real app, this would update the exercise log for the specific workout
    return {
      success: true,
      message: "Exercise logged successfully",
      data: logData
    };
  }
};

export default workoutService;