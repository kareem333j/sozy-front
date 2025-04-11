import React, { useCallback, useEffect, useState } from 'react'
import axiosInstance from '../../Axios';
import { useParams } from 'react-router-dom';
import VideosList from '../videos/VideosList';
import { NoVideos } from '../no-data/NoVideos';

export const Course = () => {
  const params = useParams();
  // const course_pk = params.id;
  const [videos, setVideos] = useState();
  const [loading, setLoading] = useState(true);
  const course_pk = decodeURIComponent(params.id);

  const getCourses = useCallback(async () => {
    try {
      const response = await axiosInstance.get(`/api/courses_list/${course_pk}/videos`);
      setVideos(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [course_pk]);


  useEffect(() => {
    getCourses();
  }, [getCourses]);
  

  if(loading === false){
    if (videos.length === 0) {
      return <NoVideos imgStyle={{width:'200px'}} msg='لم يتم تحميل فيديوهات في هذا الكورس حتي الأن..!'/>
    }
  }
  
  return (
    <VideosList loading={loading} numOfLoadingCards={15} dataCourse={{ title: course_pk }} videos={videos} />
  )

}
