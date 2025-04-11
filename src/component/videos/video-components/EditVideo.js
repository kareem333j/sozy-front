import { Avatar, Box, Breadcrumbs, Skeleton, Typography } from '@mui/material';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import formatYoutubeTime from '../../date-time/formatYoutubeTime';
import './edit-video.css';
import axiosInstance from '../../../Axios';
import { CustomSelectField, CustomTextAreaField, CustomTextField } from '../../inputs/CustomFields';
import AddIcon from '@mui/icons-material/Add';
import { Error } from '../../no-data/Error';
import DefaultProgress from '../../progress/Default';
import { useSnackbar } from "notistack";
import CustomLinearProgress from '../../progress/LinerProgress';
import CustomSwitchFiled from '../../inputs/SwitchButton';
import { Helmet } from 'react-helmet';

export default function EditVideo() {
    const { name: courseName, id: videoId } = useParams();
    const [loading, setLoading] = useState(true);
    const [sendLoading, setSendLoading] = useState(false);
    const [videoData, setVideoData] = useState(null);
    const [error, setError] = useState(null);
    const [sendButtonDisabled, setSendButtonDisabled] = useState(true);
    const [dataForm, setDataForm] = useState({
        title: '',
        course: '',
        cover: null,
        description: '',
        videoEmbed: '',
        is_active: true,
        priority: 1,
    });
    const [formErrors, setFormErrors] = useState({
        title: { catch: false, msg: '' },
        videoEmbed: { catch: false, msg: '' },
        priority: { catch: false, msg: '' },
        course: { catch: false, msg: '' },
    });
    const imageRef = useRef();

    const checkFormErrors = (updatedForm) => {
        const errors = {
            title: updatedForm.title.trim() ? { catch: false, msg: '' } : { catch: true, msg: 'عنوان الفيديو مطلوب' },
            course: updatedForm.course ? { catch: false, msg: '' } : { catch: true, msg: 'يجب اختيار الكورس التابع له الفيديو' },
            videoEmbed: updatedForm.videoEmbed.trim() ? { catch: false, msg: '' } : { catch: true, msg: 'كود الفيديو مطلوب' },
            priority: updatedForm.priority > 0 ? { catch: false, msg: '' } : { catch: true, msg: 'لا يمكن ان تكون اولوية الفيديو اقل من صفر' },
        };
        setFormErrors(errors);
        setSendButtonDisabled(errors.title.catch || errors.videoEmbed.catch || errors.course.catch || errors.priority.catch);
    };

    // 
    const [allCourses, setAllCourses] = React.useState([]);
    const getAllCourses = React.useCallback(async () => {
        setLoading(true);
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

    const handleFormChange = (e) => {
        const { name, value, files } = e.target;
        setDataForm((prev) => {
            const updatedForm = { ...prev, [name]: name === 'cover' ? files[0] ? files[0] : videoData.cover ? videoData.cover : null : value };
            checkFormErrors(updatedForm);
            return updatedForm;
        });
    };

    const getVideoMainData = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await axiosInstance.get(`api/video/${videoId}`);
            setVideoData(data);
            const initialForm = {
                title: data.title || '',
                course: data.course || '',
                cover: data.cover || null,
                description: data.description || '',
                videoEmbed: data.embed_code || '',
                is_active: data.is_active,
                priority: data.priority || 1
            };
            setDataForm(initialForm);
            checkFormErrors(initialForm);
        } catch (err) {
            setError("Can't get video..!");
        } finally {
            setLoading(false);
        }
    }, [videoId]);

    const handleChangeImage = () => imageRef.current?.click();

    const handleFormSubmit = (e) => {
        e.preventDefault();
        checkFormErrors(dataForm);
        sendForm();
    };

    const sendForm = () => {
        setSendLoading(true);
        const formData = new FormData();
        formData.append('title', dataForm.title);
        formData.append('course', dataForm.course);
        formData.append('description', dataForm.description);
        formData.append('is_active', dataForm.is_active);
        formData.append('embed_code', dataForm.videoEmbed);
        formData.append('priority', dataForm.priority ? dataForm.priority : 0);

        if (dataForm.cover instanceof File) {
            formData.append('cover', dataForm.cover);
        }
        axiosInstance.patch(`api/admin/video/${videoId}/edit`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
            .then((response) => {
                handleClickVariant('تم حفظ التعديلات بنجاح', 'success');
            })
            .catch(() => {
                handleClickVariant('لقد حدث خطأ', 'error');
            })
            .finally(() => { setSendLoading(false) });
    }

    // snackbar
    const { enqueueSnackbar } = useSnackbar();

    const handleClickVariant = (msg, variant) => {
        enqueueSnackbar(msg, { variant, anchorOrigin: { vertical: "top", horizontal: "right" } });
    };

    useEffect(() => {
        getVideoMainData();
        getAllCourses();
    }, [getVideoMainData,getAllCourses]);

    if (loading) {
        return <DefaultProgress sx={{ width: '100%', minHeight: '70vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }} />
    }
    if (error) {
        return <Error retry={{ msg: 'Retry', onClick: getVideoMainData }} msg="Something went wrong.!" imgStyle={{ width: '230px', padding: '0', backgroundColor: '#90CAF9', borderRadius: '100%' }} />
    }
    return (
        <>
            <Helmet>
                <title>Engineering Sozy | تعديل الفيديو</title>
            </Helmet>
            <CustomLinearProgress loading={sendLoading} />
            {!loading ? (
                <Breadcrumbs aria-label="breadcrumb">
                    <Link style={{ color: 'var(--main-50)' }} to="/courses">الكورسات</Link>
                    <Link style={{ color: 'var(--main-50)' }} to={`/courses/${courseName}`}>{courseName}</Link>
                    <Link style={{ color: 'var(--main-50)' }} to={`/courses/${courseName}/${videoId}`}>{videoData?.title}</Link>
                    <Typography sx={{ color: 'text.primary' }}>تعديل</Typography>
                </Breadcrumbs>
            ) : (
                <>جاري التحميل..</>
            )}

            <div className="edit-video-page mt-5 d-flex">
                <div className="video-card-box">
                    <Box className="video-card">
                        <div className={`video-container position-relative ${dataForm.cover ? 'video-image' : 'no-image'}`}>
                            {loading ? (
                                <Skeleton variant="rectangular" width="100%" height="100%" />
                            ) : (
                                <img alt='' src={dataForm.cover instanceof File ? URL.createObjectURL(dataForm.cover) : dataForm.cover || videoData?.cover} />
                            )}
                            <div className='choose-cover' onClick={handleChangeImage}>
                                <AddIcon sx={{ width: '50px', height: '50px' }} />
                                <h4>إضغط لإضافة صورة</h4>
                                <p>1600 x 900</p>
                            </div>
                        </div>

                        {videoData && (
                            <Box sx={{ mt: 1 }}>
                                <Typography gutterBottom variant="body2" sx={{ color: 'var(--main-color)', fontSize: '1.4em', maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {dataForm.title}
                                </Typography>
                                <Typography className="d-flex align-items-center gap-2 mb-1" variant="caption" sx={{ display: 'block', color: 'text.secondary' }}>
                                    <Avatar sx={{ width: 20, height: 20 }} src={videoData.author.avatar} />
                                    {videoData.author.full_name || videoData.author.profile_id}
                                </Typography>
                                <Typography className='d-flex gap-1' variant="caption" sx={{ color: 'text.secondary' }}>
                                    <span dir='rtl'>{`${videoData.more_info.views.length}`} مشاهدة</span>
                                    •
                                    <span>{`${formatYoutubeTime(videoData.created_dt)}`}</span>
                                </Typography>
                            </Box>
                        )}
                    </Box>
                </div>

                <div className="form-box">
                    <form className="form-container d-flex gap-4 justify-content-center align-items-center" onSubmit={handleFormSubmit}>
                        <Typography variant="h6">Edit Video Details</Typography>
                        <CustomTextField
                            required
                            label='عنوان الفيديو'
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
                            inputProps={{ min: 1 }}
                            name='priority'
                            type='number'
                            onChange={handleFormChange}
                            error={formErrors.priority.catch}
                            helperText={formErrors.priority.msg}
                            sx={{ width: '100%' }}
                        />
                        <input ref={imageRef} name='cover' onChange={handleFormChange} type="file" accept="image/*" hidden />
                        <CustomSwitchFiled
                            label='تفعيل الفيديو'
                            checked={dataForm.is_active}
                            onChange={(e) => setDataForm({ ...dataForm, is_active: !dataForm.is_active })}
                            sx={{ width: '100%', padding: '10px', paddingRight: '15px', borderRadius: '5px', justifyContent: 'space-between', direction: 'ltr', margin: 0, backgroundColor: "var(--main-shadow)" }}
                        />
                        <div className='submit-btn'>
                            <button type='submit' className={`save-btn ${sendButtonDisabled ? 'disabled' : ''}`}>حفظ التعديلات</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
