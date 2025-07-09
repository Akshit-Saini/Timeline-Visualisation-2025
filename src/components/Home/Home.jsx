import React from 'react';
import { Button, Typography, Box, Grid } from '@mui/material';
import { Link } from 'react-router-dom';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import { styled } from '@mui/material/styles';
import { keyframes } from '@mui/system';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const HeroSection = styled(Box)(({ theme }) => ({
  minHeight: '60vh',
  width: '100vw',
  margin: 0,
  padding: 0,
  background: 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url("https://images.unsplash.com/photo-1599571234909-29ed5d1321d6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80")',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#fff',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '100px',
    background: 'linear-gradient(to top, #000, transparent)',
  }
}));

const StyledButton = styled(Button)(({ theme }) => ({
  padding: '12px 32px',
  fontSize: '1.1rem',
  borderRadius: '30px',
  textTransform: 'none',
  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
  color: 'white',
  boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
  '&:hover': {
    background: 'linear-gradient(45deg, #1976D2 30%, #1CB5E0 90%)',
  }
}));

const FeatureCard = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  textAlign: 'center',
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  borderRadius: '15px',
  backdropFilter: 'blur(10px)',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-10px)',
  }
}));

const Home = () => (
  <Box sx={{ width: '100vw', minHeight: '100vh', bgcolor: '#000', m: 0, p: 0, overflowX: 'hidden' }}>
    <Header />
    <HeroSection>
      <Box sx={{ 
        animation: `${fadeIn} 1s ease-out`,
        textAlign: 'center',
        py: 4,
        width: '100%',
        zIndex: 1,
        position: 'relative',
      }}>
        <Typography 
          variant="h1" 
          sx={{ 
            fontSize: { xs: '2rem', md: '3rem' },
            fontWeight: 700,
            mb: 2,
            background: 'linear-gradient(45deg, #2196F3, #21CBF3)',
            backgroundClip: 'text',
            textFillColor: 'transparent',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          Beyond Timelines
        </Typography>
        <Typography 
          variant="h5" 
          sx={{ 
            mb: 3,
            maxWidth: '800px',
            mx: 'auto',
            lineHeight: 1.4,
            color: 'rgba(255, 255, 255, 0.9)',
            fontSize: { xs: '1rem', md: '1.25rem' }
          }}
        >
          Explore Irish Records dating back to the time of the Normans which was destroyed in the engagement of the Civil War on June 30th, 1922.
        </Typography>
        <StyledButton 
          component={Link} 
          to="/years"
          size="large"
        >
          Start Exploring
        </StyledButton>
      </Box>
    </HeroSection>

    <Box sx={{ bgcolor: '#000', py: 4, width: '100vw', m: 0, p: 0 }}>
      <Grid container spacing={3} justifyContent="center" sx={{ width: '100%', margin: 0 }}>
        <Grid item xs={12} md={4}>
          <FeatureCard>
            <Typography variant="h5" sx={{ mb: 1, color: '#2196F3', fontSize: '1.25rem' }}>
              Historical Records
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9rem' }}>
              Access comprehensive historical records from the Norman period through the Civil War.
            </Typography>
          </FeatureCard>
        </Grid>
        <Grid item xs={12} md={4}>
          <FeatureCard>
            <Typography variant="h5" sx={{ mb: 1, color: '#2196F3', fontSize: '1.25rem' }}>
              Interactive Timeline
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9rem' }}>
              Navigate through history with our interactive timeline interface.
            </Typography>
          </FeatureCard>
        </Grid>
        <Grid item xs={12} md={4}>
          <FeatureCard>
            <Typography variant="h5" sx={{ mb: 1, color: '#2196F3', fontSize: '1.25rem' }}>
              Rich Archives
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9rem' }}>
              Discover detailed archives and documents from Ireland's past.
            </Typography>
          </FeatureCard>
        </Grid>
      </Grid>
    </Box>
    <Footer />
  </Box>
);

export default Home;