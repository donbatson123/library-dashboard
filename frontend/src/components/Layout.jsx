import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const Layout = () => {
  return (
    <div>
      <nav>
        <ul>
          <li><Link to="/">Books</Link></li>
          <li><Link to="/checkouts">Checkouts</Link></li>
          <li><Link to="/inventory">Inventory</Link></li>
          <li><Link to="/lookup">Student Lookup</Link></li>
          <li><Link to="/reports/staff-checkouts">Staff Report</Link></li>
        </ul>
      </nav>
      <hr />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
