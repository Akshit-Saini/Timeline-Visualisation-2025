import TimeSeriesView from "./Visualizations/TimeSeries/TimeSeriesView";

const YearsTabs = ({ fromYear, toYear }) => {
  const [results, setResults] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [favorites, setFavorites] = useState({}); // { uri: true/false }
  const [queryFromYear, setQueryFromYear] = useState(fromYear);
  const [queryToYear, setQueryToYear] = useState(toYear);
  const [filters, setFilters] = useState({});

  // ... existing code ...
}

// ... existing code ...

if (activeTab === 5) {
  return (
    <Box sx={{ mt: 2 }}>
      <TimeSeriesView data={results} />
    </Box>
  );
}

<Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
  // ... existing code ...
</Box>

<Box sx={{ mt: 2 }}>
  <Typography variant="body2">
    Data Loaded: {results.length > 0 ? 'Yes' : 'No'} | Result Count: {results.length}
  </Typography>
</Box>

<Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
  // ... existing code ...
</Box> 