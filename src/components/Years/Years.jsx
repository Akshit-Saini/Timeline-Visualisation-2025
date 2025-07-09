// Years.jsx
import React, { useState } from "react";
import { Box, Typography, Button, TextField, Paper, Slider } from "@mui/material";
import Header from "../Header/Header";
import "./Years.css";
import YearsTabs from "./YearsTabs"; // Import your multi-tab view

const minYear = 121;
const maxYear = 2021;
const maxInterval = 600;

function valuetext(value) {
  return `${value}`;
}

const Years = () => {
  const [yearRange, setYearRange] = useState([310, 510]);
  const [exploreTrigger, setExploreTrigger] = useState(0);

  const handleSliderChange = (event, newValue) => {
    setYearRange(newValue);
  };

  const handleFromChange = (e) => {
    let val = parseInt(e.target.value, 10);
    if (isNaN(val)) val = minYear;
    val = Math.max(minYear, Math.min(val, yearRange[1]));
    setYearRange([val, yearRange[1]]);
  };

  const handleToChange = (e) => {
    let val = parseInt(e.target.value, 10);
    if (isNaN(val)) val = maxYear;
    val = Math.min(maxYear, Math.max(val, yearRange[0]));
    setYearRange([yearRange[0], val]);
  };

  const handleExplore = () => {
    setExploreTrigger((prev) => prev + 1);
  };

  return (
    <Box sx={{ bgcolor: "#000", minHeight: "100vh", width: "100%", m: 0, p: 0 }}>
      <Header />
      <Box
        sx={{
          background:
            'linear-gradient(rgba(0,0,0,0.7),rgba(0,0,0,0.7)), url("/pic/banner-page1.png")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          textAlign: "center",
          py: { xs: 8, md: 10 },
          color: "#fff",
          position: "relative",
        }}
      >
        <Typography
          sx={{
            color: "#2196F3",
            fontWeight: 700,
            fontSize: { xs: "2.2rem", md: "3.2rem" },
            mb: 2,
            letterSpacing: 1,
            zIndex: 1,
            position: "relative",
          }}
        >
          Beyond Timelines
        </Typography>
        <Typography
          sx={{
            color: "#e0e0e0",
            fontSize: { xs: "1.1rem", md: "1.3rem" },
            maxWidth: 800,
            mx: "auto",
            zIndex: 1,
            position: "relative",
          }}
        >
          Explore Irish Records dating back to the time of the Normans which were destroyed in the opening engagement of the Civil War on June 30th, 1922.
        </Typography>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", mt: -8, mb: 4 }}>
        <Paper
          elevation={6}
          sx={{
            px: { xs: 2, md: 6 },
            py: { xs: 4, md: 5 },
            borderRadius: 5,
            background: "rgba(20, 20, 20, 0.85)",
            backdropFilter: "blur(8px)",
            boxShadow: "0 8px 32px 0 rgba(33,150,243,0.15)",
            maxWidth: 600,
            width: "100%",
            textAlign: "center",
          }}
        >
          <Typography variant="h5" sx={{ color: "#2196F3", fontWeight: 700, mb: 2 }}>
            Choose Time Period
          </Typography>
          <Typography sx={{ color: "#bdbdbd", mb: 2 }}>
            Drag the slider to select your desired interval.
          </Typography>
          <Box sx={{ px: { xs: 0, md: 2 }, mt: 4, mb: 3 }}>
            <Slider
              getAriaLabel={() => 'Year range'}
              value={yearRange}
              onChange={handleSliderChange}
              valueLabelDisplay="on"
              min={minYear}
              max={maxYear}
              step={1}
              disableSwap
              sx={{
                color: '#2196F3',
                height: 6,
                '& .MuiSlider-thumb': {
                  borderRadius: 2,
                  backgroundColor: '#2196F3',
                  border: '2px solid #fff',
                  width: 24,
                  height: 24,
                  boxShadow: '0 2px 8px rgba(33,150,243,0.2)',
                },
                '& .MuiSlider-rail': {
                  opacity: 1,
                  backgroundColor: '#222',
                },
                '& .MuiSlider-track': {
                  background: 'linear-gradient(90deg, #2196F3, #21CBF3)',
                  border: 'none',
                },
                '& .MuiSlider-valueLabel': {
                  background: 'rgba(33,150,243,0.95)',
                  color: '#fff',
                  borderRadius: 2,
                  fontWeight: 700,
                  fontSize: 16,
                  top: -32,
                },
              }}
              valueLabelFormat={valuetext}
              aria-labelledby="range-slider"
            />
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, mb: 2, mt: 2 }}>
            <TextField
              label="Start Year"
              type="number"
              value={yearRange[0]}
              onChange={handleFromChange}
              variant="outlined"
              size="small"
              sx={{
                input: { color: "#fff", textAlign: "center", fontWeight: 600 },
                label: { color: "#2196F3", mb: 1 },
                ".MuiInputLabel-root": { mb: 1 },
                ".MuiOutlinedInput-root": {
                  borderRadius: 2,
                  background: "rgba(33,150,243,0.08)",
                  borderColor: "#2196F3",
                  color: "#fff",
                },
                width: 140,
              }}
              InputLabelProps={{ style: { color: "#2196F3", marginBottom: 8 }, shrink: true }}
            />
            <TextField
              label="End Year"
              type="number"
              value={yearRange[1]}
              onChange={handleToChange}
              variant="outlined"
              size="small"
              sx={{
                input: { color: "#fff", textAlign: "center", fontWeight: 600 },
                label: { color: "#2196F3", mb: 1 },
                ".MuiInputLabel-root": { mb: 1 },
                ".MuiOutlinedInput-root": {
                  borderRadius: 2,
                  background: "rgba(33,150,243,0.08)",
                  borderColor: "#2196F3",
                  color: "#fff",
                },
                width: 140,
              }}
              InputLabelProps={{ style: { color: "#2196F3", marginBottom: 8 }, shrink: true }}
            />
          </Box>
          <Typography sx={{ color: "#bdbdbd", fontSize: 13, mb: 3 }}>
            To select a time interval greater than 600 years, enter the start and end dates manually.
          </Typography>
          <Button
            variant="contained"
            onClick={handleExplore}
            sx={{
              background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
              color: "#fff",
              borderRadius: 3,
              px: 4,
              py: 1.5,
              fontWeight: 700,
              fontSize: "1.1rem",
              boxShadow: "0 3px 10px 2px rgba(33, 203, 243, .15)",
              textTransform: "none",
              '&:hover': {
                background: "linear-gradient(45deg, #1976D2 30%, #1CB5E0 90%)",
              },
            }}
          >
            Explore
          </Button>
        </Paper>
      </Box>
      <YearsTabs
        fromYear={yearRange[0].toString().padStart(4, "0")}
        toYear={yearRange[1].toString().padStart(4, "0")}
        exploreTrigger={exploreTrigger}
      />
    </Box>
  );
};

export default Years;