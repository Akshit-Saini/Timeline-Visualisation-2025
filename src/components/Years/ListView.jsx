// ListView.jsx
import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Grid,
  Chip,
  Box,
  TextField
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import "./Years.css";

// Function to group results by unique URI and combine AOI values
const groupResults = (results) => {
  const groups = results.reduce((acc, item) => {
    const key = item.uri; // use URI as the unique identifier
    if (!acc[key]) {
      // Create new group with a set to store unique AOI values
      acc[key] = { ...item, aois: new Set([item.aoi]) };
    } else {
      acc[key].aois.add(item.aoi);
    }
    return acc;
  }, {});
  // Convert each group's AOI set to an array
  return Object.values(groups).map((group) => ({
    ...group,
    aois: Array.from(group.aois),
  }));
};

const ListView = ({ results, favorites, toggleFavorite }) => {
  // Group the results first
  const groupedResults = groupResults(results);

  // Compute a unique list of AOI values from grouped results
  const allAOISet = new Set();
  groupedResults.forEach((item) => {
    item.aois.forEach((aoi) => allAOISet.add(aoi));
  });
  const allAOIs = Array.from(allAOISet);

  // State for filter chips and search term
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const handleFilterChipToggle = (aoi) => {
    if (selectedFilters.includes(aoi)) {
      setSelectedFilters(selectedFilters.filter((f) => f !== aoi));
    } else {
      setSelectedFilters([...selectedFilters, aoi]);
    }
  };

  // Filter grouped results based on selected AOI filters (AND logic)
  const filteredResults = groupedResults.filter((item) => {
    if (selectedFilters.length === 0) return true;
    return selectedFilters.every((filter) => item.aois.includes(filter));
  });

  // Apply live search filter (case-insensitive) on several fields
  const searchFilteredResults = filteredResults.filter((item) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      item.name.toLowerCase().includes(term) ||
      (item.bio && item.bio.toLowerCase().includes(term)) ||
      item.birthPlace.toLowerCase().includes(term) ||
      item.deathPlace.toLowerCase().includes(term) ||
      item.aois.some((aoi) => aoi.toLowerCase().includes(term))
    );
  });

  return (
    <>
      {/* Top filter section: Filter Chips on the left, Search field on the right */}
      <Box sx={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 2, mb: 2 }}>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {allAOIs.map((aoi, index) => (
            <Chip
              key={index}
              label={aoi}
              clickable
              color={selectedFilters.includes(aoi) ? "primary" : "default"}
              onClick={() => handleFilterChipToggle(aoi)}
            />
          ))}
        </Box>
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ minWidth: 200, borderRadius: 25 }}
        />
      </Box>

      {searchFilteredResults.length === 0 ? (
        <Typography variant="body1" sx={{ mt: 2 }}>
          No records found for the selected filters and search term.
        </Typography>
      ) : (
        <Grid container spacing={2}>
          {searchFilteredResults.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.uri}>
              <Card variant="outlined">
                <CardContent>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="h6">{item.name}</Typography>
                    <IconButton onClick={() => toggleFavorite(item.uri)}>
                      {favorites[item.uri] ? (
                        <StarIcon color="warning" />
                      ) : (
                        <StarBorderIcon />
                      )}
                    </IconButton>
                  </Box>
                  <Typography variant="body2">
                    Birth: {item.birth}{" "}
                    {item.birthPlace !== "Unknown" ? `in ${item.birthPlace}` : ""}
                  </Typography>
                  <Typography variant="body2">
                    Death: {item.death}{" "}
                    {item.deathPlace !== "Unknown" ? `in ${item.deathPlace}` : ""}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Areas of Interest:
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 0.5 }}>
                    {item.aois.map((aoi, idx) => (
                      <Chip key={idx} label={aoi} size="small" color="primary" />
                    ))}
                  </Box>
                  {item.bio && (
                    <Typography variant="body2" sx={{ fontStyle: "italic", mt: 1 }}>
                      {item.bio}
                    </Typography>
                  )}
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    VRTI Link:{" "}
                    <a
                      href={item.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="fancy-link"
                    >
                      {item.uri.length > 30 ? item.uri.slice(0, 27) + "..." : item.uri}
                    </a>
                  </Typography>
                  {item.external && (
                    <Typography variant="body2">
                      External Link:{" "}
                      <a
                        href={item.external}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="fancy-link"
                      >
                        {item.external.length > 30 ? item.external.slice(0, 27) + "..." : item.external}
                      </a>
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </>
  );
};

export default ListView;