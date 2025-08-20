import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const BottomNavigation = () => {
const navItems = [
    { to: "/", label: "Home", icon: "Home" },
    { to: "/schedule", label: "Schedule", icon: "Calendar" },
    { to: "/workouts", label: "Workouts", icon: "Dumbbell" },
    { to: "/notifications", label: "Alerts", icon: "Bell", badge: 3 },
    { to: "/profile", label: "Profile", icon: "User" }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 lg:hidden">
<nav className="flex items-center justify-around px-2 py-2">
        {navItems.map((item, index) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 py-2 px-2 relative transition-colors duration-200 ${
                isActive ? "text-primary" : "text-gray-500 hover:text-gray-700"
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -top-1 left-1/2 w-8 h-1 bg-primary rounded-full -translate-x-1/2"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
                <div className="relative">
                  <ApperIcon 
                    name={item.icon} 
                    className={`h-5 w-5 ${isActive ? "text-primary" : "text-gray-500"}`} 
                  />
                  {item.badge && item.badge > 0 && (
                    <span className="notification-badge">
                      {item.badge > 9 ? '9+' : item.badge}
                    </span>
                  )}
                </div>
                <span className="text-xs font-medium">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default BottomNavigation;