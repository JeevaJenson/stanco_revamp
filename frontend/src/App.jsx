import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/login";
import Dashboard from "./pages/Dashboard";
import RFHForm from "./pages/RFHForm";
import AllocationList from "./pages/AllocationList";
import UserManagement from "./pages/UserManagement";
import BusinessUnit from "./pages/BusinessUnit";
import Department from "./pages/Department";
import DepartmentVertical from "./pages/DepartmentVertical";
import CandidateDatabase from "./pages/CandidateDatabase";
import AllocationReport from "./pages/AllocationReport";
import RecruiterReport from "./pages/RecruiterReport";
import RecruitmentRequestList from "./pages/RecruitmentRequestList";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/rfh/create" element={<RFHForm />} />
        <Route path="/rfh/edit/:id" element={<RFHForm />} />
        <Route path="/rfh" element={<RFHForm />} />
        <Route path="/allocation-list" element={<AllocationList />} />
        <Route path="/users" element={<UserManagement initialTab="users" />} />
        <Route path="/user-management" element={<UserManagement initialTab="users" />} />
        <Route path="/teams" element={<UserManagement initialTab="teams" />} />
        <Route path="/business-units" element={<BusinessUnit />} />
        <Route path="/departments" element={<Department />} />
        <Route path="/departments/vertical" element={<DepartmentVertical />} />
        <Route path="/candidate-database" element={<CandidateDatabase />} />
        <Route path="/allocation-report" element={<AllocationReport />} />
        <Route path="/recruiter-report" element={<RecruiterReport />} />
        <Route path="/recruitment-requests" element={<RecruitmentRequestList />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
