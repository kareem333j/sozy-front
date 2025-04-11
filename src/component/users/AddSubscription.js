import React, { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { Link } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import CustomLinearProgress from '../progress/LinerProgress';
import CustomSwitchFiled from '../inputs/SwitchButton';
import { CustomAutocompleteField, CustomSelectField } from '../inputs/CustomFields';
import axiosInstance from '../../Axios';
import DefaultProgress from '../progress/Default';
import { Helmet } from 'react-helmet';

export const AddSubscription = () => {
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(false);
    const [sendButtonDisabled, setSendButtonDisabled] = useState(true);
    const [formErrors, setFormErrors] = useState({
        user: { catch: false, msg: '' },
        course: { catch: false, msg: '' },
    });
    const [dataSubscription, setDataSubscription] = useState({
        user: "",
        course: "",
        is_active: true
    });
    const [allUsers, setAllUsers] = useState([]);
    const [allCourses, setAllCourses] = useState([]);

    const getUsers = React.useCallback(async () => {
        setLoadingData(true);
        try {
            const res = await axiosInstance.get('api/admin/courses/subscriptions/allUsers');
            setAllUsers(res.data);
        } catch {
            handleClickVariant('لقد حدث خطأ اعد تحميل الصفحة', 'error');
        }
        finally { setLoadingData(false) }
    }, []);

    const getCourses = React.useCallback(async () => {
        setLoadingData(true);
        try {
            const res = await axiosInstance.get('api/admin/courses/subscriptions/allCourses');
            setAllCourses(res.data);
        } catch {
            handleClickVariant('لقد حدث خطأ اعد تحميل الصفحة', 'error');
        }
        finally { setLoadingData(false) }
    }, []);

    const checkFormErrors = (updatedForm) => {
        const errors = {
            user: updatedForm.user ? { catch: false, msg: '' } : { catch: true, msg: 'يجب اخيار مشترك' },
            course: updatedForm.course ? { catch: false, msg: '' } : { catch: true, msg: 'يجب اختيار كورس' },
        };
        setFormErrors(errors);
        setSendButtonDisabled(errors.user.catch || errors.course.catch);
        return errors.user.catch || errors.course.catch;
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setDataSubscription((prev) => {
            const updatedForm = { ...prev, [name]: value };
            checkFormErrors(updatedForm);
            return updatedForm;
        });
    };

    const sendForm = () => {
        const formData = new FormData();
        formData.append('profile_id', dataSubscription.user);
        formData.append('course', dataSubscription.course);
        formData.append('is_active', JSON.stringify(dataSubscription.is_active));

        if (!checkFormErrors(dataSubscription)) {
            setLoading(true);
            axiosInstance.post(`api/admin/courses/subscriptions/add/`, formData)
                .then(() => {
                    handleClickVariant('تم إضافة الإشتراك بنجاح', 'success');
                    setDataSubscription({
                        user: "",
                        course: "",
                        is_active: true
                    })
                    setSendButtonDisabled(true);
                })
                .catch((err) => {
                    if (err.status === 400) {
                        handleClickVariant(err.response.data.detail, 'error');
                    } else {
                        handleClickVariant('لقد حدث خطأ', 'error');
                    }
                })
                .finally(() => { setLoading(false) });
        }
    }

    const handleFormSubmit = (e) => {
        e.preventDefault();
        checkFormErrors(dataSubscription);
        sendForm();
    };

    // snackbar
    const { enqueueSnackbar } = useSnackbar();

    const handleClickVariant = (msg, variant) => {
        enqueueSnackbar(msg, { variant, anchorOrigin: { vertical: "top", horizontal: "right" } });
    };

    useEffect(() => {
        getCourses();
        getUsers();
    }, [getUsers, getCourses])

    if (loadingData) {
        return <DefaultProgress sx={{ width: '100%', height: '70vh', display: 'flex' }} />
    }
    return (
        <>
            <Helmet>
                <title>Engineering Sozy | إضافة مشترك جديد</title>
            </Helmet>
            <CustomLinearProgress loading={loading} />
            <div role="presentation">
                <Breadcrumbs sx={{ direction: 'rtl' }} aria-label="breadcrumb">
                    <Typography sx={{ color: 'text.primary' }}>المستخدمين</Typography>
                    <Link
                        underline="hover"
                        color="inherit"
                        to={'/users/subscriptions'}
                        style={{ color: 'var(--main-50)' }}
                    >
                        الإشتراكات
                    </Link>
                    <Typography sx={{ color: 'text.primary' }}>إضافة إشتراك جديد</Typography>
                </Breadcrumbs>
            </div>
            <div className="form-box w-100">
                <form className="form-container d-flex flex-column gap-1 mt-5 justify-content-center align-items-center" onSubmit={handleFormSubmit}>
                    <Typography className='w-100 text-end' variant="h6">إضافة مشترك جديد</Typography>
                    <CustomAutocompleteField
                        data={allUsers}
                        value={dataSubscription.user}
                        handleChange={handleFormChange}
                        label="المشترك"
                        name="user"
                        required={true}
                        error={formErrors.user.catch}
                        helperText={formErrors.user.msg}
                        is_users={true}
                    />
                    <CustomAutocompleteField
                        data={allCourses}
                        value={dataSubscription.course}
                        handleChange={handleFormChange}
                        label="الكورس المشترك فيه"
                        name="course"
                        required={true}
                        error={formErrors.course.catch}
                        helperText={formErrors.course.msg}
                    />
                    <CustomSwitchFiled
                        label='تفعيل الإشتراك'
                        checked={dataSubscription.is_active}
                        onChange={(e) => setDataSubscription({ ...dataSubscription, is_active: !dataSubscription.is_active })}
                        sx={{ width: '100%', padding: '10px', paddingRight: '15px', borderRadius: '5px', justifyContent: 'space-between', direction: 'ltr', margin: 0, backgroundColor: "var(--main-shadow)" }}
                    />
                    <div className='submit-btn w-100'>
                        <button type='submit' className={`save-btn w-100 mt-3 ${sendButtonDisabled ? 'disabled' : ''}`}>حفظ</button>
                    </div>
                </form>
            </div>
        </>
    )
}

