// في مسار: src/utils/PrivateRoute.js
import React, { useContext } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import AccountSuspended from '../component/user/AccountSuspended';

const ALLOWED_PATHS_FOR_SUSPENDED = ['/logout', '/account-suspended'];

const PrivateRoute = ({ layout: Layout, children }) => {
    const { user, loading } = useContext(AuthContext);
    const location = useLocation();

    if (loading) return <p>loading...</p>;

    if (user.authenticated && user.user?.profile?.is_active === false && 
        !ALLOWED_PATHS_FOR_SUSPENDED.includes(location.pathname)) {
        return <AccountSuspended />;
    }

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

    // إذا كان الحساب غير مفعل ولا يحاول الوصول إلى مسار مسموح
    if (user.authenticated && user.user?.profile?.is_active === false && 
        !ALLOWED_PATHS_FOR_SUSPENDED.includes(location.pathname)) {
        return <AccountSuspended />;
    }

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
    
    // إذا كان الحساب غير مفعل ولا يحاول الوصول إلى مسار مسموح
    if (user.authenticated && user.user?.profile?.is_active === false && 
        !ALLOWED_PATHS_FOR_SUSPENDED.includes(window.location.pathname)) {
        return <AccountSuspended />;
    }

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
    
    // إذا كان الحساب غير مفعل ولا يحاول الوصول إلى مسار مسموح
    if (user.authenticated && user.user?.profile?.is_active === false && 
        !ALLOWED_PATHS_FOR_SUSPENDED.includes(window.location.pathname)) {
        return <AccountSuspended />;
    }

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