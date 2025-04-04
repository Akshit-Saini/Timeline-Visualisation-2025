// ClusterView.jsx
import React, { useState, useRef, useEffect } from "react";
import ForceGraph2D from "react-force-graph-2d";

/**
 * Build bipartite nodes:
 * - Person nodes: one per person
 * - AOI nodes: one per unique AOI
 * Then link each Person to each AOI they have.
 */
function buildBipartiteGraph(results) {
  // 1) Collect all unique AOIs
  const aoiSet = new Set();
  // We'll store persons in an array
  const personNodes = results.map((item, i) => {
    // If item has multiple AOIs, or a single aoi property
    // We'll assume item.aois is an array of AOI strings
    // If you only have `item.aoi`, wrap it in an array: [item.aoi]
    // Or if you have item.aoi_label, use that
    const aois = Array.isArray(item.aois) ? item.aois : [item.aoi];
    aois.forEach((a) => aoiSet.add(a));
    return {
      id: `person-${i}`,
      type: "person",
      name: item.name,
      uri: item.uri,
      aois
    };
  });

  // 2) Create AOI nodes
  const aoiNodes = Array.from(aoiSet).map((aoi, i) => ({
    id: `aoi-${i}`,
    type: "aoi",
    aoi
  }));

  // 3) Build links: Person -> AOI
  const links = [];
  personNodes.forEach((person) => {
    person.aois.forEach((a) => {
      const aoiNode = aoiNodes.find((n) => n.aoi === a);
      if (aoiNode) {
        links.push({ source: person.id, target: aoiNode.id });
      }
    });
  });

  // 4) Combine into one node list
  const nodes = [...personNodes, ...aoiNodes];
  return { nodes, links };
}

const BipartiteClusterView = ({ results }) => {
  console.log("BipartiteClusterView => results:", results);

  // Build the bipartite graph from your results
  const { nodes, links } = buildBipartiteGraph(results);

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

  // Assign colors: Person vs AOI
  const nodeColor = (node) => {
    if (node.type === "person") return "#4F5D75"; // dusty blue
    if (node.type === "aoi") return "#EF8354";    // soft coral
    return "#999";
  };

  // Node labels
  const nodeLabel = (node) => {
    if (node.type === "person") {
      return `Person: ${node.name}`;
    } else {
      return `AOI: ${node.aoi}`;
    }
  };

  if (!nodes.length) {
    return <div style={{ margin: 20 }}>No data for cluster view.</div>;
  }
  if (nodes.length === 1) {
    return <div style={{ margin: 20 }}>Only one record found. Not enough for a cluster graph.</div>;
  }

  return (
    <div style={{ position: "relative" }}>
      {/* Optional Legend */}
      <div style={{ position: "absolute", top: 0, left: 0, padding: "8px", zIndex: 1 }}>
        <div
          style={{
            background: "rgba(255, 255, 255, 0.9)",
            padding: "8px",
            borderRadius: "4px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
            maxWidth: "200px",
          }}
        >
          <strong>Legend (AOI):</strong>
          {Array.from(new Set(nodes.filter(n => n.type === "aoi").map(n => n.aoi))).map((aoi) => (
            <div key={aoi} style={{ display: "flex", alignItems: "center", marginTop: "4px" }}>
              <div
                style={{
                  width: "12px",
                  height: "12px",
                  backgroundColor: nodeColor({ type: "aoi", aoi }),
                  marginRight: "6px",
                  borderRadius: "2px",
                }}
              />
              <span style={{ fontSize: "0.85rem" }}>{aoi}</span>
            </div>
          ))}
        </div>
      </div>

      <ForceGraph2D
        ref={fgRef}
        graphData={{ nodes, links }}
        width={900}
        height={600}
        nodeColor={nodeColor}
        nodeLabel={nodeLabel}
        linkColor={(link) => (highlightLinks.has(link) ? "#f00" : "#999")}
        linkWidth={(link) => (highlightLinks.has(link) ? 2.5 : 1)}
        nodeCanvasObjectMode={(node) => (highlightNodes.has(node.id) ? "before" : undefined)}
        nodeCanvasObject={(node, ctx) => {
          ctx.beginPath();
          ctx.arc(node.x, node.y, 8, 0, 2 * Math.PI, false);
          ctx.strokeStyle = "#f00";
          ctx.lineWidth = 2;
          ctx.stroke();
        }}
        onNodeHover={(node) => setHoverNode(node || null)}
        onNodeClick={(node) => {
          if (node.type === "person" && node.uri) window.open(node.uri, "_blank");
        }}
        linkDistance={120}
        // Enable zoom and pan interactions:
        enableZoomPanInteraction={true}
        minZoom={0.1}
        maxZoom={8}
      />
    </div>
  );
};

export default BipartiteClusterView;