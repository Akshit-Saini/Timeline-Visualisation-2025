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
    const processedData = Object.entries(periodCount)
      .sort((a, b) => a[0].localeCompare(b[0])) // Sort periods alphabetically
      .map(([period, count]) => ({
        period,
        count,
      }));
    console.log("Processed timePeriodData:", processedData);
    return processedData;
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
            periodGenderCount[person.timePeriod] = {
              Male: 0,
              Female: 0,
              Other: 0
            };
          }
          // Normalize gender values
          const normalizedGender = person.gender.trim().toLowerCase();
          if (normalizedGender === 'male') {
            periodGenderCount[person.timePeriod].Male++;
          } else if (normalizedGender === 'female') {
            periodGenderCount[person.timePeriod].Female++;
          } else {
            periodGenderCount[person.timePeriod].Other++;
          }
        }
      });
    }

    // Convert the nested structure to an array suitable for Recharts stacked bar chart
    const formattedData = Object.entries(periodGenderCount)
      .sort((a, b) => a[0].localeCompare(b[0])) // Sort periods alphabetically
      .map(([period, genders]) => ({
        period,
        ...genders,
      }));
     console.log("Processed genderTimePeriodData:", formattedData);
    return formattedData;
  }, [data]);

  // Process data for birth/death place distribution
  const placeData = useMemo(() => {
    console.log("Processing placeData from data:", data);
    const placeCount = {};
    if (data && Array.isArray(data)) {
      data.forEach(person => {
        if (person.birthPlace && person.birthPlace !== 'Unknown') {
          const place = person.birthPlace.trim();
          placeCount[place] = (placeCount[place] || 0) + 1;
        }
      });
    }
    const processedData = Object.entries(placeCount)
      .sort((a, b) => b[1] - a[1]) // Sort by count in descending order
      .slice(0, 10) // Get top 10 places
      .map(([place, count]) => ({
        place: place.length > 20 ? place.substring(0, 20) + '...' : place, // Truncate long place names
        count,
      }));
    console.log("Processed placeData:", processedData);
    return processedData;
  }, [data]);

  // Check if any chart data is available
  const hasChartData = timePeriodData.length > 0 || genderTimePeriodData.length > 0 || placeData.length > 0;

  // Custom tooltip formatter
  const formatTooltip = (value, name) => {
    return [`${value} people`, name.charAt(0).toUpperCase() + name.slice(1)];
  };

  // Display message if no data
  if (!data || data.length === 0) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="h6">No data available for charts based on current filters.</Typography>
      </Box>
    );
  }

  return (
    hasChartData ? (
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
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={timePeriodData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="period" 
                  angle={-45}
                  textAnchor="end"
                  height={70}
                />
                <YAxis />
                <Tooltip formatter={formatTooltip} />
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
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={genderTimePeriodData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="period" 
                  angle={-45}
                  textAnchor="end"
                  height={70}
                />
                <YAxis />
                <Tooltip formatter={formatTooltip} />
                <Legend />
                <Bar dataKey="Male" fill="#2196F3" stackId="a" />
                <Bar dataKey="Female" fill="#E91E63" stackId="a" />
                <Bar dataKey="Other" fill="#FF9800" stackId="a" />
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
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={placeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="place" 
                  angle={-45}
                  textAnchor="end"
                  height={70}
                />
                <YAxis />
                <Tooltip formatter={formatTooltip} />
                <Legend />
                <Bar dataKey="count" fill="#4CAF50" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    ) : (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="h6">No data available for charts based on current filters.</Typography>
      </Box>
    )
  );
};

export default DataCharts;