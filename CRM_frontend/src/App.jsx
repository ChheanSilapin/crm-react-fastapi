import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";

import { Toaster } from "@/components/ui/sonner";
import AppLayout from "./components/Layout/AppLayout";
import DashBoard from "./pages/dashboard/Dashboard";
import Banks from "./pages/bank/Banks";
import Login from "./pages/Login";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Customers from "./pages/customer/Customers";
import Users from "./pages/user/Users";
import { NotFoundError } from "./pages/NotFoundError";
import { UnauthorisedError } from "./pages/UnauthorisedError";
import { NavigationProgress } from "./components/navigation-progress";
import Roles from "./pages/role/Roles";
import Permissions from "./pages/permission/Permissions";
import { InternalError } from "./pages/InternalError";

function App() {
  return (
    <>
      <TooltipProvider>
        <Router>
          <NavigationProgress />

          <Routes>
            {/* Protected Dashboard Layout */}
            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                <Route index path="/" element={<DashBoard />} />

                <Route
                  element={<ProtectedRoute requiredPermission="banks:list" />}
                >
                  <Route path="/banks" element={<Banks />} />
                </Route>

                <Route
                  element={
                    <ProtectedRoute requiredPermission="customers:list" />
                  }
                >
                  <Route path="/customers" element={<Customers />} />
                </Route>

                <Route
                  element={<ProtectedRoute requiredPermission="users:list" />}
                >
                  <Route path="/users" element={<Users />} />
                </Route>

                <Route
                  element={<ProtectedRoute requiredPermission="roles:list" />}
                >
                  <Route path="/roles" element={<Roles />} />
                </Route>

                <Route
                  element={
                    <ProtectedRoute requiredPermission="permissions:list" />
                  }
                >
                  <Route path="/role-permissions" element={<Permissions />} />
                </Route>

                {/* Error boundary for 404 */}
                <Route path="*" element={<NotFoundError />} />
                <Route path="/unauthorized" element={<UnauthorisedError />} />
              </Route>
            </Route>

            <Route path="/login" element={<Login />} />
            <Route path="/error" element={<InternalError />} />
          </Routes>
        </Router>
      </TooltipProvider>
      <Toaster />
    </>
  );
}

export default App;
