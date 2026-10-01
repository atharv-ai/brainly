import { SingIn } from "./pages/Signin";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SingUp } from "./pages/SignUp";
import { Dashboard } from "./pages/Dashboard";
import { SharedBrain } from "./pages/SharedBrain";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/signin" element={<SingIn />} />
        <Route path="/signup" element={<SingUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/share/:shareLink" element={<SharedBrain />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;