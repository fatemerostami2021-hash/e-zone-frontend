import { Navigate } from 'react-router-dom';
import { getToken } from '../utils/authStorage';

// Only logged-in users can pass
function ProtectedRoute({ children }) {
  if (!getToken()) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default ProtectedRoute;
