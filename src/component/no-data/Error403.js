import React from 'react';
import errorImage from '../../assets/images/errors/403.png';

export const Error403 = ({ msg }) => {
    return (
        <div style={{ minHeight: '80%' }} className='no-videos d-flex gap-3 w-100 flex-column justify-content-center align-items-center'>
            <img style={{width:'350px'}} src={errorImage} alt='no-videos-icon' />
            <h3 style={{ fontSize: '1.9rem', marginBottom:'30px' }} className='text-center'>{msg}</h3>
        </div>
    )
}
