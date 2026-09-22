import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const [authError, setAuthError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Check existing session on startup
  useEffect(() => {
    async function checkSession() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session && session.user) {
          setIsAdminAuthenticated(true);
          setAdminUser(session.user);
        } else {
          // Check local session storage fallback
          const localSession = sessionStorage.getItem('madhurfresh_admin_session');
          if (localSession === 'active') {
            setIsAdminAuthenticated(true);
          }
        }
      } catch (err) {
        console.warn('Session check:', err);
      } finally {
        setIsLoading(false);
      }
    }

    checkSession();

    // Listen to Supabase auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session && session.user) {
        setIsAdminAuthenticated(true);
        setAdminUser(session.user);
        sessionStorage.setItem('madhurfresh_admin_session', 'active');
      } else {
        const localSession = sessionStorage.getItem('madhurfresh_admin_session');
        if (localSession !== 'active') {
          setIsAdminAuthenticated(false);
          setAdminUser(null);
        }
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const loginAdmin = async (email, password) => {
    setIsLoading(true);
    setAuthError('');

    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPassword = (password || '').trim();

    try {
      // 1. Authenticate with Supabase Auth (Users created in Supabase Authentication tab)
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: cleanPassword
      });

      if (data?.session && data?.user && !error) {
        setIsAdminAuthenticated(true);
        setAdminUser(data.user);
        sessionStorage.setItem('madhurfresh_admin_session', 'active');
        setIsLoading(false);
        return { success: true };
      }

      if (error) {
        // Also check if user exists in custom admin_users table as secondary option
        const { data: customAdmin, error: customError } = await supabase
          .from('admin_users')
          .select('*')
          .eq('email', cleanEmail)
          .eq('password', cleanPassword)
          .single();

        if (customAdmin && !customError) {
          setIsAdminAuthenticated(true);
          setAdminUser({ email: customAdmin.email });
          sessionStorage.setItem('madhurfresh_admin_session', 'active');
          setIsLoading(false);
          return { success: true };
        }

        setAuthError(error.message || 'Invalid email or password.');
        setIsLoading(false);
        return { success: false, error: error.message };
      }

      setAuthError('Invalid credentials.');
      setIsLoading(false);
      return { success: false, error: 'Invalid credentials.' };
    } catch (err) {
      setAuthError(err.message || 'Authentication error.');
      setIsLoading(false);
      return { success: false, error: err.message };
    }
  };

  const logoutAdmin = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn('Signout:', e);
    }
    setIsAdminAuthenticated(false);
    setAdminUser(null);
    sessionStorage.removeItem('madhurfresh_admin_session');
    sessionStorage.removeItem('madhurfresh_admin_user');
  };

  return (
    <AuthContext.Provider
      value={{
        isAdminAuthenticated,
        adminUser,
        authError,
        isLoading,
        loginAdmin,
        logoutAdmin,
        setAuthError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
