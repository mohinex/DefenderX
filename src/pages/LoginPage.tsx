import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import LandingView from '../components/LandingView';
import LoginForm from '../components/LoginForm';
import SuccessView from '../components/SuccessView';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const { isDark, loggedInUser, login } = useApp();
  const navigate = useNavigate();
  const [successUser, setSuccessUser] = useState<any>(null);

  // If already logged in, skip login screen and divert straight to the secure console
  useEffect(() => {
    if (loggedInUser && !successUser) {
      navigate('/dashboard');
    }
  }, [loggedInUser, navigate, successUser]);

  const handleLoginSuccess = (userPayload: any) => {
    // If the server authenticates, set local success trigger to initiate structural matrix transition
    setSuccessUser(userPayload);
    // Write token in app provider state
    const fetchedToken = localStorage.getItem('eurosia_token');
    if (fetchedToken) {
      login(fetchedToken);
    }
  };

  const handleRedirectComplete = () => {
    navigate('/dashboard');
  };

  return (
    <Layout activeRoute="/login" inConsoleMode={true}>
      <div className="w-full max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 w-full items-stretch py-4 sm:py-8 gap-8 lg:gap-0">
          
          {/* Left operations presentation dashboard pane */}
          <div className="lg:col-span-7 flex items-center justify-center">
            <LandingView isDark={isDark} />
          </div>

          {/* Right transceiver credentials gate form pane */}
          <div 
            className="lg:col-span-1 border-t lg:border-t-0 p-1 hidden lg:block"
            aria-hidden="true"
          />

          <div 
            className="lg:col-span-4 flex items-center justify-center px-6 py-12 backdrop-blur-3xl transition-all duration-300 rounded-2xl border"
            style={{
              borderColor: isDark ? 'rgba(77, 141, 255, 0.18)' : 'rgba(10, 16, 37, 0.12)',
              backgroundColor: isDark ? 'rgba(10, 16, 37, 0.55)' : 'rgba(232, 236, 245, 0.55)'
            }}
          >
            {successUser ? (
              <SuccessView user={successUser} onRedirectComplete={handleRedirectComplete} />
            ) : (
              <LoginForm isDark={isDark} onLoginSuccess={handleLoginSuccess} />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
