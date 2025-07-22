import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import BillingForm from './BillingForm';
import './App.css';
import Navbar from './Navbar';
import ReportsPage from './ReportsPage';


const App = () => {
    return (
        <Router>
             <Navbar />
           
            <div className="container mt-4">
        <Routes>
        {/* <Route path="/" element={<BillingForm />} /> */}
          <Route path="/billing" element={<BillingForm  />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/customers" element={<div>Customer Details Page</div>} />
        </Routes>
      </div>
        </Router>
    );
};

export default App;