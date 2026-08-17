import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/login";
import Dashboard from "./pages/Dashboard";
import RFHForm from "./pages/RFHForm";
import UserManagement from "./pages/UserManagement";
import BusinessUnit from "./pages/BusinessUnit";
import Department from "./pages/Department";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/rfh/create" element={<RFHForm />} />
        <Route path="/rfh" element={<RFHForm />} />
        <Route path="/users" element={<UserManagement initialTab="users" />} />
        <Route path="/user-management" element={<UserManagement initialTab="users" />} />
        <Route path="/teams" element={<UserManagement initialTab="teams" />} />
       <Route  path="/business-units" element={<BusinessUnit />} />
        <Route path="/departments" element={<Department />} /> 
     </Routes>
    </BrowserRouter>
  );
}

export default App;
