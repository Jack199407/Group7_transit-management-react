import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login page/Login";
import SignUp from "./pages/sign up page/SignUp";
import Management from "./pages/management page/Management";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/management" element={<Management />} />
      </Routes>
    </Router>
  );
}

export default App;
