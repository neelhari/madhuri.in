import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Admin auth state
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState(null);

  // Customer auth state
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('madhurfresh_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(() => {
    return !!localStorage.getItem('madhurfresh_user');
  });

  const [authError, setAuthError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Check existing session on startup
  useEffect(() => {
    async function checkSession() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session && session.user) {
          const role = session.user.user_metadata?.role || session.user.app_metadata?.role;
          
          if (role === 'admin' || session.user.email?.toLowerCase() === 'madurfoods@gmail.com') {
            setIsAdminAuthenticated(true);
            setAdminUser(session.user);
            sessionStorage.setItem('madhurfresh_admin_session', 'active');
          } else {
            // Customer user
            const userObj = {
              id: session.user.id,
              email: session.user.email,
              name: session.user.user_metadata?.name || session.user.user_metadata?.full_name || session.user.email.split('@')[0],
              phone: session.user.user_metadata?.phone || '',
              role: 'customer',
              createdAt: session.user.created_at
            };
            setCurrentUser(userObj);
            setIsUserAuthenticated(true);
            localStorage.setItem('madhurfresh_user', JSON.stringify(userObj));
          }
        } else {
          // Check local admin session storage fallback
          const localAdmin = sessionStorage.getItem('madhurfresh_admin_session');
          if (localAdmin === 'active') {
            setIsAdminAuthenticated(true);
          }
          
          // Check customer local storage
          const localCustomer = localStorage.getItem('madhurfresh_user');
          if (localCustomer) {
            try {
              setCurrentUser(JSON.parse(localCustomer));
              setIsUserAuthenticated(true);
            } catch {
              localStorage.removeItem('madhurfresh_user');
            }
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
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session && session.user) {
        const role = session.user.user_metadata?.role;
        if (role === 'admin' || session.user.email?.toLowerCase() === 'madurfoods@gmail.com') {
          setIsAdminAuthenticated(true);
          setAdminUser(session.user);
          sessionStorage.setItem('madhurfresh_admin_session', 'active');
        } else {
          const userObj = {
            id: session.user.id,
            email: session.user.email,
            name: session.user.user_metadata?.name || session.user.user_metadata?.full_name || session.user.email.split('@')[0],
            phone: session.user.user_metadata?.phone || '',
            role: 'customer',
            createdAt: session.user.created_at
          };
          setCurrentUser(userObj);
          setIsUserAuthenticated(true);
          localStorage.setItem('madhurfresh_user', JSON.stringify(userObj));
        }
      } else if (event === 'SIGNED_OUT') {
        const localAdmin = sessionStorage.getItem('madhurfresh_admin_session');
        if (localAdmin !== 'active') {
          setIsAdminAuthenticated(false);
          setAdminUser(null);
        }
        setIsUserAuthenticated(false);
        setCurrentUser(null);
        localStorage.removeItem('madhurfresh_user');
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Customer Login
  const loginUser = async (email, password) => {
    setIsLoading(true);
    setAuthError('');

    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPassword = (password || '').trim();

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: cleanPassword
      });

      if (error) {
        // Fallback for local demo users if Supabase signup confirmation or restrictions apply
        const localAccounts = JSON.parse(localStorage.getItem('madhurfresh_registered_users') || '[]');
        const match = localAccounts.find(u => u.email.toLowerCase() === cleanEmail && u.password === cleanPassword);
        
        if (match) {
          const userObj = {
            id: match.id || `usr_${Date.now()}`,
            email: match.email,
            name: match.name || match.email.split('@')[0],
            phone: match.phone || '',
            role: 'customer'
          };
          setCurrentUser(userObj);
          setIsUserAuthenticated(true);
          localStorage.setItem('madhurfresh_user', JSON.stringify(userObj));
          setIsLoading(false);
          return { success: true, user: userObj };
        }

        setAuthError(error.message || 'Invalid email or password.');
        setIsLoading(false);
        return { success: false, error: error.message };
      }

      if (data?.user) {
        const userObj = {
          id: data.user.id,
          email: data.user.email,
          name: data.user.user_metadata?.name || data.user.user_metadata?.full_name || data.user.email.split('@')[0],
          phone: data.user.user_metadata?.phone || '',
          role: 'customer'
        };
        setCurrentUser(userObj);
        setIsUserAuthenticated(true);
        localStorage.setItem('madhurfresh_user', JSON.stringify(userObj));
        setIsLoading(false);
        return { success: true, user: userObj };
      }

      setAuthError('Authentication failed.');
      setIsLoading(false);
      return { success: false, error: 'Authentication failed.' };
    } catch (err) {
      setAuthError(err.message || 'Login error.');
      setIsLoading(false);
      return { success: false, error: err.message };
    }
  };

  // Customer Register / Account Creation
  const registerUser = async ({ name, email, password, phone = '' }) => {
    setIsLoading(true);
    setAuthError('');

    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPassword = (password || '').trim();
    const cleanName = (name || '').trim();
    const cleanPhone = (phone || '').trim();

    try {
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password: cleanPassword,
        options: {
          data: {
            name: cleanName,
            full_name: cleanName,
            phone: cleanPhone,
            role: 'customer'
          }
        }
      });

      // Save to local registered accounts cache as well for offline/reliable fallback
      const localAccounts = JSON.parse(localStorage.getItem('madhurfresh_registered_users') || '[]');
      const existingIdx = localAccounts.findIndex(u => u.email.toLowerCase() === cleanEmail);
      const newAcc = {
        id: data?.user?.id || `usr_${Date.now()}`,
        name: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        password: cleanPassword,
        createdAt: new Date().toISOString()
      };
      if (existingIdx >= 0) {
        localAccounts[existingIdx] = newAcc;
      } else {
        localAccounts.push(newAcc);
      }
      localStorage.setItem('madhurfresh_registered_users', JSON.stringify(localAccounts));

      if (error) {
        // If Supabase gave error (like rate limit or unconfirmed email requirement), log the user in locally
        const userObj = {
          id: newAcc.id,
          name: cleanName,
          email: cleanEmail,
          phone: cleanPhone,
          role: 'customer'
        };
        setCurrentUser(userObj);
        setIsUserAuthenticated(true);
        localStorage.setItem('madhurfresh_user', JSON.stringify(userObj));
        setIsLoading(false);
        return { success: true, user: userObj, isFallback: true };
      }

      const userObj = {
        id: data?.user?.id || newAcc.id,
        name: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        role: 'customer'
      };
      setCurrentUser(userObj);
      setIsUserAuthenticated(true);
      localStorage.setItem('madhurfresh_user', JSON.stringify(userObj));
      setIsLoading(false);
      return { success: true, user: userObj };
    } catch (err) {
      setAuthError(err.message || 'Registration error.');
      setIsLoading(false);
      return { success: false, error: err.message };
    }
  };

  // Customer Logout
  const logoutUser = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn('Signout error:', e);
    }
    setIsUserAuthenticated(false);
    setCurrentUser(null);
    localStorage.removeItem('madhurfresh_user');
  };

  // Admin Login
  const loginAdmin = async (email, password) => {
    setIsLoading(true);
    setAuthError('');

    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPassword = (password || '').trim();

    try {
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
        // Fallback 1: Custom admin_users table in Supabase
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

        // Fallback 2: Default Store Manager credentials
        if (
          cleanEmail === 'madurfoods@gmail.com' &&
          (cleanPassword === 'Madhur@9059' || cleanPassword === 'admin123')
        ) {
          setIsAdminAuthenticated(true);
          setAdminUser({ email: cleanEmail, role: 'admin' });
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

  // Admin Logout
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
        // Customer Auth
        currentUser,
        isUserAuthenticated,
        loginUser,
        registerUser,
        logoutUser,
        // Admin Auth
        isAdminAuthenticated,
        adminUser,
        loginAdmin,
        logoutAdmin,
        // Shared
        authError,
        isLoading,
        setAuthError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
