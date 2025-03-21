import React, { useState } from 'react';
import { Box, Typography, Slider, TextField, Button } from '@mui/material';
import './RangeSlider.css';

const FancyRangeSlider = () => {
  const [range, setRange] = useState([1200, 1900]);

  const handleSliderChange = (event, newValue) => {
    setRange(newValue);
  };

  const handleInputChange = (index, event) => {
    let value = Number(event.target.value);
    if (value >= 0 && value <= 2025) {  // Bound check
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
    <Box className="range-card">
      <Typography className="range-title">Choose Time Period</Typography>
      <Typography className="range-sub">Drag the slider to select your desired interval</Typography>

      <Slider
        value={range}
        min={0}
        max={2025}
        onChange={handleSliderChange}
        valueLabelDisplay="auto"
        sx={{
          color: '#D1C72E',
          height: 8,
          '& .MuiSlider-thumb': {
            backgroundColor: '#fff',
            border: '2px solid #D1C72E',
            boxShadow: '0px 4px 10px rgba(0,0,0,0.3)',
            '&:hover': { boxShadow: '0px 0px 15px #D1C72E' }
          },
          '& .MuiSlider-track': {
            background: 'linear-gradient(90deg, #D1C72E, #8AC926)',
          }
        }}
      />

      <Box className="range-inputs">
        <TextField
          type="number"
          value={range[0]}
          onChange={(e) => handleInputChange(0, e)}
          label="Start Year"
          className="range-input"
        />
        <TextField
          type="number"
          value={range[1]}
          onChange={(e) => handleInputChange(1, e)}
          label="End Year"
          className="range-input"
        />
      </Box>

      <Typography className="range-info">
        To select a time interval greater than 600 years, enter the start and end dates in the fields above.
      </Typography>

      <Button variant="outlined" className="explore-btn" onClick={handleExploreClick}>Explore</Button>
    </Box>
  );
};

export default FancyRangeSlider;