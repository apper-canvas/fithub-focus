import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/organisms/Sidebar";
import Header from "@/components/organisms/Header";
import BottomNavigation from "@/components/molecules/BottomNavigation";
import ApperIcon from "@/components/ApperIcon";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
<div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
<div className="flex-shrink-0">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main Content */}
<div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <Header />

        {/* Mobile Menu Button */}
<button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden fixed top-4 left-4 z-40 p-2 bg-white rounded-lg shadow-lg text-gray-700 hover:text-primary transition-colors"
        >
          <ApperIcon name="Menu" className="h-5 w-5" />
        </button>

        {/* Page Content */}
        <main className="px-4 lg:px-6 py-6 pb-20 lg:pb-6">
          <Outlet />
        </main>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default Layout;