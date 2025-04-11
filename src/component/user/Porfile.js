import { useParams } from 'react-router-dom';
import './user.css';
import { useContext, useEffect, useRef, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Avatar, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField } from '@mui/material';
import axiosInstance from '../../Axios';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import formatYoutubeTime from '../date-time/formatYoutubeTime';
import { Error404 } from '../no-data/Error404';
import DefaultProgress from '../progress/Default';
import { Error } from '../no-data/Error';
import EditIcon from '@mui/icons-material/Edit';
import { useSnackbar } from 'notistack';
import DevicesTable from '../tables/DevicesTable';
import LocalPoliceIcon from '@mui/icons-material/LocalPolice';
import ShieldIcon from '@mui/icons-material/Shield';
import { Helmet } from 'react-helmet';
import CustomLinearProgress from '../progress/LinerProgress';

export default function Profile() {
    const avatarRef = useRef();
    const params = useParams();
    // current user
    const { user, loading } = useContext(AuthContext);
    const [loadingUpdate, setLoadingUpdate] = useState(false);
    const [profileData, setProfileData] = useState(null);
    const [profileDataForm, setProfileDataForm] = useState({
        full_name: "",
        email: "",
        bio: ""
    });
    const isMyProfile = user.user.profile.profile_id === params.id;

    // to visited user
    const [loadingUserVisited, setLoadingUserVisited] = useState(true);
    const [visitedUserErrors, setVisitedUserErrors] = useState(false);
    const getVisitedUserData = async () => {
        setLoadingUserVisited(true);
        try {
            const response = await axiosInstance.get(`/users/profile/${params.id}/`);
            console.log(response.data);
            setProfileData(response.data);
            setProfileDataForm({
                full_name: response.data.full_name,
                email: response.data.email,
                bio: response.data.bio,
            });
        } catch (error) {
            setVisitedUserErrors(true);
        } finally {
            setLoadingUserVisited(false);
        }
    }

    // avatar change
    const handleClickAvatar = () => avatarRef.current?.click();

    const changeUserAvatar = async (e) => {
        setLoadingUpdate(true);
        const { files } = e.target;
        const file = files[0];
        if (!file) return;
        const formData = new FormData();
        if (file instanceof File) {
            formData.append('avatar', file);
        }
        try {
            const response = await axiosInstance.put(`/users/profile/${profileData.profile_id}/change-avatar/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            getVisitedUserData();
            handleClickVariant("تم تحديث الصورة الشخصية بنجاح", "success");
        } catch (error) {
            console.error(error);
            handleClickVariant("فشل في تحديث الصورة", "error");
        }finally{setLoadingUpdate(false)}
    };

    // dialog
    const [open, setOpen] = useState(false);
    const [formErrors, setFormErrors] = useState({
        full_name: { catch: false, msg: '' },
        email: { catch: false, msg: '' },
    });
    const [sendButtonDisabled, setSendButtonDisabled] = useState(false);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfileDataForm({ ...profileDataForm, [name]: value });

        let errors = { ...formErrors };

        if (name === "full_name") {
            errors.full_name = value.trim().length < 3
                ? { catch: true, msg: "الاسم يجب أن يكون 3 أحرف على الأقل" }
                : { catch: false, msg: "" };
        }

        if (name === "email") {
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            errors.email = !emailRegex.test(value)
                ? { catch: true, msg: "البريد الإلكتروني غير صالح" }
                : { catch: false, msg: "" };
        }

        setFormErrors(errors);
        setSendButtonDisabled(Object.values(errors).some(error => error.catch));
    };

    const handleClickOpen = () => {
        setOpen(true);
        setProfileDataForm({
            full_name: profileData.full_name,
            email: profileData.email,
            bio: profileData.bio,
        });
        setFormErrors(
            {
                full_name: { catch: false, msg: '' },
                email: { catch: false, msg: '' },
            }
        );
    };

    const handleClose = () => {
        setOpen(false);
    };


    // snackbar
    const { enqueueSnackbar } = useSnackbar();
    const handleClickVariant = (msg, variant) => {
        enqueueSnackbar(msg, { variant, anchorOrigin: { vertical: "top", horizontal: "right" } });
    };

    const submitChangeProfileData = async () => {
        setLoadingUpdate(true);
        const formData = new FormData();
        formData.append('full_name', profileDataForm.full_name);
        formData.append('email', profileDataForm.email);
        formData.append('bio', profileDataForm.bio);
        try {
            await axiosInstance.put(`/users/profile/${profileData.profile_id}/update/`, formData);
            handleClose();
            getVisitedUserData();
            handleClickVariant("تم تحديث الملف الشخصي بنجاح", "success");
        } catch (error) {
            console.error(error);
            handleClickVariant("فشل في تحديث البيانات الشخصية", "error");
        }finally{setLoadingUpdate(false);}
    }

    useEffect(() => {
        getVisitedUserData();
    }, [params.id]);

    if (loadingUserVisited) {
        return <DefaultProgress sx={{ width: '100%', height: '80vh', display: 'flex' }} />;
    }
    if (visitedUserErrors) {
        return <Error imgStyle={{ width: '350px' }} msg="لقد حدث خطأ" retry={{ msg: 'إعادة المحاولة', onClick: () => { getVisitedUserData() } }} />

    }
    if (!profileData) {
        return <Error404 msg="هذا الملف الشخصي غير متاح" />
    }
    return (
        <>
            <Helmet>
                <title>Engineering Sozy | الملف الشخصي</title>
            </Helmet>
            <CustomLinearProgress loading={loadingUpdate} />
            <h3 dir='rtl' className='w-100 text-start'>{isMyProfile ? `مرحبا، ${profileData.full_name}` : `${profileData.profile_id}`}</h3>
            <div className='profile-page w-100 d-flex flex-column gap-4 justify-content-center align-items-center mt-5'>
                <div className='sec-1 w-100 d-flex flex-column justify-content-center align-items-center'>
                    <div className='position-relative'>
                        <Avatar
                            className='profile-avatar'
                            sx={{ width: 140, height: 140, marginBottom: 2 }}
                            src={profileData.avatar}
                        />
                        {
                            isMyProfile && <div className='change-avatar-btn'>
                                <IconButton
                                    size="small"
                                    className="text-gray-400 mt-1"
                                    sx={{
                                        fontSize: "13px",
                                        width: '50px',
                                        height: '50px',
                                        color: 'var(--main-blue-sky)',
                                        margin: 0,
                                        padding: 0,
                                    }}
                                    onClick={handleClickAvatar}
                                >
                                    <AddAPhotoIcon fontSize="large" />
                                </IconButton>
                                <input ref={avatarRef} enctype="multipart/form-data" accept="image/*" type='file' onChange={changeUserAvatar} name='avatar' hidden />
                            </div>
                        }
                    </div>
                    <h1 className='text-center'>
                        {profileData.full_name ? profileData.full_name : profileData.profile_id}
                        {
                            profileData.is_superuser === "True" ? <LocalPoliceIcon sx={{ fontSize: '1.8rem', margin: '0 5px 0 5px' }} /> :
                                profileData.is_staff === "True" && <ShieldIcon sx={{ fontSize: '1.8rem', margin: '0 5px 0 5px' }} />
                        }
                    </h1>
                    <div className='w-100 px-lg-0 px-sm-5 pt-2 px-md-5'>
                        <p className='text-center px-lg-0 px-sm-5 px-md-' style={{ whiteSpace: 'pre-wrap', fontSize: '1rem' }}>{profileData.bio ? profileData.bio : '------'}</p>
                    </div>
                </div>
                <div className="profile-content">
                    <div className="profile-section user-main-info w-100 personal-info fade-in m-0">
                        <table className="info-table">
                            <tbody>
                                <tr>
                                    <td className="info-label">الرقم التعريفي</td>
                                    <td className="info-value">{profileData.profile_id}</td>
                                </tr>
                                <tr>
                                    <td className="info-label">البريد الإلكتروني</td>
                                    <td className="info-value">{profileData.email}</td>
                                </tr>
                                <tr>
                                    <td className="info-label">تاريخ الإنضمام</td>
                                    <td className="info-value">{formatYoutubeTime(profileData.start_date)}</td>
                                </tr>
                                <tr>
                                    <td className="info-label">اخر تسجيل</td>
                                    <td className="info-value">{formatYoutubeTime(profileData.last_login)}</td>
                                </tr>
                                <tr>
                                    <td className="info-label">الرتبة</td>
                                    <td className="info-value">
                                        {
                                            profileData.is_superuser === "True" ? 'مسئول' :
                                                profileData.is_staff === "True" ? 'مساعد' : 'طالب'
                                        }
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    {
                        isMyProfile && <div className='w-100 p-0 m-0 fade-in' dir='rtl'>
                            <button onClick={handleClickOpen} className='edit-btn d-flex justify-content-between gap-1 align-items-center'>
                                <EditIcon />
                                تعديل
                            </button>
                        </div>
                    }
                    {
                        (
                            (isMyProfile && profileData.is_staff === "False" && profileData.is_superuser === "False") ||
                            (
                                !isMyProfile &&
                                (user.user.profile.is_staff === "True" || user.user.profile.is_superuser === "True") &&
                                profileData.is_staff === "False" &&
                                profileData.is_superuser === "False"
                            )
                        ) &&
                        profileData.subscribed_courses.length > 0 &&
                        <div className="profile-section courses-info fade-in">
                            <h2 className="section-title">الكورسات</h2>
                            <ul className="courses-list">
                                {profileData.subscribed_courses.map((course, index) => (
                                    <li key={index} className="course-item" style={{ fontSize: '1.2rem' }}>
                                        {course.title}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    }
                    {
                        (user.user.profile.is_superuser === "True" || user.user.profile.is_staff === "True") && <DevicesTable devices={profileData.devices} />
                    }

                </div>
            </div>
            <Dialog dir='rtl' open={open} onClose={handleClose} fullWidth maxWidth="sm">
                <DialogTitle>تعديل الملف الشخصي</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="الاسم"
                        type="text"
                        fullWidth
                        name="full_name"
                        value={profileDataForm.full_name}
                        onChange={handleChange}
                        error={formErrors.full_name.catch}
                        helperText={formErrors.full_name.msg}
                    />
                    <TextField
                        margin="dense"
                        label="البريد الإلكتروني"
                        type="email"
                        fullWidth
                        name="email"
                        value={profileDataForm.email}
                        onChange={handleChange}
                        error={formErrors.email.catch}
                        helperText={formErrors.email.msg}
                    />
                    <TextField
                        margin="dense"
                        label="السيرة الذاتية"
                        type="text"
                        fullWidth
                        name="bio"
                        multiline
                        rows={4}
                        value={profileDataForm.bio}
                        onChange={handleChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="inherit">إلغاء</Button>
                    <Button disabled={sendButtonDisabled} onClick={submitChangeProfileData} color="primary">حفظ</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}