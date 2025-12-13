import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const RequireAuth = ({ children }:any) => {
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token && token !== "null" && token !== "undefined") {
      setIsAuth(true);
    }

    setLoading(false);
  }, []);

  if (loading) return null;

  return isAuth ? children : <Navigate to="/login" replace />;
};

export default RequireAuth;
