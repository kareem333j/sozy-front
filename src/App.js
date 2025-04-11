import { Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import Home from './component/Home/Home';
import Dashboard from './component/dashboard/Dashboard';
import { Register } from './component/auth/Register';
import { Login } from './component/auth/Login';
import { Courses } from './component/courses/Courses';
import { DashboardPage } from './component/dashboard/DashboardPage';
import { AdminPrivateRoute, CustomRoute } from './utils/PrivateRoute';
import { Course } from './component/courses/Course';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from './context/AuthContext';
import { Logout } from './component/auth/Logout';
import Profile from './component/user/Porfile';
import { createTheme, ThemeProvider } from '@mui/material';
import VideoPage from './component/videos/video-components/VideoPage';
import { SnackbarProvider } from 'notistack';
import EditVideo from './component/videos/video-components/EditVideo';
import AddVideo from './component/videos/video-components/AddVideo';
import AddCourse from './component/courses/AddCourse';
import AllCourses from './component/courses/AllCourses';
import EditCourse from './component/courses/EditCourse';
import Subscriptions from './component/users/Subscriptions';
import ManageUsers from './component/users/ManageUsers';
import MainLoading from './component/progress/MainLoading';
import { Error404 } from './component/no-data/Error404';
import AccountSuspended from './component/user/AccountSuspended';
import { AddSubscription } from './component/users/AddSubscription';

const theme = createTheme({
  typography: {
    fontFamily: `'Cairo', sans-serif !important`,
  },
});

function App() {
  const mode = window.localStorage.getItem('toolpad-mode');
  const { user, loading } = useContext(AuthContext);
  const [loadingPage, setLoadingPage] = useState(true);
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoadingPage(false);
  }, [location]);

  if (loading) return <MainLoading />;
  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider maxSnack={3}>
        {loadingPage ? <MainLoading /> : null}
        <div className="App">
          <Routes>
            <Route path="*" element={<CustomRoute>
              <div style={{backgroundColor:'#121212', color:'#fff'}} className='w-100 d-flex justify-content-center align-items-center vh-100'>
                <Error404 msg={`لايوجد صفحة في هذا المسار   "${location.pathname}"`} />
              </div>
            </CustomRoute>} />
            {/* Home route */}
            <Route path="/" element={<CustomRoute><Home /></CustomRoute>} />

            {/* dashboard */}
            <Route path="/dashboard/*" element={<CustomRoute layout={Dashboard} />}>
              <Route index element={<DashboardPage />} />
            </Route>
            <Route path="courses/" element={<CustomRoute layout={Dashboard} />}>
              <Route index element={<Courses />} />
              <Route path="all courses" element={<AllCourses />} />
              <Route path="add course" element={<AddCourse />} />
              <Route path="course/:id/edit" element={<EditCourse />} />
              <Route path=":id" element={<Course />} />
              <Route path=":name/:id" element={<VideoPage />} />
              {/* for admin */}
              <Route path="add video" element={<AdminPrivateRoute><AddVideo /></AdminPrivateRoute>} />
              <Route path=":name/:id/edit" element={<AdminPrivateRoute><EditVideo /></AdminPrivateRoute>} />
            </Route>

            {/* user */}
            <Route path="/profile/" element={<CustomRoute layout={Dashboard} />}>
              <Route path=':id' element={<Profile />} />
            </Route>

            {/* users */}
            <Route path="users/" element={<CustomRoute layout={Dashboard} />}>
              <Route index element={<ManageUsers />} />
              <Route path="manage" element={<ManageUsers />} />
              <Route path="subscriptions" element={<Subscriptions />} />
              <Route path="subscriptions/add" element={<AddSubscription />} />
            </Route>

            {/* auth */}
            <Route path="/register" element={<CustomRoute><Register /></CustomRoute>} />
            <Route path="/login" element={<CustomRoute><Login /></CustomRoute>} />
            <Route path="/logout" element={<CustomRoute />} >
              <Route index element={<Logout />} />
            </Route>

            <Route path="/account-suspended" element={<AccountSuspended />} />
          </Routes>
        </div>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;
