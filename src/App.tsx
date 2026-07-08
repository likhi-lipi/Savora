//import React from 'react';
import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from './layouts/AppShell';
/*import { Landing } from './pages/Landing';
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
import { Support } from './pages/Support';
import { SupportSuccess } from './pages/SupportSuccess';
import { SupportTickets } from './pages/SupportTickets'; */

const Landing = lazy(() => import('./pages/Landing').then(m => ({ default: m.Landing })));
const Login = lazy(() => import('./pages/Login').then(m => ({ default: m.Login })));
const Setup = lazy(() => import('./pages/Setup').then(m => ({ default: m.Setup })));
const Dashboard = lazy(() => import('./pages/Dashboard').then(m => ({ default: m.Dashboard })));
const POS = lazy(() => import('./pages/POS').then(m => ({ default: m.POS })));
const KitchenKDS = lazy(() => import('./pages/KitchenKDS').then(m => ({ default: m.KitchenKDS })));
const TableMap = lazy(() => import('./pages/TableMap').then(m => ({ default: m.TableMap })));
const MenuManager = lazy(() => import('./pages/MenuManager').then(m => ({ default: m.MenuManager })));
const Reservations = lazy(() => import('./pages/Reservations').then(m => ({ default: m.Reservations })));
const Inventory = lazy(() => import('./pages/Inventory').then(m => ({ default: m.Inventory })));
const Customers = lazy(() => import('./pages/Customers').then(m => ({ default: m.Customers })));
const Employees = lazy(() => import('./pages/Employees').then(m => ({ default: m.Employees })));
const Analytics = lazy(() => import('./pages/Analytics').then(m => ({ default: m.Analytics })));
const Reports = lazy(() => import('./pages/Reports').then(m => ({ default: m.Reports })));
const AIInsights = lazy(() => import('./pages/AIInsights').then(m => ({ default: m.AIInsights })));
const Settings = lazy(() => import('./pages/Settings').then(m => ({ default: m.Settings })));
const Profile = lazy(() => import('./pages/Profile').then(m => ({ default: m.Profile })));
const Support = lazy(() => import('./pages/Support').then(m => ({ default: m.Support })));
const SupportSuccess = lazy(() => import('./pages/SupportSuccess').then(m => ({ default: m.SupportSuccess })));
const SupportTickets = lazy(() => import('./pages/SupportTickets').then(m => ({ default: m.SupportTickets })));
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
          <Route path="support" element={<Support />} />
          <Route path="support-success" element={<SupportSuccess />} />
          <Route path="support-tickets" element={<SupportTickets />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
