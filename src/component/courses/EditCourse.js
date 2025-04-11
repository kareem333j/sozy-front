import { useEffect, useState } from 'react';
import { CustomTextAreaField, CustomTextField } from '../inputs/CustomFields'
import './course.css'
import CustomSwitchFiled from '../inputs/SwitchButton';
import { Breadcrumbs, Typography } from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import axiosInstance from '../../Axios';
import { useSnackbar } from 'notistack';
import CustomLinearProgress from '../progress/LinerProgress';
import { Helmet } from 'react-helmet';

export default function EditCourse() {
    const params = useParams();
    const courseId = params.id;
    const [loading, setLoading] = useState(true);
    const [sendButtonDisabled, setSendButtonDisabled] = useState(false);

    const [formErrors, setFormErrors] = useState({
        title: { catch: false, msg: '' },
    });
    const checkFormErrors = (updatedForm) => {
        const errors = {
            title: updatedForm.title.trim() ? { catch: false, msg: '' } : { catch: true, msg: 'عنوان الكورس مطلوب' },
        };
        setFormErrors(errors);
        setSendButtonDisabled(errors.title.catch);
    };
    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setDataForm((prev) => {
            const updatedForm = { ...prev, [name]: value };
            checkFormErrors(updatedForm);
            return updatedForm;
        });
    };

    const [dataForm, setDataForm] = useState({
        title: '',
        description: '',
        is_active: true,
    });

    // snackbar
    const { enqueueSnackbar } = useSnackbar();

    const handleClickVariant = (msg, variant) => {
        enqueueSnackbar(msg, { variant, anchorOrigin: { vertical: "top", horizontal: "right" } });
    };

    const getCourse = async () => {
        setLoading(true);
        const formData = new FormData();
        formData.append('title', dataForm.title);
        formData.append('description', dataForm.description);
        formData.append('is_active', dataForm.is_active);


        axiosInstance.get(`api/admin/courses/course/${courseId}`)
            .then((response) => {
                let data = response.data;
                setDataForm({
                    title: data.title,
                    description: data.description,
                    is_active: data.is_active,
                });
            })
            .catch(() => {
            })
            .finally(() => { setLoading(false) });
    }

    const sendForm = () => {
        setLoading(true);
        const formData = new FormData();
        formData.append('title', dataForm.title);
        formData.append('description', dataForm.description);
        formData.append('is_active', dataForm.is_active);


        axiosInstance.patch(`api/admin/courses/course/${courseId}/edit`, formData)
            .then(() => {
                handleClickVariant('تم حفظ التعديلات بنجاح', 'success');
            })
            .catch((err) => {
                handleClickVariant('لقد حدث خطأ', 'error');
            })
            .finally(() => { setLoading(false) });
    }

    const handleFormSubmit = (e) => {
        e.preventDefault();
        sendForm();
    }

    useEffect(() => {
        getCourse();
    }, [courseId]);

    return (
        <>
            <Helmet>
                <title>Engineering Sozy | تعديل الكورس</title>
            </Helmet>
            <CustomLinearProgress loading={loading} />
            <Breadcrumbs aria-label="breadcrumb" dir='rtl'>
                <Link underline="hover" style={{ color: 'var(--main-50)' }} to="/courses">
                    الكورسات
                </Link>
                <Link
                    underline="hover"
                    to='/courses/all courses'
                    style={{ color: 'var(--main-50)' }}
                >
                    جميع الكورسات
                </Link>
                <Typography sx={{ color: 'text.primary' }}><span>{dataForm.title}</span></Typography>
                <Typography sx={{ color: 'text.primary' }}><span>تعديل</span></Typography>
            </Breadcrumbs>
            <div className='d-flex course-admin-page w-100 justify-content-center align-items-center flex-column pt-5'>
                <form className="form-container w-100 d-flex gap-4 flex-column justify-content-center align-items-center" onSubmit={handleFormSubmit}>
                    <CustomTextField
                        required
                        label='عنوان الكورس'
                        value={dataForm.title}
                        name='title'
                        onChange={handleFormChange}
                        error={formErrors.title.catch}
                        helperText={formErrors.title.msg}
                        sx={{ width: '100%' }}
                    />
                    <CustomTextAreaField
                        label='الوصف'
                        rows={6}
                        value={dataForm.description}
                        name='description'
                        onChange={handleFormChange}
                        sx={{ width: '100%' }}
                    />
                    <CustomSwitchFiled
                        label='تفعيل الكورس'
                        checked={dataForm.is_active}
                        onChange={(e) => setDataForm({ ...dataForm, is_active: !dataForm.is_active })}
                        sx={{ width: '100%', padding: '10px', paddingRight: '15px', borderRadius: '5px', justifyContent: 'space-between', direction: 'ltr', margin: 0, backgroundColor: "var(--main-shadow)" }}
                    />
                    <div className='submit-btn'>
                        <button type='submit' className={`save-btn ${sendButtonDisabled ? 'disabled' : ''}`}>حفظ التعديلات</button>
                    </div>
                </form>
            </div>
        </>
    )
}