import { useState } from 'react'
import {ProtectedRoute} from './routes/ProtectedRoute';
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import {useAuthStore} from './stores/authStore';


function App() {
  const {isAuthenticated} = useAuthStore();



  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<ProtectedRoute isAuthenticated={isAuthenticated} />} />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  )
}

export default App
