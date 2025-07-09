import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Chip,
  IconButton,
  Collapse,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

const FilterPanel = ({ data, onFilterChange }) => {
  const [filters, setFilters] = useState({
    timePeriod: [],
    gender: [],
    birthPlace: [],
    deathPlace: [],
    role: [],
  });
  
  const [expanded, setExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Extract unique values for each filter category
  const uniqueValues = {
    timePeriod: [...new Set(data.map(item => item.timePeriod))].filter(Boolean),
    gender: [...new Set(data.map(item => item.gender))].filter(Boolean),
    birthPlace: [...new Set(data.map(item => item.birthPlace))].filter(Boolean),
    deathPlace: [...new Set(data.map(item => item.deathPlace))].filter(Boolean),
    role: [...new Set(data.map(item => item.role))].filter(Boolean),
  };

  const handleFilterChange = (category, value) => {
    setFilters(prev => {
      const newFilters = {
        ...prev,
        [category]: prev[category].includes(value)
          ? prev[category].filter(item => item !== value)
          : [...prev[category], value]
      };
      
      // Notify parent component of filter changes
      onFilterChange({ ...newFilters, searchTerm });
      return newFilters;
    });
  };

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    onFilterChange({ ...filters, searchTerm: value });
  };

  const clearFilters = () => {
    setFilters({
      timePeriod: [],
      gender: [],
      birthPlace: [],
      deathPlace: [],
      role: [],
    });
    setSearchTerm('');
    onFilterChange({});
  };

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 2, 
        mb: 2,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: '0 4px 20px rgba(33, 150, 243, 0.15)',
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <FilterListIcon sx={{ mr: 1, color: '#2196F3' }} />
        <Typography variant="h6" component="h2" sx={{ color: '#2196F3' }}>
          Filters
        </Typography>
        <IconButton 
          onClick={() => setExpanded(!expanded)}
          sx={{ 
            ml: 'auto',
            color: '#2196F3',
            '&:hover': {
              backgroundColor: 'rgba(33, 150, 243, 0.1)',
            },
          }}
        >
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>

      <Collapse in={expanded}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search by name, place, or role..."
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{ 
            mb: 2,
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: '#2196F3',
              },
              '&:hover fieldset': {
                borderColor: '#21CBF3',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#21CBF3',
              },
            },
          }}
        />

        {Object.entries(uniqueValues).map(([category, values]) => (
          <Box key={category} sx={{ mb: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 1, textTransform: 'capitalize', color: '#2196F3' }}>
              {category.replace(/([A-Z])/g, ' $1').trim()}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {values.map(value => (
                <Chip
                  key={value}
                  label={value}
                  onClick={() => handleFilterChange(category, value)}
                  color={filters[category].includes(value) ? 'primary' : 'default'}
                  sx={{ 
                    m: 0.5,
                    '&:hover': {
                      backgroundColor: filters[category].includes(value) ? '#1976D2' : '#E3F2FD',
                    },
                  }}
                />
              ))}
            </Box>
          </Box>
        ))}

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Typography
            variant="body2"
            color="primary"
            sx={{ 
              cursor: 'pointer',
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
            onClick={clearFilters}
          >
            Clear All Filters
          </Typography>
        </Box>
      </Collapse>
    </Paper>
  );
};

export default FilterPanel; 