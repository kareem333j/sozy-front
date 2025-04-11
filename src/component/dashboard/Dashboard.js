import * as React from 'react';
import { extendTheme, styled } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { PageContainer } from '@toolpad/core';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import SchoolIcon from '@mui/icons-material/School';
import Logo from '../../assets/images/logos/2.png';
import LogoutIcon from '@mui/icons-material/Logout';
import { AuthContext } from '../../context/AuthContext';
import { Avatar } from '@mui/material';
import axiosInstance from '../../Axios';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import AddBoxIcon from '@mui/icons-material/AddBox';
import GroupIcon from '@mui/icons-material/Group';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';



export default function Dashboard(props) {
    const { user } = React.useContext(AuthContext);
    const useData = user.user;
    const [coursesOptions, setCoursesOptions] = React.useState([]);
    const [allCourses, setAllCourses] = React.useState([]);
    const [loadingList, setLoadingList] = React.useState(true);

    const getCoursesOptions = React.useCallback(async () => {
        try {
            const response = await axiosInstance.get('/api/courses_list/options');
            setCoursesOptions(response.data);
        } catch (error) { }
        finally {
            setLoadingList(false);
        }
    }, []);

    const getAllCourses = React.useCallback(async () => {
        try {
            const response = await axiosInstance.get('/api/admin/courses_list/options');
            setAllCourses(response.data);
        } catch (error) { }
        finally {
            setLoadingList(false);
        }
    }, []);

    React.useEffect(() => {
        if (useData.is_superuser || useData.is_staff) {
            getAllCourses();
        } else {
            getCoursesOptions();
        }
    }, [useData.is_superuser, useData.is_staff, getCoursesOptions, getAllCourses]);



    const NAVIGATION = [
        {
            kind: 'header',
            title: 'العناصر الرئيسية',
        },
        {
            segment: 'dashboard',
            title: 'الرئيسية',
            icon: <DashboardIcon />,
        },
        {
            segment: 'courses',
            title: 'الكورسات',
            icon: <SchoolIcon />,
            children: useData.is_superuser || useData.is_staff ? [
                {
                    segment: encodeURIComponent('all courses'),
                    title: 'جميع الكورسات',
                    icon: <VideoLibraryIcon />,
                },
                {
                    segment: encodeURIComponent('add course'),
                    title: 'إضافة كورس جديد',
                    icon: <LibraryAddIcon />,
                },
                {
                    segment: encodeURIComponent('add video'),
                    title: 'إضافة فيديو جديد',
                    icon: <AddBoxIcon />,
                },
            ] : !loadingList
                ? coursesOptions.map((e) => ({
                    segment: encodeURIComponent(e.title),
                    title: (e.title).toLowerCase(),
                    icon: <VideoLibraryIcon />,
                }))
                : []
        },
        {
            kind: 'divider',
        },
        {
            kind: 'header',
            title: 'المستخدم',
        },
        {
            segment: `profile/${user.user.profile.profile_id}`,
            title: `الملف الشخصي`,
            icon: <Avatar src={user.user.profile.avatar} sx={{ backgroundColor: 'var(--main-back) !important', width: 28, height: 28, padding: 0, marginLeft: "-3px" }} />,
        },
        {
            segment: 'logout',
            title: "نسجيل الخروج",
            icon: <LogoutIcon />,
        }
    ];

    if (useData.is_superuser || useData.is_staff) {
        NAVIGATION.splice(3,0,{
            segment: 'users',
            title: 'المستخدمين',
            icon: <GroupIcon />,
            children: [
                {
                    segment: 'manage',
                    title: 'إدارة المستخدمين',
                    icon: <ManageAccountsIcon />,
                },
                {
                    segment: 'subscriptions',
                    title: 'الإشتراكات',
                    icon: <SubscriptionsIcon />,
                },
            ]
        })
    }



    const demoTheme = extendTheme({
        colorSchemes: { light: true, dark: true },
        colorSchemeSelector: 'class',
        breakpoints: {
            values: {
                xs: 0,
                sm: 600,
                md: 600,
                lg: 1200,
                xl: 1536,
            },
        },
    });


    function useDemoRouter(initialPath) {
        const location = useLocation();
        const navigate = useNavigate();

        const router = React.useMemo(() => {
            return {
                pathname: location.pathname,
                searchParams: new URLSearchParams(),
                navigate: (path) => {
                    if (path !== location.pathname) {
                        navigate(path);
                    }
                },
            };
        }, [location, navigate]);

        return router;
    }

    const router = useDemoRouter('/dashboard');

    return (
        <AppProvider
            navigation={NAVIGATION}
            router={router}
            theme={demoTheme}
        >
            <DashboardLayout
                branding={
                    {
                        title: "Engineering Sozy",
                        logo: <img className='p-0' src={Logo} alt="App Logo" style={{ width: 30, height: 30, marginTop: 5 }} />,
                        homeUrl: "/dashboard",
                    }
                }
            >
                <PageContainer>
                    <Outlet />
                </PageContainer>
            </DashboardLayout>
        </AppProvider>
    );
}
