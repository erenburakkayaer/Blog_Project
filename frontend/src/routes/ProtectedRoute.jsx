import PropTypes from "prop-types";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import useAuth from "../hooks/useAuth";

function ProtectedRoute({ allowedRoles = [] }) {
  const location = useLocation();
  const { isAuthenticated, hasRole } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/giris" replace state={{ from: location }} />;
  }

  if (allowedRoles.length > 0 && !hasRole(allowedRoles)) {
    return <Navigate to="/yetkisiz" replace />;
  }

  return <Outlet />;
}

ProtectedRoute.propTypes = {
  allowedRoles: PropTypes.arrayOf(PropTypes.string),
};

export default ProtectedRoute;
