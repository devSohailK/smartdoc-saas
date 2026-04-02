import {useAuthStore} from '../store/authStore';

import {Navigate} from 'react-router-dom';


const ProtectedRoutes = ({children}) => {
    const {isAuthenticated} = useAuthStore();

    if (!isAuthenticated) {
        return <Navigate to="/auth" replace />;
    }   
    
    return children;
};

export default ProtectedRoutes;