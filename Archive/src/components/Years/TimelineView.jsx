// TimelineView.jsx
import React, { useEffect, useRef, useState, useMemo } from "react";
import { Box, Button, IconButton } from "@mui/material";
import { DataSet, Timeline } from "vis-timeline/standalone";
import "vis-timeline/styles/vis-timeline-graph2d.min.css";
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';

// Generate a color palette for AOIs
const AOI_COLORS = [
  '#2196F3', // blue
  '#D1C72E', // gold
  '#21CBF3', // cyan
  '#FF7043', // orange
  '#AB47BC', // purple
  '#66BB6A', // green
  '#FFA726', // amber
  '#EC407A', // pink
  '#29B6F6', // light blue
  '#8D6E63', // brown
];

function getAoiColor(aoi, aoiList) {
  const idx = aoiList.indexOf(aoi);
  return AOI_COLORS[idx % AOI_COLORS.length];
}

function isColorLight(hex) {
  // Simple luminance check for text color
  if (!hex) return false;
  const c = hex.substring(1); // strip #
  const rgb = parseInt(c, 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = (rgb >> 0) & 0xff;
  // Perceived luminance
  return 0.299 * r + 0.587 * g + 0.114 * b > 186;
}

const TimelineView = ({ results }) => {
  const timelineRef = useRef(null);
  const containerRef = useRef(null);
  const itemsRef = useRef(null);
  const groupsRef = useRef(null);

  // De-duplicate results and consolidate data for each person
  const uniqueResults = useMemo(() => {
    const personMap = new Map();
    results.filter(item => item && item.uri && item.name).forEach(item => {
      if (item.uri) {
        if (!personMap.has(item.uri)) {
          personMap.set(item.uri, { ...item });
        }
      } else {
        personMap.set(Symbol(), { ...item });
      }
    });
    return Array.from(personMap.values());
  }, [results]);

  // Get unique time periods for color mapping
  const timePeriodList = Array.from(new Set(uniqueResults.map(r => r.timePeriod || "Other")));

  // Prepare items and groups for vis-timeline
  const getTimelineItems = () => uniqueResults.map((item, idx) => {
    const timePeriod = item.timePeriod || "Other";
    const color = getAoiColor(timePeriod, timePeriodList);

    let start = item.birth ? new Date(item.birth) : null;
    let end = item.death ? new Date(item.death) : null;
    let type = 'range'; // Default to range type

    if (!start || isNaN(start.getTime())) {
      // If birth date is missing or invalid, try floruit start
      start = item.floruitStart ? new Date(item.floruitStart) : null;
    }

    if (!end || isNaN(end.getTime())) {
      // If death date is missing or invalid, try floruit end
      end = item.floruitEnd ? new Date(item.floruitEnd) : null;
    }

    if ((!start || isNaN(start.getTime())) && (!end || isNaN(end.getTime()))) {
      // If no valid dates available after checking all options, skip this item
      console.warn(`Could not find valid dates (birth/death or floruit) for item ${item.name}. Skipping.`);
      return null; // Skip this item
    }

    // Ensure start and end are valid Date objects or strings parsable by vis-timeline
    // Assuming item.birth, item.death, item.floruitStart, item.floruitEnd are in a format vis-timeline can understand (e.g., YYYY-MM-DD)

    // If only start date is available, treat it as a point
    if ((start && !isNaN(start.getTime())) && (!end || isNaN(end.getTime()))) {
      type = 'point';
      // If it's a point, the end date is not needed or should be the same as start
      end = start; // For point type, vis-timeline often uses start date for positioning
    }

    return {
      id: idx,
      content: `<div class='timeline-chip' data-timeperiod='${timePeriod}'>${item.name}</div>`,
      start: start,
      end: end, // Only include end if type is 'range'
      type: type,
      title: `<div style='padding:8px 12px;min-width:180px;'>
        <b style='font-size:1.1em;'>${item.name}</b><br/>
        ${item.variantName ? `<span style='color:#bbb;'>Also known as: ${item.variantName}</span><br/>` : ''}
        <span><b>Birth:</b> ${item.birth || "Unknown"}</span><br/>
        <span><b>Death:</b> ${item.death || "Unknown"}</span><br/>
        <span><b>Time Period:</b> ${item.timePeriod || "Unknown"}</span><br/>
        <span><b>Active Period:</b> ${item.floruitStart || "Unknown"} - ${item.floruitEnd || "Unknown"}</span>
      </div>`,
      group: timePeriod,
      style: `background: linear-gradient(90deg, ${color} 60%, #181818 100%); color: #fff; border-radius: 18px; border: 2.5px solid ${color}; font-weight: 600; box-shadow: 0 2px 12px 0 ${color}33; transition: transform 0.2s, box-shadow 0.2s;`,
      className: `timeline-item timeline-item-timeperiod-${timePeriodList.indexOf(timePeriod)}`,
    }
  });

  const getTimelineGroups = () => timePeriodList.map((timePeriod, idx) => ({
    id: timePeriod,
    content: timePeriod,
    style: `color: ${getAoiColor(timePeriod, timePeriodList)}; font-weight: 600;`,
  }));

  // Only create/destroy timeline on mount/unmount
  useEffect(() => {
    if (!containerRef.current) return;
    itemsRef.current = new DataSet(getTimelineItems());
    groupsRef.current = new DataSet(getTimelineGroups());

    timelineRef.current = new Timeline(containerRef.current, itemsRef.current, groupsRef.current, {
      stack: true,
      horizontalScroll: true,
      verticalScroll: true,
      zoomKey: "ctrlKey",
      maxHeight: "500px",
      minHeight: "300px",
      orientation: "top",
      showCurrentTime: false,
      tooltip: { followMouse: true },
      selectable: true,
      multiselect: false,
      margin: { item: 20, axis: 40 }, // Revert item margin
      groupOrder: (a, b) => a.id.localeCompare(b.id),
      onInitialDrawComplete: () => {
        setTimeout(() => {
        }, 350); // short delay for smoothness
        timelineRef.current.fit(); // Revert to original fit
      },
      template: function (item, element, data) {
        return item.content;
      },
      zoomMax: 31536000000 * 500, // Limit zoom out to approximately 500 years
      // Consider implementing clustering for better visualization when zoomed out
      // cluster: true,
      // clusterOptions: {
      //   maxItems: 5, // Maximum number of items in a cluster
      //   clusterCriteria: function(a, b) {
      //     return Math.abs(a.start - b.start) < 1000 * 60 * 60 * 24 * 365; // Cluster if items are within a year
      //   },
      //   clusterGenerator: function(cluster) {
      //     // Customize cluster appearance
      //     return { ...cluster, content: 'Cluster: ' + cluster.count + ' items' };
      //   },
      // },

      // Further options for improving appearance:
      // showMajorLabels: true, // Show major date labels (e.e., centuries)
      // showMinorLabels: true, // Show minor date labels (e.g., decades)
      // zoomMax: 3153600000000, // Max zoom (e.g., 100 years in ms)
      // zoomMin: 86400000, // Min zoom (e.g., 1 day in ms)


    });

    // Add custom hover effect and styles using CSS class
    const style = document.createElement('style');
    let dynamicAoiStyles = "";
    timePeriodList.forEach((timePeriod, idx) => {
      const color = getAoiColor(timePeriod, timePeriodList);
      const textColor = isColorLight(color) ? '#181818' : '#fff';
      dynamicAoiStyles += `
        .timeline-item-timeperiod-${idx} .timeline-chip {
          border-color: ${color} !important;
          background: ${color} !important;
          color: #fff !important;
          font-weight: 900 !important;
          font-size: 1.12em !important;
          box-shadow: 0 0 16px 2px ${color}99 !important;
        }
        .timeline-item-timeperiod-${idx} {
          /* Re-added gradient background */
          background: linear-gradient(90deg, ${color} 60%, #181818 100%) !important;
          border-color: ${color} !important;
          color: #fff !important;
          border-radius: 18px !important; /* Ensure consistent border radius */
          font-weight: 600 !important; /* Ensure consistent font weight */
          box-shadow: 0 2px 12px 0 ${color}33 !important; /* Ensure consistent box shadow */
        }
        .vis-group:nth-child(${idx + 1}) {
          background-color: ${color}33 !important; /* Add a semi-transparent background to group row */
        }
      `;
    });
    style.innerHTML = `
      .timeline-chip {
        padding: 8px 18px;
        border-radius: 18px;
        color: #fff;
        font-weight: 900;
        font-size: 1.12em;
        border: 2.5px solid #21CBF3;
        box-shadow: 0 2px 12px 0 rgba(33,150,243,0.18);
        transition: transform 0.18s, box-shadow 0.18s;
        cursor: pointer;
        text-align: center;
        font-family: 'Inter', 'Roboto', 'Segoe UI', Arial, sans-serif !important;
        letter-spacing: 1.2px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        padding: 6px 12px;
        border-radius: 12px;
        font-weight: 600;
      }
      .vis-item:hover .timeline-chip {
        transform: scale(1.05);
        box-shadow: 0 4px 18px 0 #21CBF3;
        filter: brightness(1.15);
      }
      .vis-timeline {
        background: linear-gradient(120deg, #121212 80%, #1a1a2e 100%);
        border: none;
        font-family: 'Inter', 'Roboto', 'Segoe UI', Arial, sans-serif;
      }
      .vis-group {
        background: transparent !important;
        border-bottom: 1px solid rgba(255,255,255,0.1);
      }
      .vis-group:last-child {
        border-bottom: none;
      }
      .vis-group-content {
        padding: 10px 0;
        color: #bbdefb;
        font-weight: 700 !important;
        font-size: 1.1em;
      }
      .vis-tooltip {
        background: #2a2a2a !important;
        color: #eee !important;
        border-radius: 8px !important;
        border: 1px solid #21CBF3 !important;
        font-size: 0.95em !important;
        box-shadow: 0 2px 10px 0 rgba(33,150,243,0.2);
        padding: 10px 14px !important;
      }
      .vis-time-axis .vis-text {
        fill: #ffffff !important; /* Solid white color for year labels */
        font-weight: 600 !important;
        font-size: 1em !important;
        font-family: 'Inter', 'Roboto', 'Segoe UI', Arial, sans-serif !important;
        letter-spacing: 0.8px !important;
        text-shadow: none;
      }
      .vis-time-axis .vis-grid.vis-major {
        stroke: rgba(33,150,243,0.4) !important;
        stroke-width: 1px !important;
        opacity: 0.8 !important;
      }
      /* Removed CSS to fix rendering issues */

      /* Custom styles for timeline items within groups */
      ${dynamicAoiStyles}
    `;
    document.head.appendChild(style);

    // Click handler: open VRTI link if available
    timelineRef.current.on("select", function (props) {
      if (props.items.length > 0) {
        const idx = props.items[0];
        const person = uniqueResults[idx];
        if (person && person.uri) {
          window.open(person.uri, "_blank");
        }
      }
    });

    // Clean up
    return () => {
      if (timelineRef.current) {
        timelineRef.current.destroy();
      }
      document.head.removeChild(style);
    };
  }, [uniqueResults, timePeriodList]); // Revert dependencies

  // Update items and groups when filteredResults change
  useEffect(() => {
    if (timelineRef.current && itemsRef.current && groupsRef.current) {
      itemsRef.current.clear();
      itemsRef.current.add(getTimelineItems());
      groupsRef.current.clear();
      groupsRef.current.add(getTimelineGroups());
      timelineRef.current.fit();
    }
    // eslint-disable-next-line
  }, [uniqueResults]); // Revert dependencies

  const handleZoomIn = () => {
    if (timelineRef.current) {
      timelineRef.current.zoomIn(0.2);
    }
  };

  const handleZoomOut = () => {
    if (timelineRef.current) {
      timelineRef.current.zoomOut(0.2);
    }
  };

  return (
    <Box
      sx={{
        bgcolor: "#181818",
        borderRadius: 3,
        boxShadow: "0 4px 24px 0 rgba(33,150,243,0.10)",
        p: 2,
        mt: 2,
        mb: 2,
        overflowX: "auto",
        minHeight: 540,
        position: 'relative',
        overflowY: 'auto'
      }}
    >
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            onClick={handleZoomIn}
            startIcon={<ZoomInIcon />}
            sx={{
              color: '#2196F3',
              borderColor: '#2196F3',
              '&:hover': {
                borderColor: '#21CBF3',
                bgcolor: 'rgba(33,203,243,0.08)',
              }
            }}
          >
            Zoom In
          </Button>
          <Button
            variant="outlined"
            onClick={handleZoomOut}
            startIcon={<ZoomOutIcon />}
            sx={{
              color: '#2196F3',
              borderColor: '#2196F3',
              '&:hover': {
                borderColor: '#21CBF3',
                bgcolor: 'rgba(33,203,243,0.08)',
              }
            }}
          >
            Zoom Out
          </Button>
        </Box>
      </Box>
      <div
        ref={containerRef}
        style={{ width: "100%", minHeight: 320, height: 500, opacity: 1 }}
      />
    </Box>
  );
};

export default TimelineView;