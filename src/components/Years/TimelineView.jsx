// TimelineView.jsx
import React, { useEffect, useRef, useState, useMemo } from "react";
import { Box, Button, IconButton, Typography, Tooltip } from "@mui/material";
import { DataSet, Timeline } from "vis-timeline/standalone";
import "vis-timeline/styles/vis-timeline-graph2d.min.css";
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import FitScreenIcon from '@mui/icons-material/FitScreen';
import FullscreenIcon from '@mui/icons-material/Fullscreen';

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
  if (!hex) return false;
  const c = hex.substring(1);
  const rgb = parseInt(c, 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = (rgb >> 0) & 0xff;
  return 0.299 * r + 0.587 * g + 0.114 * b > 186;
}

const TimelineView = ({ results }) => {
  const timelineRef = useRef(null);
  const containerRef = useRef(null);
  const itemsRef = useRef(null);
  const groupsRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

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
    let type = 'range';

    if (!start || isNaN(start.getTime())) {
      start = item.floruitStart ? new Date(item.floruitStart) : null;
    }

    if (!end || isNaN(end.getTime())) {
      end = item.floruitEnd ? new Date(item.floruitEnd) : null;
    }

    if ((!start || isNaN(start.getTime())) && (!end || isNaN(end.getTime()))) {
      console.warn(`Could not find valid dates for item ${item.name}. Skipping.`);
      return null;
    }

    if ((start && !isNaN(start.getTime())) && (!end || isNaN(end.getTime()))) {
      type = 'point';
      end = start;
    }

    return {
      id: idx,
      content: `<div class='timeline-chip' data-timeperiod='${timePeriod}'>${item.name}</div>`,
      start: start,
      end: end,
      type: type,
      title: `<div style='padding:12px 16px;min-width:220px;background:#1a1a1a;border-radius:8px;border:1px solid #333;'>
        <b style='font-size:1.2em;color:#2196F3;'>${item.name}</b><br/>
        ${item.variantName ? `<span style='color:#bbb;font-style:italic;'>Also known as: ${item.variantName}</span><br/>` : ''}
        <span style='color:#fff;'><b>Birth:</b> ${item.birth || "Unknown"}</span><br/>
        <span style='color:#fff;'><b>Death:</b> ${item.death || "Unknown"}</span><br/>
        <span style='color:#fff;'><b>Time Period:</b> ${item.timePeriod || "Unknown"}</span><br/>
        <span style='color:#fff;'><b>Active Period:</b> ${item.floruitStart || "Unknown"} - ${item.floruitEnd || "Unknown"}</span>
        ${item.birthPlace ? `<br/><span style='color:#fff;'><b>Birth Place:</b> ${item.birthPlace}</span>` : ''}
        ${item.deathPlace ? `<br/><span style='color:#fff;'><b>Death Place:</b> ${item.deathPlace}</span>` : ''}
      </div>`,
      group: timePeriod,
      style: `background: linear-gradient(135deg, ${color} 0%, ${color}dd 50%, ${color}aa 100%); color: #fff; border-radius: 20px; border: 3px solid ${color}; font-weight: 700; box-shadow: 0 4px 16px 0 ${color}40; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);`,
      className: `timeline-item timeline-item-timeperiod-${timePeriodList.indexOf(timePeriod)}`,
    }
  });

  const getTimelineGroups = () => timePeriodList.map((timePeriod, idx) => ({
    id: timePeriod,
    content: `<div class="group-content">${timePeriod}</div>`,
    style: `color: ${getAoiColor(timePeriod, timePeriodList)}; font-weight: 700;`,
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
      maxHeight: isFullscreen ? "80vh" : "500px",
      minHeight: "300px",
      orientation: "top",
      showCurrentTime: false,
      tooltip: { 
        followMouse: true,
        overflowMethod: 'flip',
        delay: 200,
        template: function (item) {
          return item.title;
        }
      },
      selectable: true,
      multiselect: false,
      margin: { item: 25, axis: 50 },
      groupOrder: (a, b) => a.id.localeCompare(b.id),
      onInitialDrawComplete: () => {
        setTimeout(() => {
          timelineRef.current.fit();
        }, 100);
      },
      template: function (item, element, data) {
        return item.content;
      },
      zoomMax: 31536000000 * 1000, // 1000 years max zoom out
      zoomMin: 86400000 * 30, // 30 days min zoom in
      showMajorLabels: true,
      showMinorLabels: true,
      height: isFullscreen ? "80vh" : "500px",
      editable: false,
      showTooltips: true,
      tooltipOnItemUpdateTime: true,
      snap: null,
      moveable: true,
      zoomable: true,
      onMove: function (props) {
        // Smooth scrolling
        if (props.event && props.event.type === 'rangechange') {
          // Handle range changes smoothly
        }
      },
      onMouseWheel: function (props) {
        // Smooth zoom on mouse wheel
        return true;
      }
    });

    // Enhanced custom styles
    const style = document.createElement('style');
    let dynamicAoiStyles = "";
    timePeriodList.forEach((timePeriod, idx) => {
      const color = getAoiColor(timePeriod, timePeriodList);
      const textColor = isColorLight(color) ? '#181818' : '#fff';
      dynamicAoiStyles += `
        .timeline-item-timeperiod-${idx} .timeline-chip {
          border-color: ${color} !important;
          background: linear-gradient(135deg, ${color} 0%, ${color}dd 50%, ${color}aa 100%) !important;
          color: #fff !important;
          font-weight: 700 !important;
          font-size: 1.1em !important;
          box-shadow: 0 4px 16px 0 ${color}40 !important;
          text-shadow: 0 1px 2px rgba(0,0,0,0.3) !important;
          letter-spacing: 0.5px !important;
        }
        .timeline-item-timeperiod-${idx} {
          background: linear-gradient(135deg, ${color} 0%, ${color}dd 50%, ${color}aa 100%) !important;
          border-color: ${color} !important;
          color: #fff !important;
          border-radius: 20px !important;
          font-weight: 700 !important;
          box-shadow: 0 4px 16px 0 ${color}40 !important;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }
        .timeline-item-timeperiod-${idx}:hover {
          box-shadow: 0 8px 24px 0 ${color}80, 0 0 20px ${color}40 !important;
          filter: brightness(1.1) drop-shadow(0 0 8px ${color}) !important;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }
        .vis-group:nth-child(${idx + 1}) {
          background: linear-gradient(90deg, ${color}15 0%, transparent 100%) !important;
          border-left: 4px solid ${color} !important;
        }
        .group-content {
          padding: 12px 16px !important;
          font-weight: 700 !important;
          font-size: 1.1em !important;
          text-shadow: 0 1px 2px rgba(0,0,0,0.3) !important;
        }
      `;
    });
    
    style.innerHTML = `
      .timeline-chip {
        padding: 10px 20px;
        border-radius: 20px;
        color: #fff;
        font-weight: 700;
        font-size: 1.1em;
        border: 3px solid #21CBF3;
        box-shadow: 0 4px 16px 0 rgba(33,150,243,0.3);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        cursor: pointer;
        text-align: center;
        font-family: 'Inter', 'Roboto', 'Segoe UI', Arial, sans-serif !important;
        letter-spacing: 0.5px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        text-shadow: 0 1px 2px rgba(0,0,0,0.3);
        user-select: none;
      }
      
      .vis-item:hover .timeline-chip {
        box-shadow: 0 8px 24px 0 rgba(33,203,243,0.6), 0 0 20px rgba(33,203,243,0.4);
        filter: brightness(1.1) drop-shadow(0 0 8px rgba(33,203,243,0.6));
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      .vis-timeline {
        background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
        border: none;
        border-radius: 12px;
        font-family: 'Inter', 'Roboto', 'Segoe UI', Arial, sans-serif;
        box-shadow: inset 0 2px 8px rgba(0,0,0,0.3);
        overflow: hidden;
      }
      
      .vis-timeline .vis-panel.vis-center {
        border: none;
        background: transparent;
      }
      
      .vis-timeline .vis-panel.vis-left {
        border: none;
        background: rgba(255,255,255,0.02);
        backdrop-filter: blur(10px);
      }
      
      .vis-timeline .vis-panel.vis-top {
        border: none;
        background: rgba(255,255,255,0.02);
        backdrop-filter: blur(10px);
      }
      
      .vis-group {
        background: transparent !important;
        border-bottom: 1px solid rgba(255,255,255,0.1);
        transition: background 0.3s ease;
        position: sticky !important;
        top: 0 !important;
        z-index: 10 !important;
      }
      
      .vis-group:hover {
        background: rgba(255,255,255,0.05) !important;
      }
      
      .vis-group:last-child {
        border-bottom: none;
      }
      
      .vis-group-content {
        padding: 12px 16px;
        color: #bbdefb;
        font-weight: 700 !important;
        font-size: 1.1em;
        text-shadow: 0 1px 2px rgba(0,0,0,0.3);
        background: rgba(0,0,0,0.8) !important;
        backdrop-filter: blur(10px);
        border-radius: 0 8px 8px 0;
        position: sticky !important;
        left: 0 !important;
        z-index: 15 !important;
      }
      
      .vis-tooltip {
        background: #1a1a1a !important;
        color: #eee !important;
        border-radius: 12px !important;
        border: 2px solid #21CBF3 !important;
        font-size: 0.95em !important;
        box-shadow: 0 8px 32px rgba(33,150,243,0.3);
        padding: 12px 16px !important;
        backdrop-filter: blur(10px);
        max-width: 300px;
        pointer-events: none !important;
        z-index: 1000 !important;
      }
      
      .vis-time-axis .vis-text {
        fill: #ffffff !important;
        font-weight: 600 !important;
        font-size: 1em !important;
        font-family: 'Inter', 'Roboto', 'Segoe UI', Arial, sans-serif !important;
        letter-spacing: 0.8px !important;
        text-shadow: 0 1px 2px rgba(0,0,0,0.5);
      }
      
      .vis-time-axis .vis-grid.vis-major {
        stroke: rgba(33,150,243,0.4) !important;
        stroke-width: 2px !important;
        opacity: 0.8 !important;
      }
      
      .vis-time-axis .vis-grid.vis-minor {
        stroke: rgba(255,255,255,0.1) !important;
        stroke-width: 1px !important;
        opacity: 0.5 !important;
      }
      
      .vis-time-axis .vis-text.vis-major {
        font-size: 1.1em !important;
        font-weight: 700 !important;
      }
      
      .vis-time-axis .vis-text.vis-minor {
        font-size: 0.9em !important;
        font-weight: 500 !important;
      }
      
      .vis-item.vis-selected {
        border-color: #D1C72E !important;
        box-shadow: 0 0 20px rgba(209,199,46,0.6) !important;
      }
      
      .vis-item.vis-selected .timeline-chip {
        border-color: #D1C72E !important;
        box-shadow: 0 0 20px rgba(209,199,46,0.6) !important;
      }
      
      /* Smooth scrolling */
      .vis-timeline {
        scroll-behavior: smooth;
      }
      
      /* Custom scrollbar */
      .vis-timeline::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }
      
      .vis-timeline::-webkit-scrollbar-track {
        background: rgba(255,255,255,0.1);
        border-radius: 4px;
      }
      
      .vis-timeline::-webkit-scrollbar-thumb {
        background: rgba(33,150,243,0.5);
        border-radius: 4px;
      }
      
      .vis-timeline::-webkit-scrollbar-thumb:hover {
        background: rgba(33,150,243,0.7);
      }
      
      /* Smooth scrolling */
      .vis-timeline {
        scroll-behavior: smooth;
      }
      
      /* Custom scrollbar */
      .vis-timeline::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }
      
      .vis-timeline::-webkit-scrollbar-track {
        background: rgba(255,255,255,0.1);
        border-radius: 4px;
      }
      
      .vis-timeline::-webkit-scrollbar-thumb {
        background: rgba(33,150,243,0.5);
        border-radius: 4px;
      }
      
      .vis-timeline::-webkit-scrollbar-thumb:hover {
        background: rgba(33,150,243,0.7);
      }
      
      ${dynamicAoiStyles}
    `;
    document.head.appendChild(style);

    // Enhanced click handler
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
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, [uniqueResults, timePeriodList, isFullscreen]);

  // Update items and groups when filteredResults change
  useEffect(() => {
    if (timelineRef.current && itemsRef.current && groupsRef.current) {
      itemsRef.current.clear();
      itemsRef.current.add(getTimelineItems());
      groupsRef.current.clear();
      groupsRef.current.add(getTimelineGroups());
      timelineRef.current.fit();
    }
  }, [uniqueResults]);

  const handleZoomIn = () => {
    if (timelineRef.current) {
      timelineRef.current.zoomIn(0.3);
    }
  };

  const handleZoomOut = () => {
    if (timelineRef.current) {
      timelineRef.current.zoomOut(0.3);
    }
  };

  const handleFitToScreen = () => {
    if (timelineRef.current) {
      timelineRef.current.fit();
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <Box
      sx={{
        bgcolor: "#0a0a0a",
        borderRadius: 3,
        boxShadow: "0 8px 32px 0 rgba(33,150,243,0.15)",
        p: 3,
        mt: 2,
        mb: 2,
        overflow: "hidden",
        minHeight: isFullscreen ? "80vh" : 540,
        position: 'relative',
        border: '1px solid rgba(33,150,243,0.2)',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)'
      }}
    >
      <Box sx={{ 
        mb: 2, 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 2
      }}>
        <Typography variant="h6" sx={{ 
          color: '#2196F3', 
          fontWeight: 700,
          textShadow: '0 1px 2px rgba(0,0,0,0.3)'
        }}>
          Historical Timeline ({uniqueResults.length} Records)
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Tooltip title="Zoom In">
            <IconButton
              onClick={handleZoomIn}
              sx={{
                color: '#2196F3',
                border: '1px solid #2196F3',
                '&:hover': {
                  borderColor: '#21CBF3',
                  bgcolor: 'rgba(33,203,243,0.1)',
                  transform: 'scale(1.05)'
                },
                transition: 'all 0.2s ease'
              }}
            >
              <ZoomInIcon />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Zoom Out">
            <IconButton
              onClick={handleZoomOut}
              sx={{
                color: '#2196F3',
                border: '1px solid #2196F3',
                '&:hover': {
                  borderColor: '#21CBF3',
                  bgcolor: 'rgba(33,203,243,0.1)',
                  transform: 'scale(1.05)'
                },
                transition: 'all 0.2s ease'
              }}
            >
              <ZoomOutIcon />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Fit to Screen">
            <IconButton
              onClick={handleFitToScreen}
              sx={{
                color: '#D1C72E',
                border: '1px solid #D1C72E',
                '&:hover': {
                  borderColor: '#FFD700',
                  bgcolor: 'rgba(209,199,46,0.1)',
                  transform: 'scale(1.05)'
                },
                transition: 'all 0.2s ease'
              }}
            >
              <FitScreenIcon />
            </IconButton>
          </Tooltip>
          
          <Tooltip title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}>
            <IconButton
              onClick={toggleFullscreen}
              sx={{
                color: '#FF7043',
                border: '1px solid #FF7043',
                '&:hover': {
                  borderColor: '#FF8A65',
                  bgcolor: 'rgba(255,112,67,0.1)',
                  transform: 'scale(1.05)'
                },
                transition: 'all 0.2s ease'
              }}
            >
              <FullscreenIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      
      <div
        ref={containerRef}
        style={{ 
          width: "100%", 
          minHeight: 320, 
          height: isFullscreen ? "70vh" : 500, 
          opacity: 1,
          borderRadius: '8px',
          overflow: 'hidden'
        }}
      />
    </Box>
  );
};

export default TimelineView;