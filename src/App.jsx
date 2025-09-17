import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BlogList from './BlogList';
import BlogDetails from './BlogDetails';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Blog Routes */}
          <Route path="/blog" element={<BlogList />} />
          <Route path="/blog/:slug" element={<BlogDetails />} />
          
          {/* Redirect root to blog for demo purposes */}
          <Route path="/" element={<BlogList />} />
          
          {/* Catch all route */}
          <Route path="*" element={<BlogList />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
