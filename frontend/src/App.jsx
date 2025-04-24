import React from 'react';
import AppRoutes from './routes/AppRoutes';
import Navbar from './components/Navbar';


import './index.css';

const App = () => {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      <Navbar />
      <AppRoutes />
    </div>
  );
};

export default App;