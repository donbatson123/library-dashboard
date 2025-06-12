import React, { useState } from 'react';
import axios from 'axios';
import '../styles/print.css';
import './Report.css';

function StaffReport() {
  const [staffName, setStaffName] = useState('');
  const [checkouts, setCheckouts] = useState([]);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    try {
      const response = await axios.get(`/api/reports/checkouts/by_staff`, {
        params: { staff_name: staffName }
      });
      setCheckouts(response.data);
      setError('');
    } catch (err) {
      setError('Could not fetch report. Try again.');
      setCheckouts([]);
    }
  };

  return (
    <div className="report-container">
      <h2>Checkouts by Staff</h2>
      <input
        type="text"
        value={staffName}
        onChange={(e) => setStaffName(e.target.value)}
        placeholder="Enter staff name"
      />
      <button onClick={handleSearch}>Search</button>
      <button className="print-button" onClick={() => window.print()}>
        Print Report
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {checkouts.length > 0 && (
        <table className="report-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Book Title</th>
              <th>Barcode</th>
              <th>Checkout Date</th>
            </tr>
          </thead>
          <tbody>
            {checkouts.map((entry, index) => (
              <tr key={index}>
                <td>{entry.student_name}</td>
                <td>{entry.book_title}</td>
                <td>{entry.barcode}</td>
                <td>{new Date(entry.checkout_date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default StaffReport;
