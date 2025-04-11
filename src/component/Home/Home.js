import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  useTheme,
  useMediaQuery,
  styled,
  alpha,
  Fade,
  Grow,
  Slide,
  CssBaseline
} from '@mui/material';
import { keyframes } from '@emotion/react';
import { motion, useScroll, useTransform } from 'framer-motion';
import logo from '../../assets/images/logos/3.png';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';

const rem = (px) => `${px / 15}rem`;

const floatAnimation = keyframes`
  0% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(${rem(-10)}) rotate(2deg); }
  100% { transform: translateY(0) rotate(0deg); }
`;

const bubbleAnimation = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.2); opacity: 0.7; }
  100% { transform: scale(1); opacity: 1; }
`;

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const getTimeBasedColors = () => {
  const hour = new Date().getHours();

  if (hour >= 6 && hour < 12) {
    return {
      primary: '#6A398A',
      secondary: '#1565C0',
      accent: '#1565C0',
      text: '#333'
    };
  } else if (hour >= 12 && hour < 18) {
    return {
      primary: '#8338ec',
      secondary: '#ff006e',
      accent: '#fb5607',
      text: '#222'
    };
  } else {
    return {
      primary: '#3a0ca3',
      secondary: '#7209b7',
      accent: '#4361ee',
      text: '#111'
    };
  }
};

const ParallaxBackground = styled(motion.div)(({ theme }) => ({
  minHeight: '120vh',
  background: `
    linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%),
    radial-gradient(circle at 10% 20%, ${alpha('#3a86ff', 0.1)} 0%, transparent 20%),
    radial-gradient(circle at 90% 80%, ${alpha('#8338ec', 0.1)} 0%, transparent 20%)
  `,
  backgroundSize: '400% 400%',
  animation: `${gradientAnimation} 15s ease infinite`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: rem(16),
  position: 'relative',
  overflow: 'hidden',
}));

const CreativeCard = styled(Box)(({ theme }) => ({
  backgroundColor: alpha('#ffffff', 0.95),
  borderRadius: rem(24),
  border: `${rem(1)} solid ${alpha('#ffffff', 0.3)}`,
  padding: `${rem(32)} ${rem(40)}`,
  width: '90%',
  maxWidth: rem(900),
  margin: '0 auto',
  boxShadow: `
    0 ${rem(8)} ${rem(32)} ${alpha('#3a86ff', 0.1)},
    0 ${rem(16)} ${rem(48)} ${alpha('#8338ec', 0.1)}
  `,
  textAlign: 'center',
  position: 'relative',
  overflow: 'hidden',
  backdropFilter: 'blur(8px)',
  [theme.breakpoints.down('sm')]: {
    padding: `${rem(24)} ${rem(28)}`,
    borderRadius: rem(20),
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `linear-gradient(135deg, ${alpha('#3a86ff', 0.03)}, ${alpha('#8338ec', 0.03)})`,
    zIndex: -1,
  },
}));

const Bubble = styled(motion.div)(({ theme, color, size }) => ({
  position: 'absolute',
  width: rem(size),
  height: rem(size),
  borderRadius: '50%',
  background: `radial-gradient(circle at 30% 30%, ${alpha(color, 0.8)}, ${alpha(color, 0.2)})`,
  animation: `${bubbleAnimation} ${6 + Math.random() * 3}s ease-in-out infinite`,
  zIndex: 0,
  filter: 'blur(2px)',
}));

const CreativeButton = styled(Button)(({ theme }) => ({
  position: 'relative',
  overflow: 'hidden',
  fontSize: rem(18),
  padding: `${rem(12)} ${rem(36)}`,
  borderRadius: rem(50),
  fontWeight: 'bold',
  margin: `${rem(24)} 0`,
  color: 'white',
  border: 'none',
  transition: 'all 0.4s ease',
  boxShadow: `0 ${rem(4)} ${rem(15)} ${alpha('#3a86ff', 0.4)}`,
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: `0 ${rem(6)} ${rem(20)} ${alpha('#3a86ff', 0.6)}`,
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(45deg, transparent, rgba(255,255,255,0.3), transparent)',
    transform: 'translateX(-100%)',
    transition: '0.5s',
  },
  '&:hover::after': {
    transform: 'translateX(100%)',
  },
  [theme.breakpoints.down('sm')]: {
    padding: `${rem(10)} ${rem(28)}`,
    fontSize: rem(16),
  },
}));

const Home = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [loaded, setLoaded] = useState(false);
  const [colors, setColors] = useState(getTimeBasedColors());
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, 100]);
  const y2 = useTransform(scrollY, [0, 300], [0, 50]);

  const bubbles = [
    { size: 120, left: '5%', top: '10%' },
    { size: 80, left: '80%', top: '20%' },
    { size: 60, left: '15%', top: '70%' },
    { size: 100, left: '70%', top: '60%' },
  ];

  useEffect(() => {
    setLoaded(true);
    const interval = setInterval(() => {
      setColors(getTimeBasedColors());
    }, 3600000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Helmet>
        <title>Engineering Sozy | الصفحة الرئيسية</title>
      </Helmet>
      <CssBaseline />
      <ParallaxBackground style={{ y: y1 }}>
        {bubbles.map((bubble, index) => (
          <Bubble
            key={index}
            color={colors.accent}
            size={bubble.size}
            style={{
              left: bubble.left,
              top: bubble.top,
              y: y2,
              animationDelay: `${index * 0.5}s`
            }}
          />
        ))}

        <Slide in={loaded} direction="down" timeout={500}>
          <CreativeCard>
            <Fade in={loaded} timeout={1000}>
              <Box position="relative" zIndex={1}>
                <Box sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  marginBottom: rem(40)
                }}>
                  <Box
                    component="img"
                    src={logo}
                    alt="Engineering Sozy Logo"
                    sx={{
                      width: isMobile ? rem(120) : rem(160),
                      height: isMobile ? rem(120) : rem(160),
                      margin: '0 auto',
                      animation: `${floatAnimation} 6s ease-in-out infinite`,
                      objectFit: 'contain',
                    }}
                  />
                </Box>

                <Typography
                  variant="h1"
                  sx={{
                    background: `linear-gradient(45deg, ${colors.primary}, ${colors.secondary})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontWeight: 'bold',
                    fontSize: isMobile ? rem(32) : rem(48),
                    margin: `${rem(24)} 0 ${rem(8)}`,
                    fontFamily: "'Poppins', sans-serif",
                    lineHeight: 1.2,
                  }}
                >
                  Engineering Sozy
                </Typography>

                <Grow in={loaded} timeout={1500}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      maxWidth: rem(600),
                      margin: '0 auto',
                      fontSize: isMobile ? rem(16) : rem(18),
                      color: colors.text,
                      fontWeight: 500,
                    }}
                  >
                    ابتكارات هندسية تلهم المستقبل
                  </Typography>
                </Grow>

                <Box sx={{ marginTop: rem(40) }}>
                  <Typography
                    variant="h2"
                    sx={{
                      fontWeight: '600',
                      fontSize: isMobile ? rem(24) : rem(32),
                      marginBottom: rem(24),
                      color: colors.text,
                      fontFamily: "'Poppins', sans-serif",
                    }}
                  >
                    اكتشف عالمًا من الإمكانيات
                  </Typography>

                  <Typography
                    variant="body1"
                    sx={{
                      maxWidth: rem(600),
                      margin: '0 auto',
                      fontSize: isMobile ? rem(14) : rem(16),
                      marginBottom: rem(32),
                      color: '#555',
                      lineHeight: 1.7,
                    }}
                  >
                    انضم إلى منصتنا المتطورة حيث نجمع بين الهندسة الدقيقة والإبداع اللامحدود.
                    نوفر لك الأدوات والموارد لتحويل أفكارك إلى واقع ملموس.
                  </Typography>

                  <Grow in={loaded} timeout={2000}>
                    <Box>
                      <CreativeButton
                        variant="contained"
                        sx={{
                          background: `linear-gradient(45deg, ${colors.primary}, ${colors.secondary})`,
                          '&:hover': {
                            background: `linear-gradient(45deg, ${colors.primary}, ${colors.accent})`,
                          }
                        }}
                        component={Link}
                        to={'register'}
                      >
                        ! إنضم إلينا الآن
                      </CreativeButton>
                    </Box>
                  </Grow>
                </Box>
              </Box>
            </Fade>
          </CreativeCard>
        </Slide>
      </ParallaxBackground>
    </>
  );
};

export default Home;