import membersData from "@/services/mockData/members.json";

let members = [...membersData];

const memberService = {
  async getCurrentMember() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { ...members[0] };
  },

  async updateMember(id, updates) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const memberIndex = members.findIndex(member => member.Id === parseInt(id));
    if (memberIndex !== -1) {
      members[memberIndex] = { ...members[memberIndex], ...updates };
      return { ...members[memberIndex] };
    }
    throw new Error("Member not found");
  },

  async getMemberStats(id) {
    await new Promise(resolve => setTimeout(resolve, 250));
    const member = members.find(m => m.Id === parseInt(id));
    if (!member) throw new Error("Member not found");
    
    return {
      streak: member.streak,
      totalWorkouts: member.totalWorkouts,
      monthlyVisits: member.monthlyVisits,
      weightProgress: {
        current: member.currentWeight,
        goal: member.goalWeight,
        change: member.currentWeight - (member.goalWeight + 10)
      },
      weeklyProgress: [
        { day: "Mon", workouts: 1, calories: 350 },
        { day: "Tue", workouts: 0, calories: 0 },
        { day: "Wed", workouts: 1, calories: 420 },
        { day: "Thu", workouts: 0, calories: 0 },
        { day: "Fri", workouts: 1, calories: 380 },
        { day: "Sat", workouts: 1, calories: 450 },
        { day: "Sun", workouts: 0, calories: 0 }
      ]
    };
  }
};

export default memberService;