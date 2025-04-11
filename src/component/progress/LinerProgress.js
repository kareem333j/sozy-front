import * as React from 'react';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';

export default function CustomLinearProgress({ loading }) {
    if (loading) {
        return (
            <div className='d-flex position-fixed w-100' style={{ top: '0', left: '0', height: '100vh', zIndex: '9999', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                <Box sx={{ width: '100%' }}>
                    <LinearProgress />
                </Box>
            </div>
        );
    }
}