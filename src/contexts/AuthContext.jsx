import React, { createContext, useContext, useState, useEffect } from 'react';
import supabase from '../lib/supabase';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState(null);

  useEffect(() => {
    // Check for active session
    const checkSession = async () => {
      setIsLoading(true);
      
      // Get current session
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error getting session:', error);
        setIsLoading(false);
        return;
      }

      setSession(session);
      if (session) {
        // Fetch user profile data
        const { data: profile, error: profileError } = await supabase
          .from('profiles_revend')
          .select(`
            *,
            company:company_id(*)
          `)
          .eq('id', session.user.id)
          .single();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
        }

        // Combine auth data with profile data
        setUser({
          id: session.user.id,
          email: session.user.email,
          ...profile
        });
      }
      setIsLoading(false);
    };

    checkSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        setSession(newSession);
        if (newSession) {
          // Fetch user profile data
          const { data: profile, error: profileError } = await supabase
            .from('profiles_revend')
            .select(`
              *,
              company:company_id(*)
            `)
            .eq('id', newSession.user.id)
            .single();

          if (profileError) {
            console.error('Error fetching profile:', profileError);
          }

          // Combine auth data with profile data
          setUser({
            id: newSession.user.id,
            email: newSession.user.email,
            ...profile
          });
        } else {
          setUser(null);
        }
      }
    );

    // Cleanup subscription
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }
    return data;
  };

  const register = async (userData) => {
    const { name, email, password, company, role } = userData;

    // First, create or get company
    let companyId = null;
    if (company) {
      const { data: existingCompany } = await supabase
        .from('companies_revend')
        .select('id')
        .eq('name', company)
        .single();

      if (existingCompany) {
        companyId = existingCompany.id;
      } else {
        const { data: newCompany, error: companyError } = await supabase
          .from('companies_revend')
          .insert({ name: company })
          .select('id')
          .single();

        if (companyError) throw companyError;
        companyId = newCompany.id;
      }
    }

    // Register user with Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          company,
          role,
        },
      },
    });

    if (error) {
      throw error;
    }

    // Create profile in profiles table
    const { error: profileError } = await supabase
      .from('profiles_revend')
      .insert({
        id: data.user.id,
        name,
        company_id: companyId,
        role: role || 'user',
        is_company_admin: role === 'company_admin',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      });

    if (profileError) {
      throw profileError;
    }

    return data;
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error logging out:', error);
    }
    setUser(null);
  };

  const value = {
    user,
    session,
    login,
    register,
    logout,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};