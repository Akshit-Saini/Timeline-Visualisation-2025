import React, { useState } from 'react';
import { Box, Typography, Slider, TextField, Button, useTheme } from '@mui/material';

const FancyRangeSlider = () => {
  const theme = useTheme();
  const [range, setRange] = useState([1200, 1900]);

  const handleSliderChange = (event, newValue) => {
    setRange(newValue);
  };

  const handleInputChange = (index, event) => {
    let value = Number(event.target.value);
    if (value >= 0 && value <= 2025) {
      const newRange = [...range];
      newRange[index] = value;
      setRange(newRange);
    }
  };

  const handleExploreClick = () => {
    alert(`Selected range: ${range[0]} - ${range[1]}`);
    // You can navigate or trigger data fetch here
  };

  return (
    <Box
      sx={{
        background: 'linear-gradient(135deg, #181818 60%, #232526 100%)',
        backdropFilter: 'blur(10px)',
        p: { xs: 3, md: 6 },
        borderRadius: 5,
        boxShadow: '0 8px 32px 0 rgba(33,150,243,0.15)',
        maxWidth: 700,
        margin: '50px auto',
        textAlign: 'center',
        transition: 'transform 0.3s ease',
        '&:hover': { transform: 'scale(1.02)' },
      }}
    >
      <Typography variant="h4" sx={{ color: '#21CBF3', fontWeight: 700, mb: 1, letterSpacing: 1 }}>
        Choose Time Period
      </Typography>
      <Typography sx={{ color: '#bdbdbd', mb: 3, fontSize: 18 }}>
        Drag the slider or enter years to select your interval
      </Typography>

      <Slider
        value={range}
        min={0}
        max={2025}
        onChange={handleSliderChange}
        valueLabelDisplay="on"
        disableSwap
        sx={{
          color: 'primary.main',
          height: 8,
          '& .MuiSlider-thumb': {
            background: 'linear-gradient(135deg, #21CBF3 60%, #2196F3 100%)',
            border: '2px solid #fff',
            width: 28,
            height: 28,
            boxShadow: '0px 4px 16px rgba(33,203,243,0.18)',
            transition: 'all 0.3s',
            '&:hover': { boxShadow: '0px 0px 18px #21CBF3' },
          },
          '& .MuiSlider-track': {
            background: 'linear-gradient(90deg, #2196F3, #21CBF3, #D1C72E)',
            border: 'none',
            height: 8,
          },
          '& .MuiSlider-rail': {
            opacity: 1,
            backgroundColor: '#222',
            height: 8,
          },
          '& .MuiSlider-valueLabel': {
            background: 'rgba(33,150,243,0.95)',
            color: '#fff',
            borderRadius: 2,
            fontWeight: 700,
            fontSize: 16,
            top: -32,
            boxShadow: '0 2px 8px #21CBF3',
          },
        }}
        aria-labelledby="range-slider"
      />

      <Box sx={{ display: 'flex', justifyContent: 'space-around', gap: 2, my: 4, flexWrap: 'wrap' }}>
        <TextField
          type="number"
          value={range[0]}
          onChange={(e) => handleInputChange(0, e)}
          label="Start Year"
          variant="outlined"
          size="small"
          sx={{
            input: { color: '#fff', textAlign: 'center', fontWeight: 600 },
            label: { color: '#21CBF3', mb: 1 },
            '.MuiOutlinedInput-root': {
              borderRadius: 2,
              background: 'rgba(33,203,243,0.08)',
              borderColor: '#21CBF3',
              color: '#fff',
            },
            width: 140,
          }}
          InputLabelProps={{ style: { color: '#21CBF3', marginBottom: 8 }, shrink: true }}
        />
        <TextField
          type="number"
          value={range[1]}
          onChange={(e) => handleInputChange(1, e)}
          label="End Year"
          variant="outlined"
          size="small"
          sx={{
            input: { color: '#fff', textAlign: 'center', fontWeight: 600 },
            label: { color: '#21CBF3', mb: 1 },
            '.MuiOutlinedInput-root': {
              borderRadius: 2,
              background: 'rgba(33,203,243,0.08)',
              borderColor: '#21CBF3',
              color: '#fff',
            },
            width: 140,
          }}
          InputLabelProps={{ style: { color: '#21CBF3', marginBottom: 8 }, shrink: true }}
        />
      </Box>

      <Typography sx={{ color: '#bdbdbd', fontSize: 14, mb: 3 }}>
        To select a time interval greater than 600 years, enter the start and end dates above.
      </Typography>

      <Button
        variant="contained"
        sx={{
          background: 'linear-gradient(90deg, #21CBF3, #2196F3, #D1C72E)',
          color: '#181818',
          fontWeight: 700,
          fontSize: 18,
          px: 5,
          py: 1.5,
          borderRadius: 3,
          boxShadow: '0 4px 16px 0 rgba(33,203,243,0.12)',
          transition: 'background 0.3s, color 0.3s',
          '&:hover': {
            background: 'linear-gradient(90deg, #D1C72E, #21CBF3, #2196F3)',
            color: '#fff',
          },
        }}
        onClick={handleExploreClick}
      >
        Explore
      </Button>
    </Box>
  );
};

export default FancyRangeSlider;