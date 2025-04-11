import React, { useContext } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext';

const PrivateRoute = ({ layout: Layout, children }) => {
    const { user, loading } = useContext(AuthContext);
    const location = useLocation();

    if (loading) return <p>loading...</p>;

    const allowedPaths = ['/', '/register', '/login'];
    if (!user.authenticated && !allowedPaths.includes(location.pathname)) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return Layout ? <Layout>{children || <Outlet />}</Layout> : (children || <Outlet />);
};


export const CustomRoute = ({ layout: Layout, children }) => {
    const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) return <p>Loading...</p>;

  const publicPaths = ["/", "/login", "/register"];

  if (!user.authenticated && !publicPaths.includes(location.pathname)) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user.authenticated && publicPaths.includes(location.pathname)) {
    return <Navigate to="/dashboard" replace />;
  }

  return Layout ? <Layout>{children || <Outlet />}</Layout> : (children || <Outlet />);
};

export const PrivateRoute2 = ({ layout: Layout, children }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) return <p>loading...</p>;
    if (user.authenticated) {
        return <Navigate to="/dashboard" />;
    }

    return Layout ? (
        <Layout>
            {children || <Outlet />}
        </Layout>
    ) : (
        children || <Outlet />
    );
};

export const AdminPrivateRoute = ({ layout: Layout, children }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) return <p>loading...</p>;
    if (user.authenticated) {
        if (user.user.is_superuser || user.user.is_staff) {
            return children;
        }
        return <Navigate to="/dashboard" />;
    }

    return Layout ? (
        <Layout>
            {children || <Outlet />}
        </Layout>
    ) : (
        children || <Outlet />
    );
};

export default PrivateRoute;