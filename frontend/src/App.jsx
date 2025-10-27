

// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import StudentProfileSetup from './pages/StudentProfileSetup';
import StartupProfileSetup from './pages/StartupProfileSetup';
import StudentProfile from './pages/StudentProfile';
import InternshipDetail from './pages/InternshipDetail';
import ApplicationsList from './pages/ApplicationsList';
import ApplicationDetail from './pages/ApplicationDetail';
import MyApplications from './pages/MyApplications';
import AppliedApplications from "./pages/AppliedApplications";
import CreateInternship from './pages/CreateInternship';  // Add this import

// Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import InternshipsList from './pages/InternshipsList';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/internships"
              element={
                <ProtectedRoute>
                  <InternshipsList />
                </ProtectedRoute>
              }
            />

            {/* Student Routes */}
            <Route
              path="/profile/setup"
              element={
                <ProtectedRoute userType="student">
                  <StudentProfileSetup />
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute userType="student">
                  <StudentProfile />
                </ProtectedRoute>
              }
            />

            <Route
              path="/my-applications"
              element={
                <ProtectedRoute userType="student">
                  <MyApplications />
                </ProtectedRoute>
              }
            />

            <Route path="/dashboard/applied" element={<AppliedApplications />} />
            <Route path="/applications/my" element={<AppliedApplications />} />

            {/* Startup Routes */}
            <Route
              path="/startup/setup"
              element={
                <ProtectedRoute userType="startup">
                  <StartupProfileSetup />
                </ProtectedRoute>
              }
            />

            {/* Add the Create Internship Route */}
            <Route
              path="/my-internships/create"
              element={
                <ProtectedRoute userType="startup">
                  <CreateInternship />
                </ProtectedRoute>
              }
            />

            <Route
              path="/applications"
              element={
                <ProtectedRoute userType="startup">
                  <ApplicationsList />
                </ProtectedRoute>
              }
            />

            <Route
              path="/applications/:id"
              element={
                <ProtectedRoute userType="startup">
                  <ApplicationDetail />
                </ProtectedRoute>
              }
            />

            {/* Shared Routes */}
            <Route
              path="/internships/:id"
              element={
                <ProtectedRoute>
                  <InternshipDetail />
                </ProtectedRoute>
              }
            />

            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
