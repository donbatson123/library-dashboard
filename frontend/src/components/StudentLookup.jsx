import React, { useState } from 'react';
import axios from 'axios';

export default function StudentLookup() {
  const [query, setQuery] = useState('');
  const [students, setStudents] = useState([]);
  const [selected, setSelected] = useState(null);
  const [checkouts, setCheckouts] = useState([]);

  const search = () => {
    axios.get(`http://localhost:8001/api/students/search?q=${query}`)
      .then(res => setStudents(res.data))
      .catch(err => console.error(err));
  };

  const selectStudent = (student) => {
    setSelected(student);
    axios.get(`http://localhost:8001/api/checkouts`)
      .then(res => {
        const filtered = res.data.filter(c => c.student_id === student.student_id);
        setCheckouts(filtered);
      });
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Student Lookup</h2>
      <input
        type="text"
        placeholder="Search by name or ID..."
        value={query}
        onChange={e => setQuery(e.target.value)}
        style={{ marginRight: '0.5rem', padding: '0.5rem' }}
      />
      <button onClick={search}>Search</button>

      {students.length > 0 && (
        <ul style={{ marginTop: '1rem' }}>
          {students.map((s, idx) => (
            <li key={idx} style={{ cursor: 'pointer' }} onClick={() => selectStudent(s)}>
              {s.first_name} {s.last_name} ({s.student_id})
            </li>
          ))}
        </ul>
      )}

      {selected && (
        <div style={{ marginTop: '1rem' }}>
          <h3>{selected.first_name} {selected.last_name}'s Checkouts</h3>
          <ul>
            {checkouts.map((c, i) => (
              <li key={i}>{c.refid} - {new Date(c.date_out).toLocaleDateString()}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
