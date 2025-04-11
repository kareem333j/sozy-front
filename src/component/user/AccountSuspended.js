import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import locked from '../../assets/images/errors/locked.png'
import { Helmet } from 'react-helmet';

export default function AccountSuspended() {
  return (
    <>
      <Helmet>
        <title>Engineering Sozy | حسابك معطل</title>
      </Helmet>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        textAlign: 'center',
        padding: 3,
        backgroundColor: '#121212',
        color: '#fff',
      }}>
        <img src={locked} style={{ width: '150px', marginBottom: '30px' }} alt='صورة حساب مغلق' />
        <Typography variant="h4" gutterBottom sx={{ color: 'error.main', fontWeight: 'bold' }}>
          الحساب معطل
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, fontSize: '1.2rem' }}>
          عذرًا، حسابك معطل حالياً ولا يمكنك الوصول إلى الموقع.
        </Typography>
        <Typography variant="body2" sx={{ mb: 3, fontSize: '1.2rem' }}>
          يرجى التواصل مع الدعم الفني لمزيد من المعلومات.
        </Typography>
        <Button
          component={Link}
          to="/logout"
          variant="contained"
          color="error"
          sx={{ fontSize: '1.2rem' }}
        >
          تسجيل الخروج
        </Button>
      </Box>
    </>

  );
}