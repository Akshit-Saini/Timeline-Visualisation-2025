import React, { useMemo } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import Sankey from 'react-sankey';

const SankeyDiagram = ({ data }) => {
  const sankeyData = useMemo(() => {
    const nodes = [];
    const links = [];
    const nodeMap = new Map(); // Map to store node name to index mapping

    // Create nodes for birth places, death places, and time periods
    const birthPlaces = new Set();
    const deathPlaces = new Set();
    const timePeriods = new Set();

    data.forEach(person => {
      if (person.birthPlace && person.birthPlace !== 'Unknown') {
        birthPlaces.add(person.birthPlace);
      }
      if (person.deathPlace && person.deathPlace !== 'Unknown') {
        deathPlaces.add(person.deathPlace);
      }
      if (person.timePeriod && person.timePeriod !== 'Unknown') {
        timePeriods.add(person.timePeriod);
      }
    });

    // Add nodes and populate the nodeMap
    let nodeIndex = 0;
    birthPlaces.forEach(place => {
      if (place) {
        const name = `Birth: ${place}`;
        nodes.push({ name });
        nodeMap.set(name, nodeIndex++);
      }
    });
    timePeriods.forEach(period => {
      if (period) {
        nodes.push({ name: period });
        nodeMap.set(period, nodeIndex++);
      }
    });
    deathPlaces.forEach(place => {
      if (place) {
        const name = `Death: ${place}`;
        nodes.push({ name });
        nodeMap.set(name, nodeIndex++);
      }
    });

    console.log("Generated Nodes:", nodes);
    console.log("Generated NodeMap:", nodeMap);

    // Create links using node indices
    data.forEach(person => {
      const birthPlaceName = person.birthPlace && person.birthPlace !== 'Unknown' ? `Birth: ${person.birthPlace}` : null;
      const deathPlaceName = person.deathPlace && person.deathPlace !== 'Unknown' ? `Death: ${person.deathPlace}` : null;
      const timePeriodName = person.timePeriod && person.timePeriod !== 'Unknown' ? person.timePeriod : null;

      if (birthPlaceName && timePeriodName) {
        const sourceIndex = nodeMap.get(birthPlaceName);
        const targetIndex = nodeMap.get(timePeriodName);
        // Ensure both source and target nodes exist before creating the link
        if (sourceIndex !== undefined && targetIndex !== undefined) {
          links.push({
            source: sourceIndex,
            target: targetIndex,
            value: 1
          });
        }
      }

      if (timePeriodName && deathPlaceName) {
        const sourceIndex = nodeMap.get(timePeriodName);
        const targetIndex = nodeMap.get(deathPlaceName);
         // Ensure both source and target nodes exist before creating the link
         if (sourceIndex !== undefined && targetIndex !== undefined) {
          links.push({
            source: sourceIndex,
            target: targetIndex,
            value: 1
          });
        }
      }
    });

    console.log("Generated Links:", links);

    return { nodes, links };
  }, [data]);

  // Custom tooltip formatter
  // const formatTooltip = (value, name) => {
  //   return [`${value} people`, name.charAt(0).toUpperCase() + name.slice(1)];
  // };

  // Display message if no data
  if (!data || data.length === 0) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="h6">No data available for Sankey diagram based on current filters.</Typography>
      </Box>
    );
  }

   // Validate links before rendering
    if (sankeyData && sankeyData.nodes && sankeyData.links) {
      const nodesLength = sankeyData.nodes.length;
      sankeyData.links.forEach((link, index) => {
        if (link.source < 0 || link.source >= nodesLength || link.target < 0 || link.target >= nodesLength) {
          console.error(`Sankey Validation Error: Invalid link index. Link:`, link, `at index ${index}. Nodes length: ${nodesLength}`);
        }
      });
    }

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
        Life Transitions
      </Typography>
      <Box sx={{ height: 'calc(100% - 40px)' }}>
        {sankeyData.nodes.length > 0 && sankeyData.links.length > 0 ? (
          <Sankey
            key={JSON.stringify(sankeyData)}
            data={sankeyData}
            nodeWidth={20}
            nodePadding={50}
            margin={{ left: 20, right: 20, top: 20, bottom: 20 }}
            linkColor="gradient"
            nodeColor="blue"
            nodeOpacity={0.8}
            linkOpacity={0.4}
          />
        ) : (
           <Box sx={{ p: 2, textAlign: 'center' }}>
             <Typography variant="h6">No data available for Sankey diagram based on current filters.</Typography>
           </Box>
        )}
      </Box>
    </Paper>
  );
};

export default SankeyDiagram; 