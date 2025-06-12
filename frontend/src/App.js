import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Books from './components/Books';
import Checkouts from './components/Checkouts';
import InventoryScanner from './components/InventoryScanner';
import StudentLookup from './components/StudentLookup';
import StaffReport from './components/StaffReport';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Books />} />
          <Route path="checkouts" element={<Checkouts />} />
          <Route path="inventory" element={<InventoryScanner />} />
          <Route path="lookup" element={<StudentLookup />} />
          <Route path="reports/staff-checkouts" element={<StaffReport />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
