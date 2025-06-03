import 'react-toastify/dist/ReactToastify.css';
import './app.scss';
import 'app/config/dayjs';

import React, { useEffect } from 'react';
import { Card } from 'reactstrap';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import { useAppDispatch, useAppSelector } from 'app/config/store';
// import { getSession } from 'app/shared/reducers/authentication';
import { getProfile } from 'app/shared/reducers/application-profile';
import Header from 'app/layouts/Header';
import Footer from 'app/layouts/Footer';
import ErrorBoundary from 'app/shared/error/error-boundary';
import AppRoutes from 'app/routes';

const baseHref = document.querySelector('base').getAttribute('href').replace(/\/$/, '');

const MainContent = () => {
  const location = useLocation();
  const hideFooter = location.pathname === '/PrixImmobliers';

  return (
    <div className="flex flex-col min-h-screen" style={{ background: '#F9FAFB' }}>
      <div className="fixed top-0 left-0 right-0 z-50">
        <Header />
      </div>

      <main className={`flex-grow pt-20 ${hideFooter ? 'h-screen overflow-hidden' : 'mb-10'}`}>
        <ErrorBoundary>
          <AppRoutes />
        </ErrorBoundary>
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
};

export const App = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // dispatch(getSession());
    dispatch(getProfile());
  }, []);

  return (
    <BrowserRouter basename={baseHref}>
      <MainContent />
    </BrowserRouter>
  );
};

export default App;
