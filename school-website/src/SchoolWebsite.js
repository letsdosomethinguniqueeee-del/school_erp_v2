import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import AcademicsPage from './pages/AcademicsPage';
import AdmissionsPage from './pages/AdmissionsPage';
import FacultyPage from './pages/FacultyPage';
import GalleryPage from './pages/GalleryPage';
import ContactPage from './pages/ContactPage';
import NewsPage from './pages/NewsPage';
import './SchoolWebsite.css';

const SchoolWebsite = () => {
  return (
    <Router>
      <div className="school-website">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/academics" element={<AcademicsPage />} />
            <Route path="/admissions" element={<AdmissionsPage />} />
            <Route path="/faculty" element={<FacultyPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default SchoolWebsite;
