import { Avatar, IconButton, Menu, MenuItem, Tooltip } from '@mui/material';
import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import formatYoutubeTime from '../../date-time/formatYoutubeTime';
import VideoEmbed from './VideoEmbed';
import { LoveBtn } from '../../custom buttons/LoveBtn';
import axiosInstance from '../../../Axios';
import EditIcon from '@mui/icons-material/Edit';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import { AuthContext } from '../../../context/AuthContext';
import { MoreActions } from '../../comment/CommetActions';
import Confirm from '../../dialogs/DialogForm_1';
import { useSnackbar } from "notistack";
import CustomLinearProgress from '../../progress/LinerProgress';

export const VideoMainData = ({ title, description = "", embedCode, videoId, author = { profile_id: 'None', cover: '', full_name: '' }, initialLikes = 0, is_liked_by_user, extraInfo = { created_dt: '', views: 0, setViews: () => { } } }) => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const defaultDescriptionLength = 100;
    const [maxDescriptionLetters, setMaxDescriptionLetters] = useState(defaultDescriptionLength);

    // video likes
    const [likes, setLikes] = useState(initialLikes);
    const [isLiked, setIsLiked] = useState(is_liked_by_user);

    const toggleLike = async () => {
        const newLikes = isLiked ? likes - 1 : likes + 1;
        setLikes(newLikes);
        setIsLiked(!isLiked);
        try {
            const response = await axiosInstance.patch(`/api/video/${videoId}/like`);
            if (response.status === 201) {
                setLikes(newLikes);
            }
        } catch (error) {
            setLikes(likes);
            setIsLiked(isLiked);
        }
    };

    // snackbar
    const { enqueueSnackbar } = useSnackbar();

    const handleClickVariant = (msg, variant) => {
        enqueueSnackbar(msg, { variant, anchorOrigin: { vertical: "top", horizontal: "right" } });
    };

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const [openAlert, setOpenAlert] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);
    const deleteVideo = async () => {
        setLoadingDelete(true);
        try {
            const response = await axiosInstance.delete(`/api/admin/video/${videoId}/delete`);
            if (response.status === 204) {
                handleClickVariant('تم حذف الفيديو بنجاح', 'success');
                navigate('/dashboard');
            }
        } catch (error) {
            handleClickVariant('لقد حدث خطأ', 'error');
        }finally {setLoadingDelete(true)}
    }

    return (
        <>
            <CustomLinearProgress loading={loadingDelete} />
            <div className="video-container position-relative">
                <VideoEmbed embedCode={embedCode} />
                {
                    user.user && (user.user.is_superuser || user.user.is_staff) &&
                    <div className='more actions'>
                        <Tooltip title="Video settings">
                            <IconButton
                                className='edit-btn'
                                onClick={handleClick}
                                aria-controls={open ? 'account-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={open ? 'true' : undefined}
                            >
                                <MoreVertIcon fontSize='medium' />
                            </IconButton>
                        </Tooltip>
                        <Menu
                            anchorEl={anchorEl}
                            id="account-menu"
                            open={open}
                            onClose={handleClose}
                            onClick={handleClose}
                            slotProps={{
                                paper: {
                                    elevation: 0,
                                    sx: {
                                        overflow: 'visible',
                                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                        mt: 1.5,
                                        '& .MuiAvatar-root': {
                                            width: 32,
                                            height: 32,
                                            ml: -0.5,
                                            mr: 1,
                                        },
                                        '&::before': {
                                            content: '""',
                                            display: 'block',
                                            position: 'absolute',
                                            top: 0,
                                            right: 14,
                                            width: 10,
                                            height: 10,
                                            bgcolor: 'background.paper',
                                            transform: 'translateY(-50%) rotate(45deg)',
                                            zIndex: 0,
                                        },
                                    },
                                },
                            }}
                            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                        >
                            <MenuItem component={Link} to='edit' className='d-flex gap-3' onClick={handleClose}>
                                <EditIcon /> تعديل
                            </MenuItem>
                            <MenuItem className='d-flex gap-3' onClick={() => {
                                setOpenAlert(true);
                            }}>
                                <DeleteIcon /> حذف
                            </MenuItem>
                        </Menu>
                    </div>
                }
            </div>

            <div className="video-info">
                <div className='title row mb-2 d-flex flex-column flex-md-row justify-content-between align-items-md-start p-0'>
                    <div className='col-12 col-md-9 pt-2'>
                        <h4>{title}</h4>
                    </div>
                    <div className='col-12 col-md-3 video-actions d-flex flex-row-reverse flex-md-row align-items-center justify-content-end p-0 justify-content-md-end'>
                        <span dir='rtl' style={{ fontSize: '1.2rem' }}>{likes} إعجاب</span>
                        <LoveBtn handleLikes={toggleLike} userLike={isLiked ? true : false} />
                    </div>
                </div>

                <div className='extra-info d-flex mb-3'>
                    <Link to={`/profile/${author.profile_id}`} className='author-info d-flex gap-2 align-items-center'>
                        <Avatar sx={{ width: 40, height: 40, color: 'var(--main-color)' }} src={author.avatar} />
                        <div className='d-flex align-items-center pt-2'>
                            <h5 className='author-name'>{author.full_name.length > 0 ? author.full_name : author.profile_id}</h5>
                        </div>
                    </Link>
                </div>
                <div className='more-info mb-5 d-flex flex-column'>
                    <div className='vid-info mb-0'>
                        <p className='d-flex gap-3'>
                            <span dir='rtl'>{extraInfo.views} مشاهدة</span>
                            <span>{formatYoutubeTime(extraInfo.created_dt)}</span>
                        </p>
                    </div>
                    {
                        description.length <= 0 ? <span style={{ fontStyle: 'italic' }}>لايوجد وصف..!</span> : <></>
                    }
                    <div className='description d-flex gap-2 flex-column mb-2'>
                        <span>{(description).substring(0, maxDescriptionLetters)}{(description.length > maxDescriptionLetters) ? "...." : null}</span>
                        {
                            (description.length > maxDescriptionLetters) ? <button onClick={() => setMaxDescriptionLetters(description.length)} className='more-btn'>رؤية المزيد<ExpandMoreIcon /></button> : <></>
                        }
                        {
                            (description.length > defaultDescriptionLength && defaultDescriptionLength < maxDescriptionLetters) ? <button onClick={() => setMaxDescriptionLetters(defaultDescriptionLength)} className='more-btn'>تقليص<ExpandLessIcon /></button> : <></>
                        }
                    </div>
                    <div>
                        <span style={{ color: 'var(--main-50)', fontSize: '0.9rem' }}>اخر تعديل :  {formatYoutubeTime(extraInfo.update_dt)}</span>
                    </div>
                </div>
            </div>
            <Confirm
                open={openAlert}
                onConfirm={() => {
                    deleteVideo();
                    setOpenAlert(false);
                }}
                onClose={() => setOpenAlert(false)}
                title="حذف الفديو"
                message="هل متأكد من حذف الفيديو ؟"
                cancelTitle="إلغاء"
                confirmTitle="نعم،حذف"
            />
        </>
    )
}
