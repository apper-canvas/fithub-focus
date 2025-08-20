import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import React from "react";
import WaterIntakeTrackerPage from "@/components/pages/WaterIntakeTrackerPage";
import PrivacySettingsPage from "@/components/pages/PrivacySettingsPage";
import TrainerBookingPage from "@/components/pages/TrainerBookingPage";
import HomePage from "@/components/pages/HomePage";
import HelpSupportPage from "@/components/pages/HelpSupportPage";
import ProfilePage from "@/components/pages/ProfilePage";
import WorkoutTrackerPage from "@/components/pages/WorkoutTrackerPage";
import NotificationSettingsPage from "@/components/pages/NotificationSettingsPage";
import SchedulePage from "@/components/pages/SchedulePage";
import WorkoutsPage from "@/components/pages/WorkoutsPage";
import Layout from "@/components/organisms/Layout";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
<Routes>
<Route index element={<HomePage />} />
<Route path="schedule" element={<SchedulePage />} />
<Route path="workouts" element={<WorkoutsPage />} />
<Route path="trainer-booking" element={<TrainerBookingPage />} />
<Route path="water-tracker" element={<WaterIntakeTrackerPage />} />
<Route path="profile" element={<ProfilePage />} />
<Route path="notification-settings" element={<NotificationSettingsPage />} />
<Route path="privacy-settings" element={<PrivacySettingsPage />} />
<Route path="help-support" element={<HelpSupportPage />} />
</Routes>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          className="toast-container"
          style={{ zIndex: 9999 }}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;