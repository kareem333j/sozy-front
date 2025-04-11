import React from 'react';
import noDataImage from '../../assets/images/data/no-data.png';

export const NoVideos = ({msg,imgStyle}) => {
  return (
    <div style={{minHeight:'70%'}} className='no-videos d-flex gap-3 w-100 flex-column justify-content-center align-items-center'>
        <img style={imgStyle} src={noDataImage} alt='no-videos-icon' />
        <h3 dir='rtl' style={{fontSize:'1.5rem'}} className='text-center'>{msg}</h3>
    </div>
  )
}
