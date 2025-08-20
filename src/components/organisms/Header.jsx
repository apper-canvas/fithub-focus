import { useState, useEffect } from "react";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import memberService from "@/services/api/memberService";

const Header = () => {
  const [member, setMember] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    loadMember();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const loadMember = async () => {
    try {
      const memberData = await memberService.getCurrentMember();
      setMember(memberData);
    } catch (error) {
      console.error("Failed to load member:", error);
    }
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center lg:hidden">
              <ApperIcon name="Dumbbell" className="h-5 w-5 text-white" />
            </div>
            <div className="hidden lg:block">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <ApperIcon name="Dumbbell" className="h-4 w-4 text-white" />
                </div>
                <h1 className="text-xl font-display font-bold text-gray-900">
                  FitHub Pro
                </h1>
              </div>
            </div>
          </div>
          
          {member && (
            <div className="hidden sm:block">
              <h2 className="text-lg font-display font-bold text-gray-900">
                {getGreeting()}, {member.name.split(' ')[0]}!
              </h2>
              <p className="text-sm text-gray-600">
                {format(currentTime, "EEEE, MMMM d, yyyy")}
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
            <ApperIcon name="Clock" className="h-4 w-4" />
            <span className="font-mono">
              {format(currentTime, "h:mm:ss a")}
            </span>
          </div>

          <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <ApperIcon name="Bell" className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      {member && (
        <div className="sm:hidden mt-3">
          <h2 className="text-lg font-display font-bold text-gray-900">
            {getGreeting()}, {member.name.split(' ')[0]}!
          </h2>
          <p className="text-sm text-gray-600">
            {format(currentTime, "EEEE, MMMM d")}
          </p>
        </div>
      )}
    </header>
  );
};

export default Header;