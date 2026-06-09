import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TooltipProvider } from "@/components/ui/tooltip";

import 'react-toastify/dist/ReactToastify.css';
import AppLayout from './components/Layout/AppLayout';
import DashBoard from './pages/Dashboard';
import Banks from './pages/bank/Banks';
import Login from './pages/Login';
import { ProtectedRoute } from './components/ProtectedRoute';
import Customers from './pages/customer/Customers';


function App() {
  return (

    <TooltipProvider>

      <Router>
        <Routes>
          {/* Protected Dashboard Layout */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route index path="/" element={<DashBoard />} />
              <Route path="/banks" element={<Banks />} />
              <Route path="/customers" element={<Customers />} />
            </Route>
          </Route>

          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    </TooltipProvider>

  );
}

export default App;
