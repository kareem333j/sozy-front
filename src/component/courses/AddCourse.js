import { useState } from 'react';
import { CustomTextAreaField, CustomTextField } from '../inputs/CustomFields'
import './course.css'
import CustomSwitchFiled from '../inputs/SwitchButton';
import { useSnackbar } from 'notistack';
import CustomLinearProgress from '../progress/LinerProgress';
import axiosInstance from '../../Axios';
import { Helmet } from 'react-helmet';

export default function AddCourse() {
    const [loading, setLoading] = useState(false);
    const [sendButtonDisabled, setSendButtonDisabled] = useState(true);

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

    const sendForm = () => {
        setLoading(true);
        const formData = new FormData();
        formData.append('title', dataForm.title);
        formData.append('description', dataForm.description);
        formData.append('is_active', dataForm.is_active);


        axiosInstance.post(`api/admin/courses/add`, formData)
            .then(() => {
                handleClickVariant('تم إضافة الكورس بنجاح', 'success');
                setDataForm({
                    title: '',
                    description: '',
                    is_active: true,
                });
                setSendButtonDisabled(true);
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
    return (
        <>
            <Helmet>
                <title>Engineering Sozy | إضافة كورس جديد</title>
            </Helmet>
            <CustomLinearProgress loading={loading} />
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
                        <button type='submit' className={`save-btn ${sendButtonDisabled ? 'disabled' : ''}`}>حفظ </button>
                    </div>
                </form>
            </div>
        </>

    )
}