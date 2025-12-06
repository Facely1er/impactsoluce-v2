import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoadingScreen from '../components/ui/LoadingScreen';
import AuthGuard from '../components/auth/AuthGuard';

// Eagerly loaded components
import NotFound from '../pages/NotFound';

// Lazily loaded components
const Home = lazy(() => import('../pages/Home'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const TechDependencies = lazy(() => import('../pages/TechDependencies'));
const Resources = lazy(() => import('../pages/Resources'));
const CarbonManagement = lazy(() => import('../pages/CarbonManagement'));
const Assessment = lazy(() => import('../pages/Assessment'));
const AssessmentResults = lazy(() => import('../pages/AssessmentResults'));
const AssessmentHistory = lazy(() => import('../pages/AssessmentHistory'));
const StandardsMapping = lazy(() => import('../pages/StandardsMapping'));
const About = lazy(() => import('../pages/About'));
const Pricing = lazy(() => import('../pages/Pricing'));
const Contact = lazy(() => import('../pages/Contact'));
const Blog = lazy(() => import('../pages/Blog'));
const Privacy = lazy(() => import('../pages/Privacy'));
const Terms = lazy(() => import('../pages/Terms'));
const Features = lazy(() => import('../pages/Features'));
const CaseStudies = lazy(() => import('../pages/CaseStudies'));
const Support = lazy(() => import('../pages/Support'));
const Documentation = lazy(() => import('../pages/Documentation'));
const Login = lazy(() => import('../pages/Login'));
const Signup = lazy(() => import('../pages/Signup'));
const Careers = lazy(() => import('../pages/Careers'));
const EsgGlossary = lazy(() => import('../pages/EsgGlossary'));
const CookiePolicy = lazy(() => import('../pages/CookiePolicy'));
const Security = lazy(() => import('../pages/Security'));
const ForgotPassword = lazy(() => import('../pages/ForgotPassword'));
const ResetPassword = lazy(() => import('../pages/ResetPassword'));
const Profile = lazy(() => import('../pages/Profile'));
const Settings = lazy(() => import('../pages/Settings'));
const Reports = lazy(() => import('../pages/Reports'));

// Wrap lazy-loaded components with Suspense
const SuspenseWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<LoadingScreen />}>
    {children}
  </Suspense>
);

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<SuspenseWrapper><Home /></SuspenseWrapper>} />
      <Route path="/login" element={
        <AuthGuard requireAuth={false} redirectTo="/dashboard">
          <SuspenseWrapper><Login /></SuspenseWrapper>
        </AuthGuard>
      } />
      <Route path="/signup" element={
        <AuthGuard requireAuth={false} redirectTo="/dashboard">
          <SuspenseWrapper><Signup /></SuspenseWrapper>
        </AuthGuard>
      } />
      <Route path="/forgot-password" element={<SuspenseWrapper><ForgotPassword /></SuspenseWrapper>} />
      <Route path="/reset-password" element={<SuspenseWrapper><ResetPassword /></SuspenseWrapper>} />
      <Route path="/about" element={<SuspenseWrapper><About /></SuspenseWrapper>} />
      <Route path="/features" element={<SuspenseWrapper><Features /></SuspenseWrapper>} />
      <Route path="/pricing" element={<SuspenseWrapper><Pricing /></SuspenseWrapper>} />
      <Route path="/case-studies" element={<SuspenseWrapper><CaseStudies /></SuspenseWrapper>} />
      <Route path="/contact" element={<SuspenseWrapper><Contact /></SuspenseWrapper>} />
      <Route path="/blog" element={<SuspenseWrapper><Blog /></SuspenseWrapper>} />
      <Route path="/support" element={<SuspenseWrapper><Support /></SuspenseWrapper>} />
      <Route path="/documentation" element={<SuspenseWrapper><Documentation /></SuspenseWrapper>} />
      <Route path="/careers" element={<SuspenseWrapper><Careers /></SuspenseWrapper>} />
      <Route path="/esg-glossary" element={<SuspenseWrapper><EsgGlossary /></SuspenseWrapper>} />
      <Route path="/cookie-policy" element={<SuspenseWrapper><CookiePolicy /></SuspenseWrapper>} />
      <Route path="/security" element={<SuspenseWrapper><Security /></SuspenseWrapper>} />
      <Route path="/privacy" element={<SuspenseWrapper><Privacy /></SuspenseWrapper>} />
      <Route path="/terms" element={<SuspenseWrapper><Terms /></SuspenseWrapper>} />
      
      {/* Protected routes */}
      <Route path="/dashboard" element={
        <AuthGuard>
          <SuspenseWrapper><Dashboard /></SuspenseWrapper>
        </AuthGuard>
      } />
      <Route path="/tech-dependency" element={
        <AuthGuard>
          <SuspenseWrapper><TechDependencies /></SuspenseWrapper>
        </AuthGuard>
      } />
      <Route path="/resources" element={
        <AuthGuard>
          <SuspenseWrapper><Resources /></SuspenseWrapper>
        </AuthGuard>
      } />
      <Route path="/carbon-management" element={
        <AuthGuard>
          <SuspenseWrapper><CarbonManagement /></SuspenseWrapper>
        </AuthGuard>
      } />
      <Route path="/assessment" element={
        <AuthGuard>
          <SuspenseWrapper><Assessment /></SuspenseWrapper>
        </AuthGuard>
      } />
      <Route path="/assessment/results" element={
        <AuthGuard>
          <SuspenseWrapper><AssessmentResults /></SuspenseWrapper>
        </AuthGuard>
      } />
      <Route path="/assessment/history" element={
        <AuthGuard>
          <SuspenseWrapper><AssessmentHistory /></SuspenseWrapper>
        </AuthGuard>
      } />
      <Route path="/standards-mapping" element={
        <AuthGuard>
          <SuspenseWrapper><StandardsMapping /></SuspenseWrapper>
        </AuthGuard>
      } />
      <Route path="/profile" element={
        <AuthGuard>
          <SuspenseWrapper><Profile /></SuspenseWrapper>
        </AuthGuard>
      } />
      <Route path="/settings" element={
        <AuthGuard>
          <SuspenseWrapper><Settings /></SuspenseWrapper>
        </AuthGuard>
      } />
      <Route path="/reports" element={
        <AuthGuard>
          <SuspenseWrapper><Reports /></SuspenseWrapper>
        </AuthGuard>
      } />
      
      {/* Redirects */}
      <Route path="/social-impact" element={<Navigate to="/assessment\" replace />} />
      <Route path="/reporting\" element={<Navigate to="/reports\" replace />} />
      
      {/* 404 route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}