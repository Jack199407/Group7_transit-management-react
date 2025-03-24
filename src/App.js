import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login page/Login";
import SignUp from "./pages/sign up page/SignUp";
import Management from "./pages/management page/Management";
import Dashboard from "./pages/dashboard page/Dashboard";
import ListSchedule from "./components/dashboard tabs/list schedule/ListSchedule";
import EnergyConsumption from "./components/dashboard tabs/energy consumption/EnergyConsumption";
import Maintenance from "./components/dashboard tabs/maintenance/Maintenance";
import Analytics from "./components/dashboard tabs/analytics/Analytics";
import Track from "./components/dashboard tabs/list schedule/Track";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/management" element={<Management />} />
        <Route path="/dashboard/*" element={<Dashboard />}>
          <Route path="schedule" element={<ListSchedule />} />
          <Route path="schedule/track" element={<Track />} />
          <Route path="energy" element={<EnergyConsumption />} />
          <Route path="maintenance" element={<Maintenance />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="*" element={<div>Select a tab from sidebar.</div>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
