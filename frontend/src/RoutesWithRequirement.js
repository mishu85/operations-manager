import Auth from "./auth";
import { useLocation, Outlet, Navigate } from "react-router-dom";

function RequireAuth() {
  let location = useLocation();

  if (!Auth.getInstance().isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  return <Outlet />;
}

function RequireAuthAndAdmin() {
  let location = useLocation();

  if (
    !Auth.getInstance().isAuthenticated() ||
    !Auth.getInstance().getMyUser().me.admin
  ) {
    return <Navigate to="/" state={{ from: location }} />;
  }

  return <Outlet />;
}

function RequireNoAuth() {
  let location = useLocation();

  if (Auth.getInstance().isAuthenticated()) {
    return <Navigate to="/" state={{ from: location }} />;
  }

  return <Outlet />;
}

export { RequireAuth, RequireAuthAndAdmin, RequireNoAuth };
