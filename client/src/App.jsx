
import AuthPage from "./pages/AuthPage.jsx";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from "./pages/Dashboard.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import ProtectedRoutes from "./routes/ProtectedRoutes.jsx";
import ChatPage from "./pages/ChatPage.jsx";



const App = () => {


  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />

        <Route element={<ProtectedRoutes />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/chat" element={<ChatPage />} />
        </Route>
      </Routes>

    </Router>
  );
};

export default App;