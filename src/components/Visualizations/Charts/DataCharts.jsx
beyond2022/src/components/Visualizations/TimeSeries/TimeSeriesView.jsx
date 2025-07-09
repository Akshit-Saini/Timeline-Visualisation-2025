import React, { useMemo } from 'react';
import { Box, Paper, Typography, Grid } from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const DataCharts = ({ data }) => {
  console.log("DataCharts received data:", data);

  // Process data for time period distribution
  const timePeriodData = useMemo(() => {
    console.log("Processing timePeriodData from data:", data);
    const periodCount = {};
    if (data && Array.isArray(data)) {
      data.forEach(person => {
        if (person.timePeriod && person.timePeriod !== 'Unknown') {
          periodCount[person.timePeriod] = (periodCount[person.timePeriod] || 0) + 1;
        }
      });
    }
    return Object.entries(periodCount).map(([period, count]) => ({
      period,
      count,
    }));
  }, [data]);

  // Process data for gender distribution by time period
  const genderTimePeriodData = useMemo(() => {
    console.log("Processing genderTimePeriodData from data:", data);
    const periodGenderCount = {};
    if (data && Array.isArray(data)) {
      data.forEach(person => {
        if (person.timePeriod && person.timePeriod !== 'Unknown' &&
            person.gender && person.gender !== 'Unknown') {
          if (!periodGenderCount[person.timePeriod]) {
            periodGenderCount[person.timePeriod] = {};
          }
          periodGenderCount[person.timePeriod][person.gender] =
            (periodGenderCount[person.timePeriod][person.gender] || 0) + 1;
        }
      });
    }

    return Object.entries(periodGenderCount).map(([period, genders]) => ({
      period,
      ...genders,
    }));
  }, [data]);

  // Process data for birth/death place distribution
  const placeData = useMemo(() => {
    console.log("Processing placeData from data:", data);
    const placeCount = {};
    if (data && Array.isArray(data)) {
      data.forEach(person => {
        if (person.birthPlace && person.birthPlace !== 'Unknown') {
          placeCount[person.birthPlace] = (placeCount[person.birthPlace] || 0) + 1;
        }
      });
    }
    return Object.entries(placeCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([place, count]) => ({
        place,
        count,
      }));
  }, [data]);

  return (
    <Grid container spacing={3}>
      {/* Time Period Distribution */}
      <Grid item xs={12} md={6}>
        <Paper
          elevation={3}
          sx={{
            p: 2,
            height: '400px',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Typography variant="h6" gutterBottom>
            Distribution by Time Period
          </Typography>
          <ResponsiveContainer width="100%" height="calc(100% - 40px)">
            <BarChart data={timePeriodData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#2196F3" />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>

      {/* Gender Distribution by Time Period */}
      <Grid item xs={12} md={6}>
        <Paper
          elevation={3}
          sx={{
            p: 2,
            height: '400px',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Typography variant="h6" gutterBottom>
            Gender Distribution by Time Period
          </Typography>
          <ResponsiveContainer width="100%" height="calc(100% - 40px)">
            <BarChart data={genderTimePeriodData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Male" fill="#2196F3" stackId="a" />
              <Bar dataKey="Female" fill="#E91E63" stackId="a" />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>

      {/* Top Birth Places */}
      <Grid item xs={12}>
        <Paper
          elevation={3}
          sx={{
            p: 2,
            height: '400px',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Typography variant="h6" gutterBottom>
            Top 10 Birth Places
          </Typography>
          <ResponsiveContainer width="100%" height="calc(100% - 40px)">
            <BarChart data={placeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="place" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#4CAF50" />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default DataCharts; 