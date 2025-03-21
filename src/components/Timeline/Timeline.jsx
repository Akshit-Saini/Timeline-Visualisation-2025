import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import { Container, Typography, Card, CardContent } from '@mui/material';

const data = [
  { name: '1800', value: 20 },
  { name: '1850', value: 40 },
  { name: '1900', value: 30 },
  { name: '1950', value: 50 }
];

const Timeline = () => {
  return (
    <>
      <Header />
      <Container style={{ marginTop: '30px' }}>
        <Card style={{ backgroundColor: '#222', color: 'white' }}>
          <CardContent>
            <Typography variant="h5" style={{ color: '#D1C72E' }}>Timeline Visualization</Typography>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={data}>
                <XAxis dataKey="name" stroke="#D1C72E" />
                <YAxis stroke="#D1C72E" />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#D1C72E" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Container>
      <Footer />
    </>
  );
};

export default Timeline;