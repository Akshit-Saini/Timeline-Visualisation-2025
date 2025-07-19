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
  TextField,
  CardActionArea
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import "./Years.css";

// Group results by unique URI and merge repeated fields
function groupResults(results) {
  const grouped = {};
  results.forEach(item => {
    const key = item.uri;
    if (!grouped[key]) {
      grouped[key] = {
        ...item,
        parent: item.parent ? [item.parent] : [],
        child: item.child ? [item.child] : [],
        spouse: item.spouse ? [item.spouse] : [],
        role: item.role ? [item.role] : [],
      };
    } else {
      if (item.parent && !grouped[key].parent.includes(item.parent)) grouped[key].parent.push(item.parent);
      if (item.child && !grouped[key].child.includes(item.child)) grouped[key].child.push(item.child);
      if (item.spouse && !grouped[key].spouse.includes(item.spouse)) grouped[key].spouse.push(item.spouse);
      if (item.role && !grouped[key].role.includes(item.role)) grouped[key].role.push(item.role);
    }
  });
  return Object.values(grouped);
}

const PLACEHOLDER_IMG = "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg";

const ListView = ({ results, favorites, toggleFavorite }) => {
  const [imgError, setImgError] = useState({});

  // Group and merge results by person
  const groupedResults = groupResults(results.filter(item => item && item.uri && item.name));

  const handleImgError = (uri) => {
    setImgError((prev) => ({ ...prev, [uri]: true }));
  };

  return (
    <>
      {groupedResults.length === 0 ? (
        <Typography variant="body1" sx={{ mt: 2 }}>
          No records found for the selected filters.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {groupedResults.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.uri || item.dibId || Math.random()}>
              <Card
                variant="outlined"
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 4,
                  boxShadow: '0 4px 24px 0 rgba(33,150,243,0.10)',
                  bgcolor: '#fff',
                  p: 0,
                  overflow: 'hidden',
                }}
              >
                <Box sx={{ width: '100%', bgcolor: '#f5f7fa', display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2, pb: 0 }}>
                  <img
                    src={(!imgError[item.uri] && item.image) ? item.image : PLACEHOLDER_IMG}
                    alt={item.name}
                    style={{
                      width: '100%',
                      maxWidth: 220,
                      height: 180,
                      objectFit: 'cover',
                      borderRadius: 12,
                      background: '#e0e0e0',
                      marginBottom: 8,
                    }}
                    onError={() => handleImgError(item.uri)}
                  />
                </Box>
                <CardActionArea onClick={() => window.open(item.uri, '_blank')} sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
                  <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', p: 2 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#222', flex: 1, pr: 1, wordBreak: 'break-word' }}>{item.name}</Typography>
                      <IconButton
                        onClick={e => { e.stopPropagation(); toggleFavorite(item.uri); }}
                        sx={{ ml: 1 }}
                      >
                        {favorites[item.uri] ? (
                          <StarIcon color="warning" />
                        ) : (
                          <StarBorderIcon />
                        )}
                      </IconButton>
                    </Box>
                    {item.variantName && (
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        <b>Also known as:</b> {item.variantName}
                      </Typography>
                    )}
                    {item.role && item.role.length > 0 && (
                      <Typography variant="body2" sx={{ mb: 0.5 }}>
                        <b>Role/Occupation:</b> {item.role.join(', ')}
                      </Typography>
                    )}
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      <b>Birth:</b> {item.birth} {item.birthPlace !== "Unknown" && <span>in {item.birthPlace}</span>}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      <b>Death:</b> {item.death} {item.deathPlace !== "Unknown" && <span>in {item.deathPlace}</span>}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      <b>Gender:</b> {item.gender}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      <b>Time Period:</b> {item.timePeriod}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      <b>Active Period:</b> {item.floruitStart} - {item.floruitEnd}
                    </Typography>
                    {item.bioNote && (
                      <Typography variant="body2" sx={{ mb: 0.5, fontStyle: 'italic', color: '#444' }}>
                        <b>Bio:</b> {item.bioNote}
                      </Typography>
                    )}
                    {(item.parent.length > 0 || item.child.length > 0 || item.spouse.length > 0) && (
                      <Box sx={{ mt: 1, mb: 1 }}>
                        {item.parent.map((p, idx) => (
                          <Chip key={"parent-"+idx} label={`Parent: ${p}`} size="small" sx={{ mr: 1, mb: 1, bgcolor: '#e3f2fd', color: '#1976d2' }} />
                        ))}
                        {item.child.map((c, idx) => (
                          <Chip key={"child-"+idx} label={`Child: ${c}`} size="small" sx={{ mr: 1, mb: 1, bgcolor: '#fce4ec', color: '#c2185b' }} />
                        ))}
                        {item.spouse.map((s, idx) => (
                          <Chip key={"spouse-"+idx} label={`Spouse: ${s}`} size="small" sx={{ mr: 1, mb: 1, bgcolor: '#ede7f6', color: '#512da8' }} />
                        ))}
                      </Box>
                    )}
                    <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {item.wikidata && (
                        <Chip
                          label="Wikidata"
                          size="small"
                          color="primary"
                          onClick={e => {
                            e.stopPropagation();
                            window.open(item.wikidata, '_blank');
                          }}
                          sx={{ mb: 1, cursor: 'pointer' }}
                        />
                      )}
                      {item.dibId && (
                        <Chip
                          label="DIB ID"
                          size="small"
                          color="secondary"
                          sx={{ mb: 1, cursor: 'pointer' }}
                          onClick={e => {
                             e.stopPropagation();
                             const dibUrl = item.dibPage || `https://www.dib.ie/biography/${item.dibId}`;
                             window.open(dibUrl, '_blank');
                          }}
                        />
                      )}
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </>
  );
};

export default ListView;