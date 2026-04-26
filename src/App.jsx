import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import DashboardLayout from './components/layout/DashboardLayout';
import { ProtectedRoute, PremiumRoute } from './components/layout/Guards';
import Landing from './pages/Landing';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import CreateSession from './pages/CreateSession';
import TextPractice from './pages/TextPractice';
import VideoInterview from './pages/VideoInterview';
import ResumeUpload from './pages/ResumeUpload';
import Analytics from './pages/Analytics';
import Pricing from './pages/Pricing';
import MockCheckout from './pages/MockCheckout';
import Profile from './pages/Profile';
import Success from './pages/Success';
import Cancel from './pages/Cancel';
import ResumeAnalysisOUTPUT from './pages/ResumeAnalysisOUTPUT';

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" toastOptions={{ duration: 3000, style: { fontSize: '14px' } }} />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Protected routes with dashboard layout */}
        <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/practice/new" element={<CreateSession />} />
          <Route path="/practice/:sessionId" element={<TextPractice />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/checkout" element={<MockCheckout />} />
          <Route path="/profile" element={<Profile />} />
          
           <Route path='/success' element={<Success/>}/> 
           <Route path='/cancel' element={<Cancel/>}/> 

          {/* Premium routes */}
          <Route path="/video-interview" element={<PremiumRoute><VideoInterview /></PremiumRoute>} />
          <Route path="/resume" element={<PremiumRoute><ResumeUpload /></PremiumRoute>} />
          <Route path="/resume/:id" element={<PremiumRoute><ResumeAnalysisOUTPUT /></PremiumRoute>} />
          <Route path="/analytics" element={<PremiumRoute><Analytics /></PremiumRoute>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
