import React, { useEffect } from 'react';
import Layout from '../components/layout/Layout';
import LandingView from '../components/LandingView';
import RegisterForm from '../components/RegisterForm';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

export default function RegisterPage() {
  const { isDark, loggedInUser } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (loggedInUser) {
      navigate('/dashboard');
    }
  }, [loggedInUser, navigate]);

  return (
    <Layout activeRoute="/register" inConsoleMode={true}>
      <div className="w-full max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 w-full items-stretch py-4 sm:py-8 gap-8 lg:gap-0">
          
          {/* Left operations presentation dashboard pane */}
          <div className="lg:col-span-7 flex items-center justify-center">
            <LandingView isDark={isDark} />
          </div>

          <div 
            className="lg:col-span-1 border-t lg:border-t-0 p-1 hidden lg:block"
            aria-hidden="true"
          />

          {/* Right credentials deployment form pane */}
          <div 
            className="lg:col-span-4 flex items-center justify-center px-6 py-12 backdrop-blur-3xl transition-all duration-300 rounded-2xl border"
            style={{
              borderColor: isDark ? 'rgba(77, 141, 255, 0.18)' : 'rgba(10, 16, 37, 0.12)',
              backgroundColor: isDark ? 'rgba(10, 16, 37, 0.55)' : 'rgba(232, 236, 245, 0.55)'
            }}
          >
            <RegisterForm 
              isDark={isDark} 
              onRegisterSuccess={() => navigate('/login')} 
              onNavigateToLogin={() => navigate('/login')} 
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}
