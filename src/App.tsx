import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Landing from './pages/Landing';
import Analyze from './pages/Analyze';
import Results from './pages/Results';
import History from './pages/History';
import Auth from './pages/Auth';
import Navbar from './components/Navbar';
import ErrorBoundary from './components/ErrorBoundary';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="min-h-screen bg-void">
        <Navbar />
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/analyze" element={<Analyze />} />
            <Route path="/results/:scanId" element={<Results />} />
            <Route path="/history" element={<History />} />
            <Route path="/auth" element={<Auth />} />
          </Routes>
        </ErrorBoundary>
      </div>
    </BrowserRouter>
  );
}
