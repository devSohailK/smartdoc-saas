import { useAuthStore } from '../store/authStore';
import { Navigate, Outlet } from 'react-router-dom'; // ✅ import Outlet

const ProtectedRoutes = () => {
    const { isAuthenticated } = useAuthStore();

    if (!isAuthenticated) {
        return <Navigate to="/auth" replace />;
    }

    return <Outlet />; // ✅ renders the matched child route
};

export default ProtectedRoutes;