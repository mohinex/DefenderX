import React, { useEffect } from 'react';
import Layout from '../components/layout/Layout';
import ProfileView from '../components/ProfileView';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

export default function ProfilePage() {
  const { loggedInUser, isDark, setLoggedInUser } = useApp();
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
    <Layout activeRoute="/profile" inConsoleMode={true}>
      <div className="w-full max-w-4xl mx-auto px-6">
        <ProfileView 
          isDark={isDark} 
          user={loggedInUser} 
          onUpdateSuccess={(updatedUser) => {
            setLoggedInUser(updatedUser);
          }} 
        />
      </div>
    </Layout>
  );
}
