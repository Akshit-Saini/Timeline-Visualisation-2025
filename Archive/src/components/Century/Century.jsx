import React from 'react';
import { Container, Typography } from '@mui/material';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import FancySlider from '../Sliders/CenturySlider/CenturySlider';

const Slider = () => (
  <>
    <Header />
    <Container style={{ marginTop: '30px', textAlign: 'center' }}>
      <Typography variant="h3" style={{ color: '#D1C72E', marginBottom: '30px' }}>
        Select a Century
      </Typography>
    </Container>

    {/* Only FancySlider */}
    <Container style={{ marginTop: '40px', marginBottom: '60px' }}>
      <FancySlider />
    </Container>

    <Footer />
  </>
);

export default Slider;