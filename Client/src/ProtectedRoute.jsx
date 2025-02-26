import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const isAuthenticated = sessionStorage.getItem("username"); 

  return isAuthenticated ? <Outlet /> : <Navigate to="/UserLogin" />;
};

export default ProtectedRoute;
