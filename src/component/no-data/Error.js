import React from 'react';
import errorImage from '../../assets/images/data/error.png';
import ReplayIcon from '@mui/icons-material/Replay';
import { Button } from '@mui/material';

export const Error = ({ msg, imgStyle, retry }) => {
    return (
        <div style={{ minHeight: '70%' }} className='no-videos d-flex gap-3 w-100 flex-column justify-content-center align-items-center'>
            <img style={imgStyle} src={errorImage} alt='no-videos-icon' />
            <h3 style={{ fontSize: '1.9rem', marginBottom:'30px' }} className='text-center'>{msg}</h3>
            {
                retry && (
                    <Button onClick={retry.onClick} variant="contained" sx={{fontWeight:'bold'}} endIcon={<ReplayIcon />}>
                        {retry.msg}
                    </Button>
                )
            }
        </div>
    )
}
