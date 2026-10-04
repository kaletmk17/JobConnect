import './App.css'

import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom'

import Resume from './pages/Resume'
import Profile from './pages/Profile'

import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'

import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Jobs from './pages/Jobs'
import MyApplications from './pages/MyApplications'
import PostJob from './pages/PostJob'
import RecruiterApplications from './pages/RecruiterApplications'
import MyJobs from './pages/MyJobs'
import JobDetails from './pages/JobDetails'
import RecruiterDashboard from './pages/RecruiterDashboard'


function App() {

  return (

    <BrowserRouter>

      <Navbar />

      <Routes>

        {/* =========================
            HOME
        ========================= */}

        <Route
          path="/"
          element={<Home />}
        />


        {/* =========================
            LOGIN
        ========================= */}

        <Route
          path="/login"
          element={<Login />}
        />


        {/* =========================
            REGISTER
        ========================= */}

        <Route
          path="/register"
          element={<Register />}
        />


        {/* =========================
            ALL JOBS
        ========================= */}

        <Route
          path="/jobs"
          element={<Jobs />}
        />


        {/* =========================
            JOB DETAILS
        ========================= */}

        <Route
          path="/jobs/:jobId"
          element={<JobDetails />}
        />


        {/* =========================
            JOB SEEKER
            MY APPLICATIONS
        ========================= */}

        <Route
          path="/my-applications"
          element={
            <ProtectedRoute allowedRole="JOB_SEEKER">
              <MyApplications />
            </ProtectedRoute>
          }
        />


        {/* =========================
            JOB SEEKER
            MY RESUME
        ========================= */}

        <Route
          path="/resume"
          element={
            <ProtectedRoute allowedRole="JOB_SEEKER">
              <Resume />
            </ProtectedRoute>
          }
        />


        {/* =========================
            JOB SEEKER
            MY PROFILE
        ========================= */}

        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRole="JOB_SEEKER">
              <Profile />
            </ProtectedRoute>
          }
        />


        {/* =========================
            RECRUITER
            POST JOB
        ========================= */}

        <Route
          path="/post-job"
          element={
            <ProtectedRoute allowedRole="RECRUITER">
              <PostJob />
            </ProtectedRoute>
          }
        />


        {/* =========================
            RECRUITER
            MY JOBS
        ========================= */}

        <Route
          path="/my-jobs"
          element={
            <ProtectedRoute allowedRole="RECRUITER">
              <MyJobs />
            </ProtectedRoute>
          }
        />


        {/* =========================
            RECRUITER
            APPLICATIONS
        ========================= */}

        <Route
          path="/recruiter-applications"
          element={
            <ProtectedRoute allowedRole="RECRUITER">
              <RecruiterApplications />
            </ProtectedRoute>
          }
        />


        {/* =========================
            RECRUITER
            DASHBOARD
        ========================= */}

        <Route
          path="/recruiter-dashboard"
          element={
            <ProtectedRoute allowedRole="RECRUITER">
              <RecruiterDashboard />
            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>
  )
}


export default App