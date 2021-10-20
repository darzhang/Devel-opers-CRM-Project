import React from "react";
import { Redirect, Route, useLocation } from "react-router-dom";


const ProtectedRoute = (props) => {
  const location = useLocation();
  const isAuthenticated = sessionStorage.getItem("isAuthenticated");
  // console.log("this", isAuthenticated);

  return isAuthenticated === "true" ? (
    <Route {...props} />
  ) : (
    <Redirect
      to={{
        pathname: "/login",
        state: { from: location }
      }}
    />
  );
};

export default ProtectedRoute;