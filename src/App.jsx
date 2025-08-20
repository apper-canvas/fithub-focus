import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Layout from "@/components/organisms/Layout";
import HomePage from "@/components/pages/HomePage";
import SchedulePage from "@/components/pages/SchedulePage";
import WorkoutsPage from "@/components/pages/WorkoutsPage";
import ProfilePage from "@/components/pages/ProfilePage";
import WorkoutTrackerPage from "@/components/pages/WorkoutTrackerPage";
import TrainerBookingPage from "@/components/pages/TrainerBookingPage";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="schedule" element={<SchedulePage />} />
            <Route path="workouts" element={<WorkoutsPage />} />
            <Route path="workout/:id" element={<WorkoutTrackerPage />} />
            <Route path="trainer-booking" element={<TrainerBookingPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
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