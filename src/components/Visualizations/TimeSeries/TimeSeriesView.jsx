import React, { useMemo } from 'react';
import { Box, Paper, Typography, Grid } from '@mui/material';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const TimeSeriesView = ({ data }) => {
  console.log("TimeSeriesView received data:", data);

  // Helper function to parse year from date string
  const parseYear = (dateStr) => {
    if (!dateStr || typeof dateStr !== 'string' || dateStr === 'Unknown') return null;
    const year = parseInt(dateStr.substring(0, 4));
    return !isNaN(year) ? year : null;
  };

  // Process data for births over time
  const birthData = useMemo(() => {
    console.log("Processing birthData from data:", data);
    const birthCounts = {};
    if (data && Array.isArray(data)) {
      data.forEach(person => {
        const year = parseYear(person.birth);
        if (year) {
          const decade = Math.floor(year / 10) * 10;
          birthCounts[decade] = (birthCounts[decade] || 0) + 1;
        }
      });
    }
    return Object.entries(birthCounts)
      .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
      .map(([decade, count]) => ({
        year: parseInt(decade),
        births: count,
      }));
  }, [data]);

  // Process data for deaths over time
  const deathData = useMemo(() => {
    console.log("Processing deathData from data:", data);
    const deathCounts = {};
    if (data && Array.isArray(data)) {
      data.forEach(person => {
        const year = parseYear(person.death);
        if (year) {
          const decade = Math.floor(year / 10) * 10;
          deathCounts[decade] = (deathCounts[decade] || 0) + 1;
        }
      });
    }
    return Object.entries(deathCounts)
      .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
      .map(([decade, count]) => ({
        year: parseInt(decade),
        deaths: count,
      }));
  }, [data]);

  // Process data for active people over time (floruit)
  const floruitData = useMemo(() => {
    console.log("Processing floruitData from data:", data);
    const floruitCounts = {};
    if (data && Array.isArray(data)) {
      data.forEach(person => {
        const startYear = parseYear(person.floruitStart);
        if (startYear) {
          const endYear = parseYear(person.floruitEnd) || startYear + 50;
          // Only process if end year is valid and after start year
          if (endYear >= startYear) {
            // Count each decade in the floruit period
            for (let year = startYear; year <= endYear; year += 10) {
              const decade = Math.floor(year / 10) * 10;
              floruitCounts[decade] = (floruitCounts[decade] || 0) + 1;
            }
          }
        }
      });
    }
    return Object.entries(floruitCounts)
      .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
      .map(([decade, count]) => ({
        year: parseInt(decade),
        active: count,
      }));
  }, [data]);

  // Check if any time series data is available
  const hasTimeSeriesData = birthData.length > 0 || deathData.length > 0 || floruitData.length > 0;

  // Custom tooltip formatter
  const formatTooltip = (value, name) => {
    return [`${value} people`, name.charAt(0).toUpperCase() + name.slice(1)];
  };

  // Display message if no data
  if (!data || data.length === 0) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="h6">No data available for time series based on current filters.</Typography>
      </Box>
    );
  }

  return (
    hasTimeSeriesData ? (
      <Grid container spacing={3}>
        {/* Births Over Time */}
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
              Births Over Time
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={birthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="year" 
                  type="number"
                  domain={['dataMin', 'dataMax']}
                  tickFormatter={(value) => `${value}s`}
                />
                <YAxis />
                <Tooltip formatter={formatTooltip} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="births"
                  stroke="#2196F3"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Deaths Over Time */}
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
              Deaths Over Time
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={deathData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="year" 
                  type="number"
                  domain={['dataMin', 'dataMax']}
                  tickFormatter={(value) => `${value}s`}
                />
                <YAxis />
                <Tooltip formatter={formatTooltip} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="deaths"
                  stroke="#E91E63"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Active People Over Time */}
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
              Active People Over Time
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={floruitData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="year" 
                  type="number"
                  domain={['dataMin', 'dataMax']}
                  tickFormatter={(value) => `${value}s`}
                />
                <YAxis />
                <Tooltip formatter={formatTooltip} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="active"
                  stroke="#4CAF50"
                  fill="#4CAF50"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    ) : (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="h6">No data available for time series based on current filters.</Typography>
      </Box>
    )
  );
};

export default TimeSeriesView;