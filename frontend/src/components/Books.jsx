
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Books() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8001/api/books')
      .then(res => {
        setBooks(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch books');
        setLoading(false);
      });
  }, []);

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (Array.isArray(book.subject) && book.subject.some(sub => sub.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  if (loading) return <p>Loading books...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Library Books</h2>
      <input
        type="text"
        placeholder="Search by title, author, or subject..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        style={{ marginBottom: '1rem', padding: '0.5rem', width: '100%' }}
      />
      <table border="1" cellPadding="8" cellSpacing="0">
        <thead>
          <tr>
            <th>Ref ID</th>
            <th>Title</th>
            <th>Author</th>
            <th>Subject</th>
          </tr>
        </thead>
        <tbody>
          {filteredBooks.map((book, idx) => (
            <tr key={idx}>
              <td>{book.refid}</td>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>{book.subject?.join(', ')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
