import React from "react";
import Error from "@/components/ui/Error";
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
},

  // Body Metrics Operations
  getBodyMetrics: async (memberId) => {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
    
    const member = members.find(m => m.Id === parseInt(memberId));
    if (!member) {
      throw new Error("Member not found");
    }
    
    return member.bodyMetrics || [];
  },

  addBodyMetric: async (memberId, metricData) => {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
    
    const memberIndex = members.findIndex(m => m.Id === parseInt(memberId));
    if (memberIndex === -1) {
      throw new Error("Member not found");
    }

    if (!members[memberIndex].bodyMetrics) {
      members[memberIndex].bodyMetrics = [];
    }

    const newMetric = {
      Id: Date.now(), // Simple ID generation for demo
      date: metricData.date,
      weight: metricData.weight,
      bodyFatPercentage: metricData.bodyFatPercentage,
      muscleMass: metricData.muscleMass,
      visceralFat: metricData.visceralFat,
      waterPercentage: metricData.waterPercentage,
      createdAt: new Date().toISOString()
    };

    members[memberIndex].bodyMetrics.push(newMetric);
    
    // Update current weight if this is the latest entry
    const latestMetric = members[memberIndex].bodyMetrics.sort((a, b) => new Date(b.date) - new Date(a.date))[0];
    if (latestMetric.weight) {
      members[memberIndex].currentWeight = latestMetric.weight;
    }

    return newMetric;
  },

  updateBodyMetric: async (memberId, metricId, metricData) => {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
    
    const member = members.find(m => m.Id === parseInt(memberId));
    if (!member || !member.bodyMetrics) {
      throw new Error("Member or metrics not found");
    }

    const metricIndex = member.bodyMetrics.findIndex(m => m.Id === parseInt(metricId));
    if (metricIndex === -1) {
      throw new Error("Metric not found");
    }

    member.bodyMetrics[metricIndex] = {
      ...member.bodyMetrics[metricIndex],
      ...metricData,
      updatedAt: new Date().toISOString()
    };

    return member.bodyMetrics[metricIndex];
  },

  deleteBodyMetric: async (memberId, metricId) => {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
    
    const member = members.find(m => m.Id === parseInt(memberId));
    if (!member || !member.bodyMetrics) {
      throw new Error("Member or metrics not found");
    }

    const metricIndex = member.bodyMetrics.findIndex(m => m.Id === parseInt(metricId));
    if (metricIndex === -1) {
      throw new Error("Metric not found");
    }

member.bodyMetrics.splice(metricIndex, 1);
    return { success: true };
  },

  // Water intake tracking methods
  async updateWaterIntake(glasses) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const member = members.find(m => m.Id === 1);
    if (!member) {
      throw new Error("Member not found");
    }
    
    // Reset daily intake if it's a new day
    const today = new Date().toDateString();
    if (member.lastWaterUpdate !== today) {
      member.dailyWaterIntake = 0;
      member.lastWaterUpdate = today;
    }
    
    member.dailyWaterIntake = Math.max(0, glasses);
    return { ...member };
  },

  async updateWaterGoal(goal) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const member = members.find(m => m.Id === 1);
    if (!member) {
      throw new Error("Member not found");
    }
    
    if (goal < 1 || goal > 20) {
      throw new Error("Goal must be between 1 and 20 glasses");
    }
    
    member.waterIntakeGoal = goal;
    return { ...member };
  },

  async getWaterIntakeHistory() {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Generate mock weekly data
    const history = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      history.push({
        date: date.toDateString(),
        glasses: i === 0 ? (members[0]?.dailyWaterIntake || 0) : Math.floor(Math.random() * 10) + 2,
        goal: members[0]?.waterIntakeGoal || 8
      });
    }
    
    return history;
  }
};

export default memberService;