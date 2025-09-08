import { Routes, Route, Outlet } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./components/HomePage";
import RoomsPage from "./components/RoomsPage";
import VRViewer from "./components/VRViewer";
import AdminPanel from "./components/AdminPanel";
import MonitoringDashboard from "./components/MonitoringDashboard";
import Departments from "./pages/Departments";

// Clerk auth pages
import { SignIn, SignUp, UserProfile, SignedIn, SignedOut } from "@clerk/clerk-react";

// Other pages
import About from "./pages/About";
import Contact from "./pages/Contact";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Public routes */}
        <Route index element={<HomePage />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="login" element={<SignIn routing="path" path="/login" />} />
        <Route path="signup" element={<SignUp routing="path" path="/signup" />} />

        {/* Protected routes */}
        <Route
          element={
            <>
              <SignedIn>
                <Outlet />
              </SignedIn>
              <SignedOut>
                <SignIn routing="path" path="/login" />
              </SignedOut>
            </>
          }
        >
          <Route path="rooms" element={<RoomsPage />} />
          <Route path="vr" element={<VRViewer />} />
          <Route path="admin" element={<AdminPanel />} />
          <Route path="monitoring" element={<MonitoringDashboard />} />
          <Route path="departments" element={<Departments />} />
          <Route path="profile" element={<UserProfile routing="path" path="/profile" />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
