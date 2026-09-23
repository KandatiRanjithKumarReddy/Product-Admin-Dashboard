import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../common/Navbar';
import ToastContainer from '../common/ToastContainer';

// Main layout wrapper — provides top navbar and toast notifications for authenticated pages
export const DashboardLayout = () => {
  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <Outlet />
      </main>
      <ToastContainer />
    </div>
  );
};

export default DashboardLayout;
