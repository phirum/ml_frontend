// src/App.tsx
import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import { AuthProvider } from './contexts/AuthContext';

import Login from './pages/Login';
import AdminDashboard from './pages/Admin/AdminDashboard';
import UserDashboard from './pages/User/UserDashboard';
import PDFScanner from './pages/PDFScanner';
import URLScanner from './pages/URLScanner';
import QRInvoiceScanner from './pages/QRInvoiceScanner';
import NetworkLogs from './pages/NetworkLogs';
import ScanHistory from './pages/ScanHistory';
import ModelRetraining from './pages/Admin/ModelRetraining';
import UserManagement from './pages/Admin/UserManagement';
import ProtectedRoute from './components/Common/ProtectedRoute';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />

          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute role="admin">
                <UserManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/retrain"
            element={
              <ProtectedRoute role="admin">
                <ModelRetraining />
              </ProtectedRoute>
            }
          />

          <Route
            path="/user"
            element={
              <ProtectedRoute role="user">
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/scan/pdf"
            element={
              <ProtectedRoute role="user">
                <PDFScanner />
              </ProtectedRoute>
            }
          />
          <Route
            path="scan/url"
            element={
              <ProtectedRoute role="user">
                <URLScanner />
              </ProtectedRoute>
            }
          />
          <Route
            path="scan/qr"
            element={
              <ProtectedRoute role="user">
                <QRInvoiceScanner />
              </ProtectedRoute>
            }
          />
          <Route
            path="scan/logs"
            element={
              <ProtectedRoute role="user"> 
                <NetworkLogs />
              </ProtectedRoute>
 
            }
          />
          <Route
            path="scan/history"
            element={
              <ProtectedRoute role="user">
                <ScanHistory />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
