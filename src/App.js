import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home/Home.jsx';
// import Search from './components/Search/Search.jsx';
import Slider from './components/Century/Century.jsx';
import Timeline from './components/Timeline/Timeline.jsx';
import Years from './components/Years/Years.jsx';
import Contributors from './components/Contributors/Contributors.jsx';
import About from './components/About/About.jsx';
import './styles/custom.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/search" element={<Search />} /> */}
        <Route path="/slider" element={<Slider />} />
        <Route path="/timeline" element={<Timeline />} />
        <Route path="/years" element={<Years />} />
        <Route path="/about" element={<About />} />
        <Route path="/contributors" element={<Contributors />} />
        {/* Add About and Contributors pages later */}
      </Routes>
    </Router>
  );
}

export default App;