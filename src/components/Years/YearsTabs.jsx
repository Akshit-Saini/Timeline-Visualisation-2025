import React, { useState, useEffect, useCallback } from "react";
import { Box, Container, Tabs, Tab, AppBar, Button } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import { fetchSparqlResults } from "../../services/sparqlService";

// Import sub-views
import ListView from "./ListView";
import TimelineView from "./TimelineView";
import ClusterView from "./ClusterView";
import MapView from "./MapView";

const YearsTabs = ({ fromYear, toYear }) => {
  const [results, setResults] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [favorites, setFavorites] = useState({}); // { uri: true/false }

  // Wrap loadData in useCallback and include fromYear and toYear as dependencies
  const loadData = useCallback(async () => {
    const query = `
      PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
      PREFIX crm: <http://erlangen-crm.org/current/>
      PREFIX vt_ont: <https://ont.virtualtreasury.ie/ontology#>
      PREFIX owl: <http://www.w3.org/2002/07/owl#>
      PREFIX foaf: <http://xmlns.com/foaf/0.1/>

      SELECT DISTINCT ?normalized_uri ?person_name ?start_date ?end_date
                      ?aoi_label ?birth_place_label ?death_place_label
                      ?bio_note ?external_link
      WHERE {
        ?birth rdf:type crm:E67_Birth ;
               crm:P4_has_time-span ?timespanB ;
               crm:P98_brought_into_life ?person .
        ?timespanB crm:P82a_begin_of_the_begin ?start_date .

        OPTIONAL {
          ?birth crm:P7_took_place_at ?birth_place .
          ?birth_place rdfs:label ?birth_place_label .
        }

        ?death rdf:type crm:E69_Death ;
               crm:P4_has_time-span ?timespanD ;
               crm:P93_took_out_of_existence ?person .
        ?timespanD crm:P82b_end_of_the_end ?end_date .

        OPTIONAL {
          ?death crm:P7_took_place_at ?death_place .
          ?death_place rdfs:label ?death_place_label .
        }

        FILTER (?start_date >= "${fromYear}-01-01"^^xsd:date &&
                ?start_date <= "${toYear}-12-31"^^xsd:date)

        ?person crm:P1_is_identified_by ?appellation .
        ?appellation rdfs:label ?person_name .
        FILTER(CONTAINS(str(?appellation), "normalized-appellation-surname-forename"))

        OPTIONAL { ?person crm:P3_has_note ?bio_note . }
        OPTIONAL { ?person owl:sameAs ?external_link . }

        ?person vt_ont:DIB_area_of_interest ?aoi .
        ?aoi crm:P1_is_identified_by ?aoi_app .
        ?aoi_app rdfs:label ?aoi_label .

        BIND(STR(?person) AS ?normalized_uri)
      }
      ORDER BY ?start_date
    `;
    try {
      const data = await fetchSparqlResults(query);
      const parsedResults = data.results.bindings.map((item) => ({
        name: item.person_name?.value || "Unnamed",
        uri: item.normalized_uri?.value || "",
        birth: item.start_date?.value || "Unknown",
        death: item.end_date?.value || "Unknown",
        aoi: item.aoi_label?.value || "Unknown",
        birthPlace: item.birth_place_label?.value || "Unknown",
        deathPlace: item.death_place_label?.value || "Unknown",
        bio: item.bio_note?.value || null,
        external: item.external_link?.value || null,
      }));
      setResults(parsedResults);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  }, [fromYear, toYear]);

  // useEffect now depends on loadData, which is updated when fromYear/toYear change
  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const toggleFavorite = (uri) => {
    setFavorites((prev) => ({
      ...prev,
      [uri]: !prev[uri],
    }));
  };

  const downloadCSV = () => {
    const csvRows = [];
    const headers = [
      "Name",
      "Birth",
      "Death",
      "Area of Interest",
      "Birth Place",
      "Death Place",
      "Bio",
      "VRTI Link",
      "External Link",
    ];
    csvRows.push(headers.join(","));
    results.forEach((item) => {
      const row = [
        `"${item.name}"`,
        `"${item.birth}"`,
        `"${item.death}"`,
        `"${item.aoi}"`,
        `"${item.birthPlace}"`,
        `"${item.deathPlace}"`,
        `"${item.bio ? item.bio.replace(/"/g, '""') : ""}"`,
        `"${item.uri}"`,
        `"${item.external || ""}"`,
      ];
      csvRows.push(row.join(","));
    });
    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", "results.csv");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <Container maxWidth="lg">
      <AppBar position="static" color="default">
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="List View" />
          <Tab label="Timeline View" />
          <Tab label="Map View" />
          <Tab label="Cluster View" />
        </Tabs>
      </AppBar>
      <Box sx={{ p: 3 }}>
        {activeTab === 0 && (
          <ListView
            results={results}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
          />
        )}
        {activeTab === 1 && <TimelineView results={results} />}
        {activeTab === 2 && <MapView results={results} />}
        {activeTab === 3 && <ClusterView results={results} />}
      </Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
        <Button
          variant="outlined"
          startIcon={<DownloadIcon />}
          onClick={downloadCSV}
        >
          Download CSV
        </Button>
      </Box>
    </Container>
  );
};

export default YearsTabs;