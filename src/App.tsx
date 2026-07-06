import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from './layouts/AppShell';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Setup } from './pages/Setup';
import { Dashboard } from './pages/Dashboard';
import { POS } from './pages/POS';
import { KitchenKDS } from './pages/KitchenKDS';
import { TableMap } from './pages/TableMap';
import { MenuManager } from './pages/MenuManager';
import { Reservations } from './pages/Reservations';
import { Inventory } from './pages/Inventory';
import { Customers } from './pages/Customers';
import { Employees } from './pages/Employees';
import { Analytics } from './pages/Analytics';
import { Reports } from './pages/Reports';
import { AIInsights } from './pages/AIInsights';
import { Settings } from './pages/Settings';
import { Profile } from './pages/Profile';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/setup" element={<Setup />} />
        
        {/* Authenticated Dashboard Shell */}
        <Route path="/app" element={<AppShell />}>
          <Route index element={<Navigate to="/app/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="pos" element={<POS />} />
          <Route path="kitchen" element={<KitchenKDS />} />
          <Route path="tables" element={<TableMap />} />
          <Route path="reservations" element={<Reservations />} />
          <Route path="menu" element={<MenuManager />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="customers" element={<Customers />} />
          <Route path="employees" element={<Employees />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="reports" element={<Reports />} />
          <Route path="ai-insights" element={<AIInsights />} />
          <Route path="settings" element={<Settings />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
