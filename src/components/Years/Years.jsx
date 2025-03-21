/* global $ */
import React, { useEffect, useRef, useState } from "react";
import { Box, Container, Typography } from '@mui/material';
import Header from '../Header/Header';
import './Years.css';

const Years = () => {
  const sliderRef = useRef(null);
  const [fromYear, setFromYear] = useState(310);
  const [toYear, setToYear] = useState(510);

  useEffect(() => {
    const $ = window.$;

    $(sliderRef.current).ionRangeSlider({
      skin: "flat",
      type: "double",
      min: 121,
      max: 2021,
      from: 310,
      to: 510,
      drag_interval: true,
      max_interval: 600,
      grid: true,
      onStart: (data) => updateInputs(data),
      onChange: (data) => updateInputs(data),
    });

    // Apply fancy style
    $(".irs-bar").css("background", "linear-gradient(90deg, #D1C72E, #b3a611)");
    $(".irs-handle").css("background-color", "#D1C72E");
    $(".irs-from, .irs-to").css({
      "background-color": "#D1C72E",
      "color": "white",
      "border-radius": "50%",
    });

    const instance = $(sliderRef.current).data("ionRangeSlider");

    function updateInputs(data) {
      setFromYear(data.from);
      setToYear(data.to);
    }

    return () => {
      if (instance) {
        instance.destroy();
      }
    };
  }, []);

  const handleFromChange = (e) => {
    const val = Math.max(121, Math.min(e.target.value, toYear));
    setFromYear(val);
    $(sliderRef.current).data("ionRangeSlider").update({ from: val });
  };

  const handleToChange = (e) => {
    const val = Math.min(2021, Math.max(e.target.value, fromYear));
    setToYear(val);
    $(sliderRef.current).data("ionRangeSlider").update({ to: val });
  };

  const handleExplore = () => {
    if (toYear - fromYear > 600) {
      alert(`WARNING: Selected range exceeds 600 years!`);
    }
    console.log(`Selected range: ${fromYear} - ${toYear}`);
    // Query or navigation logic goes here
  };

  return (
    <>
      <Header />
      <Box className="years-hero">
        <Typography className="years-title">Beyond Timelines</Typography>
        <Typography className="years-subtitle">
          Explore Irish Records dating back to the time of the Normans which were destroyed in the opening engagement of the Civil War on June 30th, 1922.
        </Typography>
      </Box>

      <Container maxWidth="md" style={{ marginTop: '40px', marginBottom: '50px' }}>
        <Box className="years-card">
          <Typography variant="h5" className="years-card-title">Choose Time Period</Typography>
          <Typography className="years-instruction">Drag the slider to select your desired interval.</Typography> 

          {/* Slider Section */}
          <input ref={sliderRef} type="text" className="slider-input" />

          <div className="range-inputs">
  <div>
    <label>Start Year</label><br />
    <input
      type="number"
      className="year-input-box"
      value={fromYear}
      onChange={handleFromChange}
    />
  </div>
  <div>
    <label>End Year</label><br />
    <input
      type="number"
      className="year-input-box"
      value={toYear}
      onChange={handleToChange}
    />
  </div>
</div>

          <Typography className="years-instruction-sub">
            To select a time interval greater than 600 years, enter the start and end dates in the fields above.
          </Typography>

          <button className="explore-btn" onClick={handleExplore}>Explore</button>
        </Box>
      </Container>
    </>
  );
};

export default Years;