import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import IssuerDashboard from './pages/issuer/IssuerDashboard';
import IssuerRegister from './pages/issuer/IssuerRegister';
import VerifyDocument from './pages/verifier/VerifyDocument';
import IssueDocument from './pages/issuer/IssueDocument';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="issuer">
            <Route path="register" element={<IssuerRegister />} />
            <Route path="dashboard" element={<IssuerDashboard />} />
            <Route path="issue" element={<IssueDocument />} />
          </Route>
          <Route path="verify" element={<VerifyDocument />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;