import React from 'react';
import errorImage from '../../assets/images/errors/404.png';

export const Error404 = ({ msg }) => {
    return (
        <div style={{ minHeight: '80%' }} className='no-videos d-flex gap-3 w-100 flex-column justify-content-center align-items-center'>
            <img style={{width:'350px'}} src={errorImage} alt='no-videos-icon' />
            <h3 dir='rtl' style={{ fontSize: '1.9rem', marginBottom:'30px' }} className='text-center w-100'>{msg}</h3>
        </div>
    )
}
