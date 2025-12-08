import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoadingScreen from '../components/ui/LoadingScreen';
import ErrorBoundary from '../components/error/ErrorBoundary';

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
const AcceptableUsePolicy = lazy(() => import('../pages/AcceptableUsePolicy'));
const ForgotPassword = lazy(() => import('../pages/ForgotPassword'));
const ResetPassword = lazy(() => import('../pages/ResetPassword'));
const Profile = lazy(() => import('../pages/Profile'));
const Settings = lazy(() => import('../pages/Settings'));
const Reports = lazy(() => import('../pages/Reports'));
const RiskRadar = lazy(() => import('../pages/RiskRadar'));
const RiskRadarConfiguration = lazy(() => import('../pages/RiskRadarConfiguration'));
const EvidenceWorkspace = lazy(() => import('../pages/EvidenceWorkspace'));
const Modules = lazy(() => import('../pages/Modules'));
const EUDRModule = lazy(() => import('../pages/modules/EUDRModule'));

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
      <Route path="/login" element={<SuspenseWrapper><Login /></SuspenseWrapper>} />
      <Route path="/signup" element={<SuspenseWrapper><Signup /></SuspenseWrapper>} />
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
      <Route path="/acceptable-use-policy" element={<SuspenseWrapper><AcceptableUsePolicy /></SuspenseWrapper>} />
      
      {/* All routes are now public - no authentication required */}
      <Route path="/dashboard" element={<SuspenseWrapper><Dashboard /></SuspenseWrapper>} />
      <Route path="/tech-dependency" element={<SuspenseWrapper><TechDependencies /></SuspenseWrapper>} />
      <Route path="/resources" element={<SuspenseWrapper><Resources /></SuspenseWrapper>} />
      <Route path="/carbon-management" element={<SuspenseWrapper><CarbonManagement /></SuspenseWrapper>} />
      <Route path="/impact-scan" element={<SuspenseWrapper><Assessment /></SuspenseWrapper>} />
      <Route path="/assessment" element={<Navigate to="/impact-scan" replace />} />
      <Route path="/assessment/results" element={<SuspenseWrapper><AssessmentResults /></SuspenseWrapper>} />
      <Route path="/assessment/history" element={<SuspenseWrapper><AssessmentHistory /></SuspenseWrapper>} />
      <Route path="/standards-mapping" element={<SuspenseWrapper><StandardsMapping /></SuspenseWrapper>} />
      <Route path="/profile" element={<SuspenseWrapper><Profile /></SuspenseWrapper>} />
      <Route path="/settings" element={<SuspenseWrapper><Settings /></SuspenseWrapper>} />
      <Route path="/reports" element={<SuspenseWrapper><Reports /></SuspenseWrapper>} />
      <Route path="/risk-radar" element={<ErrorBoundary><SuspenseWrapper><RiskRadar /></SuspenseWrapper></ErrorBoundary>} />
      <Route path="/risk-radar/configure" element={<ErrorBoundary><SuspenseWrapper><RiskRadarConfiguration /></SuspenseWrapper></ErrorBoundary>} />
      <Route path="/evidence-workspace" element={<ErrorBoundary><SuspenseWrapper><EvidenceWorkspace /></SuspenseWrapper></ErrorBoundary>} />
      <Route path="/modules" element={<ErrorBoundary><SuspenseWrapper><Modules /></SuspenseWrapper></ErrorBoundary>} />
      <Route path="/modules/eudr" element={<ErrorBoundary><SuspenseWrapper><EUDRModule /></SuspenseWrapper></ErrorBoundary>} />
      
      {/* Redirects */}
      <Route path="/social-impact" element={<Navigate to="/impact-scan" replace />} />
      <Route path="/reporting" element={<Navigate to="/reports" replace />} />
      
      {/* 404 route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}