import { Avatar, Box, Typography } from '@mui/material';
import React, { useContext, useEffect, useRef, useState } from 'react';
import './edit-video.css';
import axiosInstance from '../../../Axios';
import { CustomSelectField, CustomTextAreaField, CustomTextField } from '../../inputs/CustomFields';
import AddIcon from '@mui/icons-material/Add';
import { useSnackbar } from "notistack";
import CustomLinearProgress from '../../progress/LinerProgress';
import { AuthContext } from '../../../context/AuthContext';
import CustomSwitchFiled from '../../inputs/SwitchButton';
import { Helmet } from 'react-helmet';

export default function AddVideo() {
    const { user } = useContext(AuthContext);
    const userData = user.user;
    const [loading, setLoading] = useState(true);
    const [sendButtonDisabled, setSendButtonDisabled] = useState(true);
    const [dataForm, setDataForm] = useState({
        title: '',
        course: "",
        cover: null,
        description: '',
        videoEmbed: '',
        is_active: true,
        priority: 1,
    });
    const [formErrors, setFormErrors] = useState({
        title: { catch: false, msg: '' },
        course: { catch: false, msg: '' },
        priority: { catch: false, msg: '' },
        videoEmbed: { catch: false, msg: '' },
    });
    const imageRef = useRef();

    const checkFormErrors = (updatedForm) => {
        const errors = {
            title: updatedForm.title.trim() ? { catch: false, msg: '' } : { catch: true, msg: 'عنوان الفيديو مطلوب' },
            course: updatedForm.course ? { catch: false, msg: '' } : { catch: true, msg: 'يجب اختيار الكورس التابع له الفيديو' },
            priority: updatedForm.priority > 0 ? { catch: false, msg: '' } : { catch: true, msg: 'لا يمكن ان تكون اولوية الفيديو اقل من صفر' },
            videoEmbed: updatedForm.videoEmbed.trim() ? { catch: false, msg: '' } : { catch: true, msg: 'كود الفيديو مطلوب' },
        };
        setFormErrors(errors);
        setSendButtonDisabled(errors.title.catch || errors.videoEmbed.catch || errors.course.catch || errors.priority.catch);
    };

    const handleFormChange = (e) => {
        const { name, value, files } = e.target;
        setDataForm((prev) => {
            const updatedForm = { ...prev, [name]: name === 'cover' ? files[0] ? files[0] : null : value };
            checkFormErrors(updatedForm);
            return updatedForm;
        });
    };


    const handleChangeImage = () => imageRef.current?.click();

    const handleFormSubmit = (e) => {
        e.preventDefault();
        checkFormErrors(dataForm);
        sendForm();
        console.log(dataForm);
    };

    // 
    const [allCourses, setAllCourses] = React.useState([]);
    const getAllCourses = React.useCallback(async () => {
        try {
            const response = await axiosInstance.get('/api/admin/courses_list/options');
            setAllCourses(response.data);
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
        finally {
            setLoading(false);
        }
    }, []);


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
        formData.append('course', dataForm.course);
        formData.append('is_active', dataForm.is_active);
        formData.append('embed_code', dataForm.videoEmbed);
        formData.append('priority', dataForm.priority?dataForm.priority:1);

        if (dataForm.cover instanceof File) {
            formData.append('cover', dataForm.cover);
        }
        axiosInstance.post(`api/admin/video/add`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
            .then(() => {
                handleClickVariant('تم إضافة الفيديو بنجاح', 'success');
                setDataForm({
                    title: '',
                    course: "",
                    cover: null,
                    description: '',
                    videoEmbed: '',
                    is_active: true,
                    priority:1
                });
                setSendButtonDisabled(true);
            })
            .catch((err) => {
                handleClickVariant('لقد حدث خطأ', 'error');
            })
            .finally(() => { setLoading(false); console.log(dataForm) });
    }

    useEffect(() => {
        getAllCourses();
    }, [getAllCourses]);

    return (
        <>
            <Helmet>
                <title>Engineering Sozy | إضافة فيديو جديد</title>
            </Helmet>
            <CustomLinearProgress loading={loading} />
            <div className="edit-video-page mt-5 d-flex">
                <div className="video-card-box">
                    <Box className="video-card">
                        <div className={`video-container position-relative ${dataForm.cover ? 'video-image' : 'no-image'}`}>
                            <img alt='' src={dataForm.cover instanceof File ? URL.createObjectURL(dataForm.cover) : dataForm.cover || dataForm?.cover} />
                            <div className='choose-cover' onClick={handleChangeImage}>
                                <AddIcon sx={{ width: '50px', height: '50px' }} />
                                <h4>إضغط لإضافة صورة</h4>
                                <p>1600 x 900</p>
                            </div>
                        </div>

                        <Box sx={{ mt: 1 }}>
                            <Typography gutterBottom variant="body2" sx={{ color: 'var(--main-color)', fontSize: '1.4em', maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {dataForm.title}
                            </Typography>
                            <Typography className="d-flex align-items-center gap-2 mb-1" variant="caption" sx={{ display: 'block', color: 'text.secondary' }}>
                                <Avatar sx={{ width: 20, height: 20 }} src={userData.profile.avatar} />
                                {userData.profile.full_name || userData.profile.profile_id}
                            </Typography>
                            <Typography className='d-flex gap-1' variant="caption" sx={{ color: 'text.secondary' }}>
                                <span dir='rtl'>0 مشاهدة</span>
                                •
                                <span>الأن</span>
                            </Typography>
                        </Box>
                    </Box>
                </div>

                <div className="form-box">
                    <form className="form-container d-flex gap-4 justify-content-center align-items-center" onSubmit={handleFormSubmit}>
                        <Typography className='w-100' variant="h6">إضافة فيديو جديد</Typography>
                        <CustomTextField
                            required
                            label='عنوان الفديو'
                            value={dataForm.title}
                            name='title'
                            onChange={handleFormChange}
                            error={formErrors.title.catch}
                            helperText={formErrors.title.msg}
                            sx={{ width: '100%' }}
                        />
                        <CustomSelectField
                            data={allCourses}
                            value={dataForm.course}
                            handleChange={handleFormChange}
                            label="اختيار الكورس"
                            name="course"
                            required={true}
                            error={formErrors.course.catch}
                            helperText={formErrors.course.msg}
                        />
                        <CustomTextAreaField
                            label='الوصف'
                            rows={6}
                            value={dataForm.description}
                            name='description'
                            onChange={handleFormChange}
                            sx={{ width: '100%' }}
                        />
                        <CustomTextAreaField
                            required
                            label='كود الفيديو'
                            rows={8}
                            value={dataForm.videoEmbed}
                            name='videoEmbed'
                            onChange={handleFormChange}
                            error={formErrors.videoEmbed.catch}
                            helperText={formErrors.videoEmbed.msg}
                            sx={{ width: '100%' }}
                        />
                        <CustomTextField
                            required
                            label='أولوية الفديو'
                            value={dataForm.priority}
                            inputProps = {{min:1}}
                            name='priority'
                            type='number'
                            onChange={handleFormChange}
                            error={formErrors.priority.catch}
                            helperText={formErrors.priority.msg}
                            sx={{ width: '100%' }}
                        />

                        <input className='w-100' ref={imageRef} name='cover' onChange={handleFormChange} type="file" accept="image/*" hidden />
                        <CustomSwitchFiled
                            label='تفعيل الفيديو'
                            checked={dataForm.is_active}
                            onChange={(e) => setDataForm({ ...dataForm, is_active: !dataForm.is_active })}
                            sx={{ width: '100%', padding: '10px', paddingRight: '15px', borderRadius: '5px', justifyContent: 'space-between', direction: 'ltr', margin: 0, backgroundColor: "var(--main-shadow)" }}
                        />
                        <div className='submit-btn'>
                            <button type='submit' className={`save-btn ${sendButtonDisabled ? 'disabled' : ''}`}>حفظ</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
