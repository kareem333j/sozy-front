import React, { useEffect, useState, useCallback } from 'react';
import './video.css';
import { Breadcrumbs, Skeleton, Typography } from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import { CommentForm } from '../../comment/CommentForm';
import axiosInstance from '../../../Axios';
import { VideoMainData } from './VideoMainData';
import Comment from '../../comment/CommentBody';
import formatYoutubeTime from '../../date-time/formatYoutubeTime';
import { Error } from '../../no-data/Error';
import { Error404 } from '../../no-data/Error404';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import ErrorIcon from '@mui/icons-material/Error';
import { Error403 } from '../../no-data/Error403';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import logoImage from '../../../assets/images/logos/2.png';
import { Helmet } from 'react-helmet';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PlaylistPlayIcon from '@mui/icons-material/PlaylistPlay';

export default function VideoPage() {
  const { id: video_id } = useParams();

  // States management
  const [loadingStates, setLoadingStates] = useState({
    video: true,
    recommendations: true,
    comments: true
  });

  const [errors, setErrors] = useState({
    video: null,
    recommendations: null,
    comments: null
  });

  const [videoData, setVideoData] = useState({
    views: 0,
    mainData: {},
    recommendations: [],
    comments: [],
    commentsCount: 0
  });

  // Handlers
  const handleCommentAdded = useCallback((newReply) => {
    setVideoData(prev => ({
      ...prev,
      comments: [newReply, ...prev.comments],
      commentsCount: prev.commentsCount !== undefined ? prev.commentsCount + 1 : 1
    }));
  }, []);

  const resetErrors = useCallback(() => {
    setErrors({
      video: null,
      recommendations: null,
      comments: null
    });
  }, []);

  // Data fetching functions
  const getVideoMainData = useCallback(async () => {
    setLoadingStates(prev => ({ ...prev, video: true }));
    try {
      const response = await axiosInstance.get(`api/video/${video_id}`);
      setVideoData(prev => ({
        ...prev,
        mainData: response.data,
        views: response.data.more_info.views.length
      }));
      setErrors(prev => ({ ...prev, video: null }));
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        video: {
          catch: true,
          status: error.response?.status || 500,
          msg: "Can't get video..!"
        }
      }));
    } finally {
      setLoadingStates(prev => ({ ...prev, video: false }));
    }
  }, [video_id]);

  const getComments = useCallback(async () => {
    setLoadingStates(prev => ({ ...prev, comments: true }));
    try {
      const response = await axiosInstance.get(`api/video/${video_id}/comments`);
      setVideoData(prev => ({
        ...prev,
        comments: response.data,
        commentsCount: response.data.length > 0 ? response.data[0].total_comments : 0
      }));
      setErrors(prev => ({ ...prev, comments: null }));
    } catch (error) {
      setErrors(prev => ({ ...prev, comments: "Can't get comments..!" }));
    } finally {
      setLoadingStates(prev => ({ ...prev, comments: false }));
    }
  }, [video_id]);

  const RetrieveUpdateVideoViews = useCallback(async () => {
    try {
      const response = await axiosInstance.patch(`api/video/${video_id}/views`);
      setVideoData(prev => ({
        ...prev,
        views: response.data.total_views
      }));
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        video: {
          catch: true,
          status: 0,
          msg: "Can't get video..!"
        }
      }));
    }
  }, [video_id]);

  const getRecommendations = useCallback(async () => {
    setLoadingStates(prev => ({ ...prev, recommendations: true }));
    try {
      const response = await axiosInstance.get(`api/video/${video_id}/recommendations`);
      setVideoData(prev => ({
        ...prev,
        recommendations: response.data
      }));
      setErrors(prev => ({ ...prev, recommendations: null }));
    } catch (error) {
      setErrors(prev => ({ ...prev, recommendations: true }));
    } finally {
      setLoadingStates(prev => ({ ...prev, recommendations: false }));
    }
  }, [video_id]);

  // Effects
  useEffect(() => {
    const fetchData = async () => {
      resetErrors();
      try {
        await Promise.all([
          getVideoMainData(),
          getComments(),
          RetrieveUpdateVideoViews(),
          getRecommendations()
        ]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [getVideoMainData, getComments, RetrieveUpdateVideoViews, getRecommendations, resetErrors]);

  const retry = useCallback(() => {
    resetErrors();
    getVideoMainData();
    getComments();
    RetrieveUpdateVideoViews();
    getRecommendations();
  }, [getVideoMainData, getComments, RetrieveUpdateVideoViews, getRecommendations, resetErrors]);

  // Render functions
  const renderBreadcrumbs = () => {
    if (loadingStates.video) return <>جاري التحميل..</>;

    if (!videoData.mainData.course_title) return null;

    return (
      <Breadcrumbs aria-label="breadcrumb">
        <Link style={{ color: 'var(--main-50)' }} to="/courses">الكورسات</Link>
        <Link style={{ color: 'var(--main-50)' }} to={`/courses/${videoData.mainData.course_title}`}>
          {videoData.mainData.course_title}
        </Link>
        <Typography sx={{ color: 'text.primary' }}>{videoData.mainData.title}</Typography>
      </Breadcrumbs>
    );
  };

  const renderComments = () => {
    if (loadingStates.comments) {
      return Array.from({ length: 5 }).map((_, index) => (
        <div className='d-flex justify-content-between gap-2 mb-3' key={index}>
          <div>
            <Skeleton variant="circular" width={40} height={40} />
          </div>
          <div className='w-100'>
            <Skeleton variant="text" width="80%" height={30} />
            <Skeleton variant="text" width="60%" height={25} />
            <Skeleton variant="text" width="90%" height={20} />
          </div>
        </div>
      ));
    }

    if (errors.comments) {
      return (
        <span className='d-flex gap-2 justify-content-center align-items-center' style={{ fontSize: '1.2rem' }}>
          <AnnouncementIcon />
          لقد حدث خطأ اثناء تحميل التعليقات
        </span>
      );
    }

    return (
      <>
        <CommentForm
          changeCommentCount={count => setVideoData(prev => ({ ...prev, commentsCount: count }))}
          onCommentAdded={handleCommentAdded}
          label="اكتب تعليق"
          confirmButton="Comment"
          video_id={videoData.mainData.id}
        />
        <div className="comments w-100 d-flex flex-column" style={{ overflow: 'hidden' }}>
          <h3 className='d-flex gap-2 mb-4'>
            <span>تعليقات</span>
            <span>{videoData.commentsCount > 0 ? videoData.commentsCount : 0}</span>
          </h3>
          <div className="comment">
            {videoData.comments.length > 0 ? (
              videoData.comments.map((comment) => (
                <div className='w-100' key={comment.id}>
                  <Comment
                    author={comment.author}
                    time={comment.created_dt}
                    content={comment.content}
                    replies={comment.replies}
                    replies_count={comment.total_replies}
                    likes={comment.likes_count}
                    comment_id={comment.id}
                    video_id={videoData.mainData.id}
                    is_liked_by_user={comment.is_liked_by_user}
                    changeCommentCount={count => setVideoData(prev => ({ ...prev, commentsCount: count }))}
                    getComments={getComments}
                  />
                </div>
              ))
            ) : (
              <span className='d-flex gap-2 justify-content-start align-items-center' style={{ fontSize: '1.2rem' }}>
                <TextSnippetIcon />
                لايوجد تعليقات علي هذا الفيديو
              </span>
            )}
          </div>
        </div>
      </>
    );
  };

  const renderRecommendations = () => {
    if (loadingStates.recommendations) {
      return (
        <div className="video-suggestions">
          {Array.from({ length: 4 }).map((_, index) => (
            <React.Fragment key={index}>
              <div>
                <Skeleton variant="rectangular" width="100%" height={80} />
                <Skeleton variant="rectangular" width="100%" height={80} />
              </div>
              <div>
                <Skeleton variant="text" width="80%" height={30} />
                <Skeleton variant="text" width="60%" height={25} />
                <Skeleton variant="text" width="90%" height={20} />
              </div>
            </React.Fragment>
          ))}
        </div>
      );
    }

    if (errors.recommendations) {
      return (
        <div className="video-suggestions">
          <span className='d-flex gap-2 justify-content-center align-items-center' style={{ fontSize: '1.2rem' }}>
            <ErrorIcon />
            لقد حدث خطأ اثناء تحميل الفيديوهات المقترحة
          </span>
        </div>
      );
    }

    if (videoData.recommendations.length > 0) {
      return (
        <div className="video-suggestions">
          <h3 dir='rtl' style={{ backgroundColor: 'var(--suggestions-title-back)', borderRadius: '5px 5px 0 0' }} className='w-100 py-3 px-3 m-0 d-flex flex-column gap-2'>
            <span style={{ fontSize: '1.5rem' }}>
              <PlaylistPlayIcon sx={{ marginLeft: '5px' }} />
              {videoData.recommendations[0]?.course_name}
            </span>
            <span dir='rtl' style={{ fontSize: '1rem' }}>
              <span style={{color:'var(--main-50)'}}> {videoData.recommendations.findIndex(item => item.id === videoData.mainData.id)+1}/{videoData.recommendations.length} </span>
                - 
              <span> {videoData.recommendations[0]?.author} </span>
            </span>
          </h3>
          <ul>
            {videoData.recommendations.map((recommend) => (
              <li style={{backgroundColor:!recommend.is_active&&'#ed555582'}} className={`${videoData?.mainData?.id === recommend.id ? 'active ':''}${!recommend.is_active&&'not-active position-relative'}`} key={recommend.id}>
                <div className='priority-num'>
                  {
                    videoData?.mainData?.id === recommend.id ?
                      <PlayArrowIcon />
                      :
                      recommend.priority
                  }
                </div>
                <Link to={`/courses/${recommend.course_name}/${recommend.id}`}>
                  {recommend.cover ? (
                    <div className='recommend-img'><img src={recommend.cover} alt="Video" /></div>
                  ) : (
                    <div className='no-image-cover'><img src={logoImage} alt='video-cover' /></div>
                  )}
                  <div className='d-flex flex-column'>
                    <p className='title'>{recommend.title}</p>
                    <span className='author'>{recommend.author}</span>
                    <Typography dir={'rtl'} className='more-info' variant="caption" sx={{ color: 'text.secondary' }}>
                      {`${recommend.more_info.views.length} مشاهدة • ${formatYoutubeTime(recommend.created_dt)}`}
                    </Typography>
                  </div>
                </Link>
              </li>
            ))}
            
          </ul>
        </div>
      );
    }

    return null;
  };

  if (errors.video?.catch) {
    if (errors.video.status === 404) {
      return <Error404 msg='لايوجد بيانات في هذا المسار' />;
    }
    else if (errors.video.status === 403) {
      return <Error403 msg="غير مسموح لك بالوصول لهذا المحتوي" />;
    }
    return <Error imgStyle={{ width: '400px' }} msg="لقد حدث خطأ" retry={{ msg: 'إعادة المحاولة', onClick: retry }} />;
  }

  // Main render
  return (
    <div className='w-100'>
      <Helmet>
        <title>Engineering Sozy | مشاهدة فيديو </title>
      </Helmet>
      {renderBreadcrumbs()}

      <div className='main-page mt-4 w-100 d-flex'>
        <div className={`left-section mb-3 ${videoData.recommendations.length === 0 ? 'full-width' : ''}`}>
          {loadingStates.video ? (
            <div className="mb-4">
              <Skeleton variant="rectangular" width="100%" height={300} />
              <div className='d-flex gap-2 w-100 pt-2'>
                <Skeleton variant="circular" width={40} height={40} />
                <div className='w-100'>
                  <Skeleton variant="text" width="80%" height={30} />
                  <Skeleton variant="text" width="60%" height={25} />
                  <Skeleton variant="text" width="90%" height={20} />
                </div>
              </div>
            </div>
          ) : (
            <VideoMainData
              title={videoData.mainData.title}
              description={videoData.mainData.description}
              embedCode={videoData.mainData.embed_code}
              author={videoData.mainData.author}
              initialLikes={videoData.mainData.likes_count}
              is_liked_by_user={videoData.mainData.is_liked_by_user}
              videoId={videoData.mainData.id}
              extraInfo={{
                created_dt: videoData.mainData.created_dt,
                update_dt: videoData.mainData.update_dt,
                views: videoData.views,
                setViews: views => setVideoData(prev => ({ ...prev, views }))
              }}
            />
          )}

          {renderComments()}
        </div>

        {renderRecommendations()}
      </div>
    </div>
  );
}