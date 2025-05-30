import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { LeadProvider } from './context/LeadContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import Home from './pages/Home';
import UploadPage from './pages/UploadPage';
import DomainEnrichmentPage from './pages/DomainEnrichmentPage';
import EmailEnrichmentPage from './pages/EmailEnrichmentPage';
import ResultsPage from './pages/ResultsPage';
import TutorialPage from './pages/TutorialPage';
import CoursePage from './pages/CoursePage';

function App() {
  return (
    <AuthProvider>
      <LeadProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/upload" element={<UploadPage />} />
                        <Route path="/domain" element={<DomainEnrichmentPage />} />
                        <Route path="/email" element={<EmailEnrichmentPage />} />
                        <Route path="/results" element={<ResultsPage />} />
                        <Route path="/tutorial" element={<TutorialPage />} />
                        <Route path="/course" element={<CoursePage />} />
                      </Routes>
                    </Layout>
                  </ProtectedRoute>
                }
              />
            </Routes>
            <Toaster position="top-right" />
          </div>
        </Router>
      </LeadProvider>
    </AuthProvider>
  );
}

export default App;