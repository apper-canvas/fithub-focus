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
  },

  async getAlternativeExercises(exerciseId, userGoals = [], injuryHistory = []) {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const currentExercise = exercises.find(ex => ex.Id === parseInt(exerciseId));
    if (!currentExercise) return [];

    // AI Logic: Filter exercises based on user goals and injury history
    const alternatives = exercises
      .filter(ex => ex.Id !== parseInt(exerciseId))
      .map(exercise => {
        let matchScore = 0;
        let recommendationReason = "";

        // Goal-based matching
        const goalMatches = this.calculateGoalMatch(exercise, userGoals);
        matchScore += goalMatches.score;
        recommendationReason += goalMatches.reason;

        // Injury safety matching
        const injurySafety = this.calculateInjurySafety(exercise, injuryHistory);
        matchScore += injurySafety.score;
        recommendationReason += injurySafety.reason;

        // Similar muscle group bonus
        const sharedMuscles = exercise.targetMuscles.filter(muscle =>
          currentExercise.targetMuscles.includes(muscle)
        ).length;
        if (sharedMuscles > 0) {
          matchScore += 20;
          recommendationReason += ` Targets similar muscle groups (${sharedMuscles} shared). `;
        }

        return {
          ...exercise,
          matchScore: Math.min(matchScore, 100),
          recommendationReason: recommendationReason.trim(),
          instructions: this.generateInstructions(exercise, injuryHistory)
        };
      })
      .filter(ex => ex.matchScore >= 40)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 5);

    return alternatives;
  },

  calculateGoalMatch(exercise, userGoals) {
    let score = 0;
    let reason = "";

    const goalMappings = {
      strength: {
        categories: ["strength", "powerlifting", "olympic"],
        keywords: ["deadlift", "squat", "bench", "press"],
        bonus: 30
      },
      muscle_building: {
        categories: ["bodybuilding", "strength"],
        keywords: ["curl", "row", "extension", "raise"],
        bonus: 25
      },
      endurance: {
        categories: ["cardio", "endurance", "functional"],
        keywords: ["burpee", "mountain", "jumping", "plank"],
        bonus: 25
      },
      weight_loss: {
        categories: ["cardio", "hiit", "functional"],
        keywords: ["jumping", "burpee", "mountain", "sprint"],
        bonus: 30
      },
      flexibility: {
        categories: ["flexibility", "yoga", "stretching"],
        keywords: ["stretch", "yoga", "mobility", "flow"],
        bonus: 35
      }
    };

    userGoals.forEach(goal => {
      const mapping = goalMappings[goal];
      if (mapping) {
        // Category match
        if (mapping.categories.some(cat => 
          exercise.category.toLowerCase().includes(cat)
        )) {
          score += mapping.bonus;
          reason += `Perfect for ${goal.replace('_', ' ')} goals. `;
        }
        
        // Keyword match
        if (mapping.keywords.some(keyword =>
          exercise.name.toLowerCase().includes(keyword)
        )) {
          score += 15;
          reason += `Excellent ${goal.replace('_', ' ')} exercise. `;
        }
      }
    });

    return { score, reason };
  },

  calculateInjurySafety(exercise, injuryHistory) {
    let score = 0;
    let reason = "";

    const injuryAdaptations = {
      knee: {
        avoid: ["squat", "lunge", "jump", "step"],
        safe: ["upper", "arm", "chest", "back", "shoulder"],
        bonus: 25
      },
      back: {
        avoid: ["deadlift", "row", "twist", "crunch"],
        safe: ["arm", "chest", "leg", "isolation"],
        bonus: 20
      },
      shoulder: {
        avoid: ["overhead", "press", "raise", "pullup"],
        safe: ["leg", "chest", "isolation", "lower"],
        bonus: 25
      },
      wrist: {
        avoid: ["pushup", "plank", "handstand", "press"],
        safe: ["leg", "back", "machine", "cable"],
        bonus: 20
      },
      ankle: {
        avoid: ["jump", "run", "lunge", "calf"],
        safe: ["upper", "seated", "lying", "machine"],
        bonus: 25
      }
    };

    injuryHistory.forEach(injury => {
      const adaptation = injuryAdaptations[injury];
      if (adaptation) {
        // Avoid exercises that stress the injury
        const hasRiskyMovement = adaptation.avoid.some(avoid =>
          exercise.name.toLowerCase().includes(avoid) ||
          exercise.category.toLowerCase().includes(avoid)
        );

        if (!hasRiskyMovement) {
          // Safe exercise gets bonus
          const isSafe = adaptation.safe.some(safe =>
            exercise.name.toLowerCase().includes(safe) ||
            exercise.category.toLowerCase().includes(safe) ||
            exercise.targetMuscles.some(muscle => 
              muscle.toLowerCase().includes(safe)
            )
          );
          
          if (isSafe) {
            score += adaptation.bonus;
            reason += `Safe for your ${injury} condition. `;
          } else {
            score += 10;
            reason += `Low impact alternative for ${injury} concerns. `;
          }
        } else {
          score -= 30;
        }
      }
    });

    return { score, reason };
  },

  generateInstructions(exercise, injuryHistory = []) {
    const baseInstructions = [
      "Position yourself in the starting position with proper form",
      "Engage your core and maintain neutral spine alignment",
      "Perform the movement with controlled, deliberate motion",
      "Focus on the target muscles throughout the full range",
      "Return to starting position with the same controlled pace"
    ];

    // Add injury-specific modifications
    const modifications = [];
    
    injuryHistory.forEach(injury => {
      switch (injury) {
        case "knee":
          modifications.push("Keep movements within pain-free range of motion");
          modifications.push("Avoid deep knee flexion if uncomfortable");
          break;
        case "back":
          modifications.push("Maintain neutral spine position throughout");
          modifications.push("Avoid excessive forward bending or twisting");
          break;
        case "shoulder":
          modifications.push("Keep arms below shoulder height if uncomfortable");
          modifications.push("Stop if you feel shoulder impingement");
          break;
        case "wrist":
          modifications.push("Use wrist supports if needed");
          modifications.push("Modify grip to reduce wrist extension");
          break;
        case "ankle":
          modifications.push("Perform on stable surface");
          modifications.push("Use ankle support if recommended");
          break;
      }
    });

    return [...baseInstructions.slice(0, 3), ...modifications, ...baseInstructions.slice(3)];
  }
};

export default exerciseService;