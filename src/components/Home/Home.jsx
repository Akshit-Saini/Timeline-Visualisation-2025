import React from 'react';
import { Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';

const Home = () => (
  <>
    <Header />
    <div className="hero-section">
      <Typography variant="h2" className="hero-title">Beyond Timelines</Typography>
      <Typography variant="subtitle1" style={{ margin: '20px 0', color: '#eee' }}>
        Explore Irish Records dating back to the time of the Normans which was destroyed in the engagement of the Civil War on June 30th, 1922.
      </Typography>
      <Button className="explore-btn" component={Link} to="/years">Explore</Button>
    </div>
    <Footer />
  </>
);

export default Home;