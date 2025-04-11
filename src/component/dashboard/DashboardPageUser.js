import React, { useEffect, useState } from 'react'
import axiosInstance from '../../Axios';
import VideosAccordion from '../accordion/VideosAccordion';
import { Box, Grid, Skeleton } from '@mui/material';
import { NoVideos } from '../no-data/NoVideos';
import { Helmet } from 'react-helmet';

export const DashboardPageUser = () => {
  const [loading, setLoading] = useState(true);
  const [coursesData, setCourseData] = useState([]);
  useEffect(() => {
    getCourses();
  }, []);

  const getCourses = () => {
    setLoading(true);
    axiosInstance.get('/api/courses_list')
      .then((response) => {
        setCourseData(response.data);
      })
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  }

  if (loading) {
    return (
      <Box sx={{ width: '100%', overflow: 'hidden', marginBottom: 3 }}>
        <Grid container spacing={2} sx={{ maxWidth: '100%', margin: 'auto', padding: 0 }}>
          {Array.from(new Array(12)).map((item, index) => (
            <React.Fragment key={index}>
              <Grid item xs={12} sm={6} md={4} lg={4} key={index}>
                <Box className='video-card' sx={{ width: '100%' }}>
                  <div className={`video-container ${item?.cover ? 'video-image' : 'no-image'}`}>
                    <Skeleton variant="rectangular" width={"100%"} height={"100%"} />
                  </div>
                  <Box sx={{ pt: 0.5 }}>
                    <Skeleton />
                    <Skeleton width="60%" />
                  </Box>
                </Box>
              </Grid>
            </React.Fragment>
          ))}
        </Grid>
      </Box>
    )
  }
  else {
    if (coursesData.length <= 0) {
      return (
        <NoVideos imgStyle={{ width: '200px' }} msg="لم يتم إضافتك في اي كورس حتي الأن..!" />
      )
    }
    return (
      <>
        <Helmet>
          <title>Engineering Sozy | الرئيسية</title>
        </Helmet>
        <VideosAccordion data={coursesData} />
      </>
    )
  }
}