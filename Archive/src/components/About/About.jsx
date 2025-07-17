import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import './About.css';

const About = () => {
  return (
    <>
      <Header />

      {/* Hero Section */}
      <Box className="about-hero">
        <Typography variant="h3" className="about-title">About Us</Typography>
      </Box>

      {/* Content Section */}
      <Container className="about-content">
        <Box className="about-section" data-aos="fade-up">
          <Typography variant="h4">What is Beyond Timeline?</Typography>
          <Typography variant="body1">
            Beyond Timeline is an Open-Source project which helps users learn more about the Irish History 
            in an interactive way using Graphs, Filters and other features.
          </Typography>
        </Box>

        <Box className="about-section" data-aos="fade-up" data-aos-delay="100">
          <Typography variant="h4">What can I do with Beyond Timeline?</Typography>
          <Typography variant="body1">
            Click on the "Start with something fun" button above. Try out the functions on our example timeline.
          </Typography>
        </Box>

        <Box className="about-section" data-aos="fade-up" data-aos-delay="200">
          <Typography variant="h4">Collaborate With Us</Typography>
          <Typography variant="body1">
            Beyond Timeline application is an open-source & free application and may be modified to the needs of the user as long as 
            the user adheres to MIT license. Anyone can contribute towards this project or build upon the existing project. 
            You can find us on GitHub.
          </Typography>
        </Box>
      </Container>

      <Footer />
    </>
  );
};

export default About;