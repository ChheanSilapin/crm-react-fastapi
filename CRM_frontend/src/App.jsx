import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import queryClient from './config/queryClient'; 
import { ToastContainer } from 'react-toastify';
import { CurrencyProvider } from './contexts/CurrencyContext';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

import 'react-toastify/dist/ReactToastify.css';
import AppLayout from './components/Layout/AppLayout';
import ProtectedRoute from './pages/ProtectedRoute'; // Renamed ProtectedRoute
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import Banks from './pages/Banks';
import Roles from './pages/Roles';
import RolePermissions from './pages/RolePermissions';
import Users from './pages/Users';
import AuthSettings from './pages/AuthSettings';
import Login from './pages/Login';
import Unauthorized from './pages/Unauthorized';
import NotFound from './pages/NotFound';




function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <CurrencyProvider>
            <Router>
              <Routes>
                {/* Protected Dashboard Layout */}
                <Route element={<AppLayout />}>
                  <Route
                    index
                    path="/"
                    element={
                      <ProtectedRoute permission="dashboard:view">
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/customers"
                    element={
                      <ProtectedRoute permission="customers:read">
                        <Customers />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/banks"
                    element={
                      <ProtectedRoute permission="banks:read">
                        <Banks />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/roles"
                    element={
                      <ProtectedRoute permission="roles:read">
                        <Roles />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/role-permissions"
                    element={
                      <ProtectedRoute permission="permissions:assign">
                        <RolePermissions />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/users"
                    element={
                      <ProtectedRoute permission="users:read">
                        <Users />
                      </ProtectedRoute>
                    }
                  />
                </Route>

                <Route path="/login" element={<Login />} />
                <Route path="/unauthorized" element={<Unauthorized />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <ToastContainer position="bottom-right"/>
            </Router>
          </CurrencyProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
