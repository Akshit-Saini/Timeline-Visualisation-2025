import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home/Home';
import Search from './components/Search/Search';
import Slider from './components/Century/Century';
import Timeline from './components/Timeline/Timeline';
import Years from './components/Years/Years';
import Contributors from './components/Contributors/Contributors';
import About from './components/About/About';
import './styles/custom.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
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