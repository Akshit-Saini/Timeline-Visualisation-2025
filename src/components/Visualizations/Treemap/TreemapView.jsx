import React, { useMemo } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { Treemap, ResponsiveContainer, Tooltip } from 'recharts';

const TreemapView = ({ data }) => {
  const treemapData = useMemo(() => {
    // Create hierarchical data structure
    const timePeriodMap = {};
    
    data.forEach(person => {
      if (person.timePeriod && person.timePeriod !== 'Unknown') {
        if (!timePeriodMap[person.timePeriod]) {
          timePeriodMap[person.timePeriod] = {
            name: person.timePeriod,
            children: {}
          };
        }
        
        // Group by gender within time period
        const gender = person.gender || 'Unknown';
        if (!timePeriodMap[person.timePeriod].children[gender]) {
          timePeriodMap[person.timePeriod].children[gender] = {
            name: gender,
            children: {}
          };
        }
        
        // Group by birth place within gender
        const birthPlace = person.birthPlace || 'Unknown';
        if (!timePeriodMap[person.timePeriod].children[gender].children[birthPlace]) {
          timePeriodMap[person.timePeriod].children[gender].children[birthPlace] = {
            name: birthPlace,
            size: 0
          };
        }
        
        timePeriodMap[person.timePeriod].children[gender].children[birthPlace].size++;
      }
    });

    // Convert the map to the format required by Recharts Treemap
    return Object.values(timePeriodMap).map(period => ({
      name: period.name,
      children: Object.values(period.children).map(gender => ({
        name: gender.name,
        children: Object.values(gender.children)
      }))
    }));
  }, [data]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <Paper sx={{ p: 1, backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
          <Typography variant="body2">
            {data.name}: {data.size || data.value} people
          </Typography>
        </Paper>
      );
    }
    return null;
  };

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 2, 
        height: '600px',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <Typography variant="h6" gutterBottom>
        Hierarchical Distribution
      </Typography>
      <Box sx={{ height: 'calc(100% - 40px)' }}>
        <ResponsiveContainer width="100%" height="100%">
          <Treemap
            data={treemapData}
            dataKey="size"
            ratio={4/3}
            stroke="#fff"
            fill="#8884d8"
          >
            <Tooltip content={<CustomTooltip />} />
          </Treemap>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default TreemapView; 