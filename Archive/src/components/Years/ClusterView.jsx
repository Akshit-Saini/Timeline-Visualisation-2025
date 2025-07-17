// ClusterView.jsx
import React, { useState, useRef, useEffect } from "react";
import ForceGraph2D from "react-force-graph-2d";

// AOI color palette (should match timeline view)
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

function getInitials(name) {
  if (!name) return '';
  const parts = name.split(/\s+/);
  if (parts.length === 1) return parts[0][0];
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Build bipartite nodes:
 * - Person nodes: one per person
 * - AOI nodes: one per unique AOI
 * Then link each Person to each AOI they have.
 */
function buildRadialGraph(results) {
  // 1) Collect all unique AOIs
  const aoiSet = new Set();
  results.forEach(item => {
    const aois = Array.isArray(item.aois) ? item.aois : [item.aoi];
    aois.forEach(a => aoiSet.add(a));
  });
  const aoiList = Array.from(aoiSet);
  // 2) Create AOI nodes
  const aoiNodes = aoiList.map((aoi, i) => ({
    id: `aoi-${i}`,
    type: "aoi",
    aoi,
    color: getAoiColor(aoi, aoiList),
    fx: 400 + 300 * Math.cos((2 * Math.PI * i) / aoiList.length),
    fy: 300 + 200 * Math.sin((2 * Math.PI * i) / aoiList.length),
  }));
  // 3) Create person nodes and links
  const nodes = [...aoiNodes];
  const links = [];
  results.forEach((item, i) => {
    const aois = Array.isArray(item.aois) ? item.aois : [item.aoi];
    aois.forEach(aoi => {
      const aoiIdx = aoiList.indexOf(aoi);
      const angle = Math.random() * 2 * Math.PI;
      const radius = 70 + Math.random() * 30;
      const fx = aoiNodes[aoiIdx].fx + radius * Math.cos(angle);
      const fy = aoiNodes[aoiIdx].fy + radius * Math.sin(angle);
      const personNode = {
        id: `person-${i}-${aoiIdx}`,
        type: "person",
        name: item.name,
        uri: item.uri,
        birth: item.birth,
        death: item.death,
        color: getAoiColor(aoi, aoiList),
        aoi,
        fx,
        fy,
        initials: getInitials(item.name),
      };
      nodes.push(personNode);
      links.push({ source: personNode.id, target: aoiNodes[aoiIdx].id, color: personNode.color });
    });
  });
  return { nodes, links, aoiList, aoiNodes };
}

const BipartiteClusterView = ({ results }) => {
  console.log("BipartiteClusterView => results:", results);

  // Build the bipartite graph from your results
  const { nodes, links, aoiList, aoiNodes } = buildRadialGraph(results);

  // ForceGraph reference
  const fgRef = useRef();

  useEffect(() => {
    if (fgRef.current) {
      fgRef.current.zoomToFit(400, 50);
    }
  }, [nodes, links]);

  // Hover highlighting
  const [hoverNode, setHoverNode] = useState(null);
  const highlightNodes = new Set();
  const highlightLinks = new Set();

  if (hoverNode) {
    highlightNodes.add(hoverNode.id);
    links.forEach((l) => {
      if (l.source === hoverNode.id) {
        highlightNodes.add(l.target);
        highlightLinks.add(l);
      } else if (l.target === hoverNode.id) {
        highlightNodes.add(l.source);
        highlightLinks.add(l);
      }
    });
  }

  // Node color
  const nodeColor = (node) => node.color;

  // Node label (tooltip only)
  const nodeLabel = (node) => {
    if (node.type === "person") {
      return `${node.name}\n${node.birth ? `Birth: ${node.birth}` : ""}${node.death ? `\nDeath: ${node.death}` : ""}`;
    } else {
      return `AOI: ${node.aoi}`;
    }
  };

  // Node rendering
  const nodeCanvasObjectMode = (node) => {
    // Only use 'before' for person nodes so AOI nodes remain fully interactive
    return node.type === 'person' ? 'before' : undefined;
  };

  const nodeCanvasObject = (node, ctx, globalScale) => {
    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    if (node.type === "aoi") {
      ctx.beginPath();
      ctx.arc(node.x, node.y, 32, 0, 2 * Math.PI, false);
      ctx.fillStyle = node.color;
      ctx.shadowColor = node.color;
      ctx.shadowBlur = 18;
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = "#fff";
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.fillStyle = "#fff";
      ctx.globalAlpha = 1;
      ctx.font = `bold ${Math.max(18, 22/globalScale)}px Inter,Roboto,sans-serif`;
      ctx.fillText(node.aoi, node.x, node.y);
    } else {
      // Person node: show only initials, full name on hover
      ctx.beginPath();
      ctx.arc(node.x, node.y, 13, 0, 2 * Math.PI, false);
      ctx.fillStyle = node.color;
      ctx.shadowColor = node.color;
      ctx.shadowBlur = highlightNodes.has(node.id) ? 16 : 6;
      ctx.globalAlpha = highlightNodes.has(node.id) ? 1 : 0.85;
      ctx.fill();
      ctx.lineWidth = highlightNodes.has(node.id) ? 3 : 1.5;
      ctx.strokeStyle = highlightNodes.has(node.id) ? "#fff" : node.color;
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
      ctx.fillStyle = "#fff";
      ctx.font = `bold ${Math.max(11, 13/globalScale)}px Inter,Roboto,sans-serif`;
      ctx.fillText(node.initials, node.x, node.y);
    }
    ctx.restore();
  };

  if (!nodes.length) {
    return <div style={{ margin: 20, color: '#fff' }}>No data for cluster view.</div>;
  }
  if (nodes.length === 1) {
    return <div style={{ margin: 20, color: '#fff' }}>Only one record found. Not enough for a cluster graph.</div>;
  }

  return (
    <div style={{ position: "relative", background: "#181818", borderRadius: 16, boxShadow: "0 4px 24px 0 rgba(33,150,243,0.10)", padding: 16 }}>
      {/* Legend */}
      <div style={{ position: "absolute", top: 12, left: 12, padding: "8px", zIndex: 1, background: "rgba(24,24,24,0.95)", borderRadius: 8, boxShadow: "0 1px 8px #000", color: '#fff', fontFamily: 'Inter,Roboto,sans-serif', fontWeight: 700 }}>
        <div style={{ marginBottom: 6 }}><strong>Legend (AOI):</strong></div>
        {aoiNodes.map((aoiNode, idx) => (
          <div key={aoiNode.aoi} style={{ display: "flex", alignItems: "center", marginTop: "4px" }}>
            <div
              style={{
                width: "18px",
                height: "18px",
                backgroundColor: aoiNode.color,
                marginRight: "10px",
                borderRadius: "50%",
                border: '2px solid #fff',
                boxShadow: `0 0 8px 2px ${aoiNode.color}99`
              }}
            />
            <span style={{ fontSize: "1.05rem", fontWeight: 700 }}>{aoiNode.aoi}</span>
          </div>
        ))}
      </div>
      <ForceGraph2D
        ref={fgRef}
        graphData={{ nodes, links }}
        width={900}
        height={600}
        backgroundColor="#181818"
        nodeColor={nodeColor}
        nodeLabel={nodeLabel}
        linkColor={(link) => (highlightLinks.has(link) ? "#fff" : link.color || "#999")}
        linkWidth={(link) => (highlightLinks.has(link) ? 3 : 1.5)}
        nodeCanvasObjectMode={nodeCanvasObjectMode}
        nodeCanvasObject={nodeCanvasObject}
        onNodeHover={(node) => {
          setHoverNode(node || null);
          const container = fgRef.current && fgRef.current.container && fgRef.current.container();
          if (container) {
            container.style.cursor = node && node.type === "person" ? "pointer" : "";
          } else {
            document.body.style.cursor = node && node.type === "person" ? "pointer" : "";
          }
        }}
        onNodeClick={(node) => {
          if (node.type === "person" && node.uri) window.open(node.uri, "_blank");
        }}
        linkDistance={120}
        enableZoomPanInteraction={true}
        minZoom={0.1}
        maxZoom={8}
        cooldownTicks={100}
      />
    </div>
  );
};

export default BipartiteClusterView;