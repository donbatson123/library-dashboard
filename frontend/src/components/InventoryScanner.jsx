import React, { useState } from 'react';
import axios from 'axios';

export default function InventoryScanner() {
  const [barcode, setBarcode] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const scanBarcode = async (e) => {
    e.preventDefault();
    setResult(null);
    setError(null);

    try {
      const res = await axios.post('http://localhost:8001/api/inventory/scan', null, {
        params: { barcode },
      });
      setResult(res.data);
    } catch (err) {
      setError('Failed to scan. Please try again.');
    }

    setBarcode('');
  };

  return (
    <div style={{ padding: '2rem', borderTop: '1px solid #ccc' }}>
      <h2>📦 Inventory Scanner</h2>
      <form onSubmit={scanBarcode}>
        <input
          type="text"
          value={barcode}
          onChange={(e) => setBarcode(e.target.value)}
          placeholder="Scan or enter barcode"
          style={{ padding: '0.5rem', width: '300px' }}
        />
        <button type="submit" style={{ marginLeft: '1rem', padding: '0.5rem 1rem' }}>
          Scan
        </button>
      </form>

      {result && (
        <div style={{ marginTop: '1rem' }}>
          {result.status === 'found' && (
            <p style={{ color: 'green' }}>
              ✅ Found: RefID <strong>{result.refid || result.book?.refid}</strong>
              {result.book?.title && <> — {result.book.title}</>}
            </p>
          )}
          {result.status === 'not found' && (
            <p style={{ color: 'orange' }}>⚠️ Not found in catalog — please scan ISBN next.</p>
          )}
          {result.status === 'not_found' && result.pending && (
            <p style={{ color: 'blue' }}>
              ℹ️ Already pending — awaiting ISBN: <strong>{result.pending.barcode}</strong>
            </p>
          )}
        </div>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
