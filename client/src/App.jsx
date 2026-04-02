
import AuthPage from "./pages/AuthPage.jsx";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';



const App = () => {
 

  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
      </Routes>
    </Router>
  );
};

export default App;