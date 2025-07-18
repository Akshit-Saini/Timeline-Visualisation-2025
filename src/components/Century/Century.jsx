import React, { useCallback } from 'react';
import { Container, Typography } from '@mui/material';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import FancySlider from '../Sliders/CenturySlider/CenturySlider';
import { useNavigate } from 'react-router-dom';

// Example fun facts and stats (to be fetched dynamically later)
const funFacts = {
  '4th Century': 'Christianity begins to spread in Ireland.',
  '5th Century': 'St. Patrick arrives in Ireland.',
  '6th Century': 'Monastic settlements flourish across Ireland.',
  '7th Century': 'Golden Age of Irish scholarship and art.',
  '8th Century': 'Viking raids begin on Irish coasts.',
  '9th Century': 'Rise of Irish kingdoms and Viking towns.'
};
const stats = {
  '4th Century': { count: 12, topRole: 'Chieftain' },
  '5th Century': { count: 18, topRole: 'Saint' },
  '6th Century': { count: 25, topRole: 'Monk' },
  '7th Century': { count: 20, topRole: 'Scholar' },
  '8th Century': { count: 15, topRole: 'Warrior' },
  '9th Century': { count: 22, topRole: 'King' }
};

const Slider = () => {
  const navigate = useNavigate();

  const handleCenturySelect = useCallback((from, to) => {
    navigate('/years', { state: { fromYear: from, toYear: to, autoExplore: true } });
  }, [navigate]);

  return (
    <>
      <Header />
      <Container style={{ marginTop: '30px', textAlign: 'center' }}>
        <Typography variant="h3" style={{ color: '#D1C72E', marginBottom: '30px' }}>
          Select a Century
        </Typography>
      </Container>

      {/* Only FancySlider */}
      <Container style={{ marginTop: '40px', marginBottom: '60px' }}>
        <FancySlider onCenturySelect={handleCenturySelect} stats={stats} funFacts={funFacts} />
      </Container>

      <Footer />
    </>
  );
};

export default Slider;