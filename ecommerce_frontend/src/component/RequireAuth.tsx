// import { useEffect, useState } from "react";
// import { Navigate } from "react-router-dom";

// const RequireAuth = ({ children }:any) => {
//   const [loading, setLoading] = useState(true);
//   const [isAuth, setIsAuth] = useState(false);

//   useEffect(() => {
//     const token = localStorage.getItem("token");

//     if (token && token !== "null" && token !== "undefined") {
//       setIsAuth(true);
//     }

//     setLoading(false);
//   }, []);

//   if (loading) return null;

//   return isAuth ? children : <Navigate to="/login" replace />;
// };

// export default RequireAuth;






import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

interface RequireAuthProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}


const RequireAuth = ({ children, allowedRoles }: RequireAuthProps) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded: any = jwtDecode(token);
    const userRole = decoded.role;

    if (allowedRoles && !allowedRoles.includes(userRole)) {
      // Logged in but wrong role
      return <Navigate to="/" replace />;
    }

    return children;
  } catch {
    return <Navigate to="/login" replace />;
  }
};

export default RequireAuth;
