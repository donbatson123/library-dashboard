import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Checkouts() {
  const [checkouts, setCheckouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8001/api/checkouts')
      .then(res => {
        setCheckouts(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch checkouts');
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading checkouts...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Recent Checkouts</h2>
      <table border="1" cellPadding="8" cellSpacing="0">
        <thead>
          <tr>
            <th>ID</th>
            <th>Ref ID</th>
            <th>Student ID</th>
            <th>Date Out</th>
            <th>Date In</th>
          </tr>
        </thead>
        <tbody>
          {checkouts.map((entry, idx) => (
            <tr key={idx}>
              <td>{entry.id}</td>
              <td>{entry.refid}</td>
              <td>{entry.student_id}</td>
              <td>{entry.date_out}</td>
              <td>{entry.date_in}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
