import React from 'react';
import Books from './components/Books';
import Checkouts from './components/Checkouts';
import StudentLookup from './components/StudentLookup';
import InventoryScanner from './components/InventoryScanner';

function App() {
  return (
    <div>
      <Books />
      <Checkouts />
      <StudentLookup />
      <InventoryScanner />
    </div>
  );
}

export default App;
