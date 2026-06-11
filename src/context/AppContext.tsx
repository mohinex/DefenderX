import React, { createContext, useContext, useState, useEffect } from 'react';
import { safeDecodeToken } from '../lib/api';

interface AppContextType {
  isDark: boolean;
  toggleTheme: () => void;
  loggedInUser: any | null;
  token: string | null;
  setLoggedInUser: (user: any | null) => void;
  login: (token: string) => void;
  logout: () => void;
  socialLinks: {
    facebook: string;
    twitter: string;
    linkedin: string;
  };
  setSocialLinks: React.Dispatch<React.SetStateAction<{
    facebook: string;
    twitter: string;
    linkedin: string;
  }>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState<boolean>(true); // Default to dark mode for elite visual appeal
  const [token, setTokenState] = useState<string | null>(() => localStorage.getItem('eurosia_token'));
  
  const [loggedInUser, setLoggedInUser] = useState<any>(() => {
    try {
      const storedToken = localStorage.getItem('eurosia_token');
      if (storedToken) {
        const decoded = safeDecodeToken(storedToken);
        if (decoded && decoded.exp > Date.now()) {
          return decoded;
        }
        localStorage.removeItem('eurosia_token');
      }
    } catch (e) {
      localStorage.removeItem('eurosia_token');
    }
    return null;
  });

  const [socialLinks, setSocialLinks] = useState({
    facebook: 'https://www.facebook.com/EurosiaOfficial',
    twitter: 'https://x.com/EurosiaOfficial',
    linkedin: 'https://linkedin.com/in/EurosiaOfficial'
  });

  // Pull social profiles dynamically from global SEO settings or default back to official ones
  useEffect(() => {
    fetch('/api/v1/seo/public/config')
      .then(res => res.json())
      .then(data => {
        if (data && data.global) {
          setSocialLinks({
            facebook: data.global.facebookUrl || 'https://www.facebook.com/EurosiaOfficial',
            twitter: data.global.twitterUrl || 'https://x.com/EurosiaOfficial',
            linkedin: data.global.linkedinUrl || 'https://linkedin.com/in/EurosiaOfficial'
          });
        }
      })
      .catch(() => {});
  }, []);

  // Listen for unauthorized events to redirect to login
  useEffect(() => {
    const handleUnauthorized = () => {
      logout();
    };
    window.addEventListener('secops-unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('secops-unauthorized', handleUnauthorized);
    };
  }, []);

  // Apply root variables depending on isDark state
  useEffect(() => {
    if (!isDark) {
      document.documentElement.style.setProperty('--dark', '#f0f2f8');
      document.documentElement.style.setProperty('--navy', '#e8ecf5');
      document.documentElement.style.setProperty('--white', '#0A1025');
      document.documentElement.style.setProperty('--gray', '#4a5568');
      document.documentElement.style.setProperty('--card-bg', 'rgba(232,236,245,0.9)');
    } else {
      document.documentElement.style.setProperty('--dark', '#050816');
      document.documentElement.style.setProperty('--navy', '#0A1025');
      document.documentElement.style.setProperty('--white', '#FFFFFF');
      document.documentElement.style.setProperty('--gray', '#B8C1D1');
      document.documentElement.style.setProperty('--card-bg', 'rgba(10,16,37,0.85)');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(prev => !prev);
  };

  const login = (newToken: string) => {
    localStorage.setItem('eurosia_token', newToken);
    setTokenState(newToken);
    const decoded = safeDecodeToken(newToken);
    setLoggedInUser(decoded);
  };

  const logout = () => {
    localStorage.removeItem('eurosia_token');
    setTokenState(null);
    setLoggedInUser(null);
  };

  return (
    <AppContext.Provider
      value={{
        isDark,
        toggleTheme,
        loggedInUser,
        token,
        setLoggedInUser,
        login,
        logout,
        socialLinks,
        setSocialLinks
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
