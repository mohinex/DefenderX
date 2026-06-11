import React, { useEffect } from 'react';
import Layout from '../components/layout/Layout';
import SeoDashboardView from '../components/SeoDashboardView';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

export default function SeoSettingsPage() {
  const { loggedInUser, isDark } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loggedInUser) {
      navigate('/login');
    }
  }, [loggedInUser, navigate]);

  if (!loggedInUser) {
    return null; // Prevent layout flashing
  }

  return (
    <Layout activeRoute="/seo-settings" inConsoleMode={true}>
      <div className="w-full max-w-7xl mx-auto px-6">
        <SeoDashboardView isDark={isDark} user={loggedInUser} />
      </div>
    </Layout>
  );
}
