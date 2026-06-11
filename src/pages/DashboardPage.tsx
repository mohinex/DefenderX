import React, { useEffect } from 'react';
import Layout from '../components/layout/Layout';
import DashboardView from '../components/DashboardView';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

export default function DashboardPage() {
  const { loggedInUser, isDark, logout } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loggedInUser) {
      navigate('/login');
    }
  }, [loggedInUser, navigate]);

  if (!loggedInUser) {
    return null; // Prevents flashing while routing checks complete
  }

  return (
    <Layout activeRoute="/dashboard" inConsoleMode={true}>
      <div className="w-full max-w-7xl mx-auto px-6">
        <DashboardView user={loggedInUser} isDark={isDark} onLogout={logout} />
      </div>
    </Layout>
  );
}
