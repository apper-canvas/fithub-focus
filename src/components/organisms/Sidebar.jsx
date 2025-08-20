import { NavLink } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";

const Sidebar = ({ isOpen, onClose }) => {
const navItems = [
    { to: "/", label: "Dashboard", icon: "LayoutDashboard" },
    { to: "/schedule", label: "Class Schedule", icon: "Calendar" },
    { to: "/workouts", label: "My Workouts", icon: "Dumbbell" },
    { to: "/trainer-booking", label: "Book Trainer", icon: "UserCheck" },
    { to: "/notifications", label: "Notifications", icon: "Bell", badge: 3 },
    { to: "/profile", label: "Profile & Settings", icon: "Settings" }
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:bg-white lg:border-r lg:border-gray-200">
        <div className="flex items-center gap-3 p-6 border-b border-gray-200">
          <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
            <ApperIcon name="Dumbbell" className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-display font-bold text-gray-900">
              FitHub Pro
            </h1>
            <p className="text-sm text-gray-600">Fitness Hub</p>
          </div>
        </div>

        <nav className="flex-1 p-4">
<ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 relative ${
                      isActive
                        ? "bg-gradient-primary text-white shadow-lg"
                        : "text-gray-700 hover:bg-gray-100"
                    }`
                  }
                >
                  <div className="relative">
                    <ApperIcon name={item.icon} className="h-5 w-5" />
                    {item.badge && item.badge > 0 && (
                      <span className="notification-badge">
                        {item.badge > 9 ? '9+' : item.badge}
                      </span>
                    )}
                  </div>
                  <span className="font-medium">{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="bg-gradient-primary/10 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <ApperIcon name="Trophy" className="h-5 w-5 text-primary" />
              <h3 className="font-display font-bold text-primary">Keep Going!</h3>
            </div>
            <p className="text-sm text-gray-600">
              You're on a 12-day streak! Don't break the chain.
            </p>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={onClose} />
          <aside className="fixed top-0 left-0 bottom-0 w-80 bg-white transform transition-transform duration-300">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <ApperIcon name="Dumbbell" className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-display font-bold text-gray-900">
                    FitHub Pro
                  </h1>
                  <p className="text-sm text-gray-600">Fitness Hub</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ApperIcon name="X" className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex-1 p-4">
<ul className="space-y-2">
                {navItems.map((item) => (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      onClick={onClose}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 relative ${
                          isActive
                            ? "bg-gradient-primary text-white shadow-lg"
                            : "text-gray-700 hover:bg-gray-100"
                        }`
                      }
                    >
                      <div className="relative">
                        <ApperIcon name={item.icon} className="h-5 w-5" />
                        {item.badge && item.badge > 0 && (
                          <span className="notification-badge">
                            {item.badge > 9 ? '9+' : item.badge}
                          </span>
                        )}
                      </div>
                      <span className="font-medium">{item.label}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="p-4 border-t border-gray-200">
              <div className="bg-gradient-primary/10 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <ApperIcon name="Trophy" className="h-5 w-5 text-primary" />
                  <h3 className="font-display font-bold text-primary">Keep Going!</h3>
                </div>
                <p className="text-sm text-gray-600">
                  You're on a 12-day streak! Don't break the chain.
                </p>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
};

export default Sidebar;