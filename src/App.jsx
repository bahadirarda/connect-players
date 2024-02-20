import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AnaSayfa from './pages/AnaSayfa';
import EslestirmeEkrani from './pages/EslestirmeEkrani.jsx';
import OdaSayfasi from './pages/OdaSayfasi';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AnaSayfa />} />
        <Route path="/eslestir" element={<EslestirmeEkrani />} />
        <Route path="/oda/:odaId" element={<OdaSayfasi />} />
      </Routes>
    </Router>
  );
}

export default App;
