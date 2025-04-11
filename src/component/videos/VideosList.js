import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import { Avatar, Grid } from '@mui/material';
import { Link } from 'react-router-dom';
import './videos.css'
import formatYoutubeTime from '../date-time/formatYoutubeTime';
import logoImage from '../../assets/images/logos/1.png';


function Media({ videos, data_loading, ...props }) {
  const data = videos;
  const { loading = false } = data_loading || {};
  const dataCourse = props.dataCourse;

  return (
    <Grid container spacing={2} sx={{ maxWidth: '100%', margin: 'auto', padding: 0 }}>
      {(loading ? Array.from(new Array(props.numOfLoadingCards?props.numOfLoadingCards:3)) : data).map((item, index) => (
        <React.Fragment key={index}>
          <Grid item xs={12} sm={6} md={4} lg={4} key={index}>
            <Box className='video-card' component={Link} to={!loading ? `/courses/${dataCourse.title}/${item.id}`:''} sx={{ width: '100%' }}>
              <div className={`video-container ${item?.cover ? 'video-image' : 'no-image'}`}>
                {loading ? (
                  <Skeleton variant="rectangular" width={"100%"} height={"100%"} />
                ) : item?.cover ? (
                  <img
                    alt={item.title}
                    src={item.cover}
                  />
                ) : (
                  <div className='no-image'>
                    <img style={{width:'130px'}} src={logoImage} alt='video-cover' />
                  </div>
                )}
              </div>

              {item ? (
                <Box sx={{ mt: 1 }}>
                  <Typography  gutterBottom variant="body2" sx={{ color: 'var(--main-color)', fontSize:'1.5em' }}>
                    {item.title}
                  </Typography>
                  <Typography className='d-flex align-items-center gap-2 mb-1' variant="caption" sx={{ display: 'block', fontSize:'0.9em', color: 'text.secondary' }}>
                    <Avatar sx={{ width: 22, height: 22 }} src={item.author.avatar} />{item.author.full_name ? item.author.full_name : item.author.profile_id}
                  </Typography>
                  <Typography dir={'rtl'} variant="caption" sx={{ color: 'text.secondary' }}>
                    {`${item.more_info.views.length} مشاهدة • ${formatYoutubeTime(item.created_dt)}`}
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ pt: 0.5 }}>
                  <Skeleton />
                  <Skeleton width="60%" />
                </Box>
              )}
            </Box>
          </Grid>
        </React.Fragment>
      ))}
    </Grid>
  );
}

Media.propTypes = {
  loading: PropTypes.bool,
};

export default function VideosList({ videos,loading,...props }) {
  return (
    <Box sx={{ width: '100%', overflow: 'hidden', marginBottom: 3 }}>
      <Media videos={videos} data_loading={{ loading: loading }} {...props} />
    </Box>
  );
}
