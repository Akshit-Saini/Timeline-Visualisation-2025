// Years.jsx
import React, { useEffect, useRef, useState } from "react";
import { Box, Container, Typography, Button } from "@mui/material";
import Header from "../Header/Header";
import "./Years.css";
import YearsTabs from "./YearsTabs"; // Import your multi-tab view

const Years = () => {
  const sliderRef = useRef(null);
  const [fromYear, setFromYear] = useState("0310");
  const [toYear, setToYear] = useState("0510");
  const [showTabs, setShowTabs] = useState(false);

  useEffect(() => {
    const $ = window.$;

    // Initialize ionRangeSlider
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

    $(".irs-bar").css("background", "linear-gradient(90deg, #D1C72E, #b3a611)");
    $(".irs-handle").css("background-color", "#D1C72E");
    $(".irs-from, .irs-to").css({
      "background-color": "#D1C72E",
      color: "white",
      "border-radius": "50%",
    });

    const instance = $(sliderRef.current).data("ionRangeSlider");

    function updateInputs(data) {
      // Ensure values are 4-digit strings
      setFromYear(data.from.toString().padStart(4, "0"));
      setToYear(data.to.toString().padStart(4, "0"));
    }

    return () => {
      if (instance) {
        instance.destroy();
      }
    };
  }, []);

  const handleFromChange = (e) => {
    const val = Math.max(121, Math.min(e.target.value, toYear));
    setFromYear(val.toString().padStart(4, "0"));
    window.$(sliderRef.current).data("ionRangeSlider").update({ from: val });
  };

  const handleToChange = (e) => {
    const val = Math.min(2021, Math.max(e.target.value, fromYear));
    setToYear(val.toString().padStart(4, "0"));
    window.$(sliderRef.current).data("ionRangeSlider").update({ to: val });
  };

  const handleExplore = () => {
    // When Explore is clicked, show the tabs
    setShowTabs(true);
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
      <Container maxWidth="md" style={{ marginTop: "40px", marginBottom: "50px" }}>
        <Box className="years-card">
          <Typography variant="h5" className="years-card-title">Choose Time Period</Typography>
          <Typography className="years-instruction">
            Drag the slider to select your desired interval.
          </Typography>
          <input ref={sliderRef} type="text" className="slider-input" />
          <div className="range-inputs">
            <div>
              <label>Start Year</label>
              <br />
              <input
                type="number"
                className="year-input-box"
                value={parseInt(fromYear)}
                onChange={handleFromChange}
              />
            </div>
            <div>
              <label>End Year</label>
              <br />
              <input
                type="number"
                className="year-input-box"
                value={parseInt(toYear)}
                onChange={handleToChange}
              />
            </div>
          </div>
          <Typography className="years-instruction-sub" style={{ paddingBottom: "40px" }}>
            To select a time interval greater than 600 years, enter the start and end dates manually.
          </Typography>
          <Button variant="contained" color="primary" onClick={handleExplore}>
            Explore
          </Button>
        </Box>
        {showTabs && <YearsTabs fromYear={fromYear} toYear={toYear} />}
      </Container>
    </>
  );
};

export default Years;