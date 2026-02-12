// src/auth.js
import { Navigate, Outlet } from 'react-router-dom';

const isLoggedIn = () => {
  return localStorage.getItem('user') !== null;
};

export const PrivateRoute = () => {
  return isLoggedIn() ? <Outlet /> : <Navigate to="/login" />;
};

export const PublicRoute = () => {
  return isLoggedIn() ? <Navigate to="/home" /> : <Outlet />;
};
