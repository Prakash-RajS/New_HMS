import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token"); // or your key name

  // If no token, redirect to 404 page
  if (!token) {
    return <Navigate to="/404" replace />;
  }

  return children;
};

export default ProtectedRoute;
