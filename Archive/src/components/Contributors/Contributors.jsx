import React from 'react';
import { Container, Grid, Card, CardContent, Typography, Avatar } from '@mui/material';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import './Contributors.css';

const contributors = [
  {
    name: 'Tanmay Kaushik',
    role: 'Product Owner & Front-End Developer',
    email: 'kaushikt@tcd.ie',
    img: '/pic/Tanmay.jpg'
},
{
    name: 'David Kavanagh',
    role: 'Back-End Developer',
    email: 'kavanad9@tcd.ie',
    img: '/pic/David.png'
},
{
    name: 'Hailing Jiang',
    role: 'Designer & Front-End Developer',
    email: 'jiangh@tcd.ie',
    img: '/pic/hailing.JPG'
},
{
    name: 'Brian Bredican',
    role: 'UX Designer',
    email: 'bredicab@tcd.ie',
    img: '/pic/brian.jpg'
  },
  {
    name: 'Matthew Grouse',
    role: 'Back-End Developer',
    email: 'grousem@tcd.ie',
    img: '/pic/MG.jpg'
  },
  {
    name: 'Dáithí Geary',
    role: 'Back-End Developer',
    email: 'dgeary@tcd.ie',
    img: '/pic/Contributer Picture Dáithí.jpg'
},
{
    name: 'Damien Graux',
    role: 'Product Owner',
    email: 'damien.graux@adaptcentre.ie',
    img: '/pic/gray.jpg'
},
{
    name: 'Fabrizio Orlandi',
    role: 'Product Owner',
    email: 'fabrizio.orlandi@adaptcentre.ie',
    img: '/pic/fab.jpg'
  }
];

const Contributors = () => {
  return (
    <>
      <Header />
      <div className="team-hero">
        <Typography variant="h3" className="team-title">Meet Our Team</Typography>
      </div>

      <Container style={{ marginTop: '50px', marginBottom: '80px' }}>
        <Grid container spacing={4} justifyContent="center">
          {contributors.map((contributor, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card className="team-card" elevation={4}>
                <Avatar 
                  alt={contributor.name} 
                  src={contributor.img} 
                  sx={{ width: 140, height: 140, margin: '20px auto' }}
                />
                <CardContent style={{ textAlign: 'center' }}>
                  <Typography variant="h6" style={{ color: '#111', fontWeight: 'bold', marginBottom: '10px' }}>
                    {contributor.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">{contributor.role}</Typography>
                  <Typography variant="caption" color="textSecondary">{contributor.email}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Footer />
    </>
  );
};

export default Contributors;