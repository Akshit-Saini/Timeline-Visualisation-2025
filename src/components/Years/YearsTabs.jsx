import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Box, Container, Tabs, Tab, AppBar, Button, Grid, Typography, CircularProgress, Fade } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import ShareIcon from "@mui/icons-material/Share";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import { fetchSparqlResults } from "../../services/sparqlService";
import { generateCSV, downloadCSV, generateSnapshot, generateShareableLink } from "../../utils/export/exportUtils";

// Import sub-views
import ListView from "./ListView";
import TimelineView from "./TimelineView";
import FilterPanel from "../FilterPanel/FilterPanel";
import DataCharts from "../Visualizations/Charts/DataCharts";
import TimeSeriesView from "../Visualizations/TimeSeries/TimeSeriesView";
// import MapView from "./MapView"; // Keep imported but commented out

const YearsTabs = ({ fromYear, toYear, exploreTrigger }) => {
  const [results, setResults] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [favorites, setFavorites] = useState({}); // { uri: true/false }
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Helper to build the SPARQL query dynamically using the original query (no GRAPH blocks)
  const buildSparqlQuery = (fromYear, toYear) => `
    PREFIX crm: <http://erlangen-crm.org/current/>
    PREFIX vrti: <https://www.w3id.org/virtual-treasury/ontology#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX owl: <http://www.w3.org/2002/07/owl#>
    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
    
    SELECT DISTINCT *
    WHERE {
      ?Person a crm:E21_Person;
              crm:P2_has_type ?Gender ;
              vrti:VRTI_ERA  ?TimePeriod .
      OPTIONAL { ?Person crm:P1_is_identified_by ?FirstNameResource .
                 ?FirstNameResource crm:P2_has_type vrti:Forename ;
                                    rdfs:label ?FirstNameLabel . }
      OPTIONAL { ?Person crm:P1_is_identified_by ?FullNameResource .
                 ?FullNameResource crm:P2_has_type vrti:Name ;
                                    rdfs:label ?FullNameLabel . }
      OPTIONAL { ?Person crm:P1_is_identified_by ?Surname .
                 ?Surname crm:P2_has_type vrti:Surname ;
                          rdfs:label ?SurnameLabel . }
      OPTIONAL { ?Person crm:P1_is_identified_by ?VariantNameResource .
                 ?VariantNameResource crm:P2_has_type vrti:NameVariant ;
                                      rdfs:label ?VariantNameLabel . }
      OPTIONAL { ?Person crm:P62i_is_depicted_by ?Image . }
      OPTIONAL { ?Person owl:sameAs ?WikidataPage . }
      OPTIONAL { ?Person vrti:DIB_ID ?DIB_ID . }
      OPTIONAL { ?Person crm:P71i_is_listed_in ?DIB_Page . }
      OPTIONAL {
        ?DeathEvent a crm:E69_Death;
                    crm:P93_took_out_of_existence ?Person .
        OPTIONAL {
          ?DeathEvent crm:P4_has_time-span ?DeathDateResource .
          ?DeathDateResource crm:P81a_end_of_the_begin ?DeathDateLower .
          ?DeathDateResource crm:P82b_end_of_the_end ?DeathDateUpper .  
        }
        OPTIONAL {
          ?DeathEvent crm:P7_took_place_at ?DeathPlaceResource .
          ?DeathPlaceResource rdfs:label ?DeathPlaceLabel .
          FILTER(LANG(?DeathPlaceLabel) = "en")
        }
      }
      OPTIONAL {
        ?BirthEvent a crm:E67_Birth;
                    crm:P98_brought_into_life ?Person .
        OPTIONAL {
          ?BirthEvent crm:P4_has_time-span ?BirthDateResource .
          ?BirthDateResource crm:P81a_end_of_the_begin ?BirthDateLower .
          ?BirthDateResource crm:P82b_end_of_the_end ?BirthDateUpper .
        }
        OPTIONAL {
          ?BirthEvent crm:P7_took_place_at ?BirthPlaceResource .
          ?BirthPlaceResource rdfs:label ?BirthPlaceLabel .
          FILTER(LANG(?BirthPlaceLabel) = "en")
        }
      }
      ?FloruitResource crm:P2_has_type vrti:Floruit ;
                       crm:P4_has_time-span ?FloruitDateResource ;
                       crm:P12_occurred_in_the_presence_of ?Person .
      ?FloruitDateResource crm:P81a_end_of_the_begin ?FloruitLower ;
                           crm:P82b_end_of_the_end ?FloruitUpper .
      BIND(STRAFTER(STR(?TimePeriod), "#") AS ?TimePeriodLabel)
      FILTER(
        (?BirthDateLower >= "${fromYear}"^^xsd:gYear && ?BirthDateLower <= "${toYear}"^^xsd:gYear) ||
        (?BirthDateUpper >= "${fromYear}"^^xsd:gYear && ?BirthDateUpper <= "${toYear}"^^xsd:gYear) ||
        (?DeathDateLower >= "${fromYear}"^^xsd:gYear && ?DeathDateLower <= "${toYear}"^^xsd:gYear) ||
        (?DeathDateUpper >= "${fromYear}"^^xsd:gYear && ?DeathDateUpper <= "${toYear}"^^xsd:gYear) ||
        (?FloruitLower >= "${fromYear}"^^xsd:gYear && ?FloruitLower <= "${toYear}"^^xsd:gYear) ||
        (?FloruitUpper >= "${fromYear}"^^xsd:gYear && ?FloruitUpper <= "${toYear}"^^xsd:gYear)
      )
    }
    ORDER BY ?FullNameLabel
    LIMIT 100
  `;

  // Always use the latest fromYear and toYear props when exploreTrigger changes
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    console.log('Loading data for years:', fromYear, toYear);
    try {
      const query = buildSparqlQuery(fromYear, toYear);
      const data = await fetchSparqlResults(query);
      console.log('Raw data from fetchSparqlResults:', data);
      const parsedResults = (data.results?.bindings || [])
        .map(item => ({
          uri: item.Person?.value,
          name: item.FullNameLabel?.value || '',
          variantName: item.VariantNameLabel?.value || '',
          gender: item.Gender?.value || '',
          timePeriod: item.TimePeriodLabel?.value || '',
          birth: item.BirthDateLower?.value || '',
          birthPlace: item.BirthPlaceLabel?.value || '',
          death: item.DeathDateLower?.value || '',
          deathPlace: item.DeathPlaceLabel?.value || '',
          image: item.Image?.value || '',
          wikidata: item.WikidataPage?.value || '',
          dibId: item.DIB_ID?.value || '',
          dibPage: item.DIB_Page?.value || '',
          floruitStart: item.FloruitLower?.value || '',
          floruitEnd: item.FloruitUpper?.value || '',
          role: item.RoleLabel?.value || '',
          parent: item.ParentLabel?.value || '',
          child: item.ChildLabel?.value || '',
          spouse: item.SpouseLabel?.value || '',
        }))
        .filter(item => item.uri && item.name);
      setResults(parsedResults);
      setDataLoaded(true);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to fetch data. Please check the SPARQL endpoint and query.");
      setLoading(false);
    }
  }, [fromYear, toYear]);

  useEffect(() => {
    if (exploreTrigger > 0) {
      loadData();
    }
    // eslint-disable-next-line
  }, [exploreTrigger, loadData]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const toggleFavorite = (uri) => {
    setFavorites((prev) => ({
      ...prev,
      [uri]: !prev[uri],
    }));
  };

  const handleFilterChange = (newFilters) => {
    // Merge new filters with existing ones. This allows FilterPanel to manage its internal state
    // while this component manages the global filter state.
    setFilters(prevFilters => ({
        ...prevFilters,
        ...newFilters,
    }));
  };

  const handleDownload = () => {
    const csvString = generateCSV(filteredResults, filters); // Use filteredResults
    downloadCSV(csvString, `beyond_timeline_${fromYear}_${toYear}.csv`);
  };

  const handleShare = () => {
    const shareableLink = generateShareableLink(filters);
    navigator.clipboard.writeText(shareableLink);
    // You might want to add a snackbar/toast notification here
    alert("Shareable link copied to clipboard!");
  };

  const handleSnapshot = () => {
    const elementId = `tab-content-${activeTab}`;
     // Add a check to ensure the element exists before attempting to snapshot
    const elementToSnapshot = document.getElementById(elementId);
    if (elementToSnapshot) {
        // Temporarily apply styles to make hidden elements visible for snapshot if needed
        // This might be complex depending on how elements are hidden.
        // For now, we assume visible elements are sufficient.

        generateSnapshot(elementId, `beyond_timeline_${fromYear}_${toYear}.png`);

         // Revert styles after snapshot if they were changed
    } else {
        console.error(`Element with id ${elementId} not found for snapshot.`);
        alert("Could not capture snapshot. Please try again.");
    }
  };

  // Apply filters to results before passing to visualizations and list view
  const filteredResults = useMemo(() => {
    let currentFilteredData = [...results];

    if (filters.timePeriod?.length && filters.timePeriod.length > 0) {
      currentFilteredData = currentFilteredData.filter(item =>
        filters.timePeriod.includes(item.timePeriod)
      );
    }

    if (filters.gender?.length && filters.gender.length > 0) {
      currentFilteredData = currentFilteredData.filter(item =>
        filters.gender.includes(item.gender)
      );
    }

    if (filters.birthPlace?.length && filters.birthPlace.length > 0) {
      currentFilteredData = currentFilteredData.filter(item =>
        filters.birthPlace.includes(item.birthPlace)
      );
    }

    if (filters.deathPlace?.length && filters.deathPlace.length > 0) {
      currentFilteredData = currentFilteredData.filter(item =>
        filters.deathPlace.includes(item.deathPlace)
      );
    }

     if (filters.role?.length && filters.role.length > 0) {
      currentFilteredData = currentFilteredData.filter(item =>
        filters.role.includes(item.role)
      );
    }

     // Basic text search filter (can be expanded)
     if (filters.searchTerm && filters.searchTerm !== '') {
        const lowerSearchTerm = filters.searchTerm.toLowerCase();
        currentFilteredData = currentFilteredData.filter(item =>
             (item.name && item.name.toLowerCase().includes(lowerSearchTerm)) ||
             (item.birthPlace && item.birthPlace.toLowerCase().includes(lowerSearchTerm)) ||
             (item.deathPlace && item.deathPlace.toLowerCase().includes(lowerSearchTerm)) ||
             (item.role && item.role.toLowerCase().includes(lowerSearchTerm)) ||
             (item.bioNote && item.bioNote.toLowerCase().includes(lowerSearchTerm))
        );
     }


    return currentFilteredData;
  }, [results, filters]);

  // Loading overlay component
  const LoadingOverlay = () => (
    <Fade in={loading}>
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
        }}
      >
        <CircularProgress size={60} thickness={4} sx={{ color: '#2196F3' }} />
        <Typography variant="h6" sx={{ color: 'white', mt: 2 }}>
          Loading Timeline Data...
        </Typography>
      </Box>
    </Fade>
  );

  return (
    <Container maxWidth="lg">
      <LoadingOverlay />
      {error && (
        <Box sx={{ color: 'error.main', mb: 2 }}>
          <Typography variant="body1">Error: {error}</Typography>
        </Box>
      )}
      <AppBar position="static" color="default">
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Timeline View" />
          <Tab label="List View" />
          <Tab label="Charts" />
          <Tab label="Time Series" />
           {/* Temporarily hide Map View again until coordinate issue is resolved */}
          {/* <Tab label="Map View" /> */}
        </Tabs>
      </AppBar>

      <Box sx={{ position: 'relative' }}>
        {dataLoaded && <FilterPanel data={results} onFilterChange={handleFilterChange} />}

        <Box id={`tab-content-${activeTab}`}>
          {activeTab === 0 && <TimelineView results={filteredResults} />}
          {activeTab === 1 && (
            <ListView
              results={filteredResults}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
            />
          )}
          {activeTab === 2 && <DataCharts data={filteredResults} />}
          {activeTab === 3 && <TimeSeriesView data={filteredResults} />}
           {/* Temporarily hide Map View rendering */}
          {/* {activeTab === 6 && <MapView data={filteredResults} />} */}
        </Box>

        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="textSecondary">
            Data Loaded: {dataLoaded ? 'Yes' : 'No'} | Total Results: {results.length} | Filtered Results: {filteredResults.length}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
        <Button
          variant="contained"
          onClick={() => {}}
          sx={{
            bgcolor: '#2196F3',
            '&:hover': {
              bgcolor: '#21CBF3',
            },
          }}
          disabled
        >
          Explore
        </Button>
        <Box>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={handleDownload}
            sx={{ mr: 1 }}
            disabled={!dataLoaded || filteredResults.length === 0}
          >
            Download CSV
          </Button>
          <Button
            variant="outlined"
            startIcon={<ShareIcon />}
            onClick={handleShare}
            sx={{ mr: 1 }}
            disabled={!dataLoaded || Object.keys(filters).length === 0 || (filters.searchTerm === '' && Object.values(filters).every(val => Array.isArray(val) && val.length === 0))}
          >
            Share
          </Button>
          <Button
            variant="outlined"
            startIcon={<CameraAltIcon />}
            onClick={handleSnapshot}
            disabled={!dataLoaded || filteredResults.length === 0}
          >
            Snapshot
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default YearsTabs;