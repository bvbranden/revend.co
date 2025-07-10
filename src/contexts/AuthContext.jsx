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
      try {
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
            .select(`*`)
            .eq('id', session.user.id)
            .single();

          if (profileError) {
            console.error('Error fetching profile:', profileError);
            // Create profile if it doesn't exist
            if (profileError.code === 'PGRST116') {
              const { error: insertError } = await supabase
                .from('profiles_revend')
                .insert({
                  id: session.user.id,
                  name: session.user.user_metadata?.name || 'User',
                  email: session.user.email,
                  company: session.user.user_metadata?.company || '',
                  role: session.user.user_metadata?.role || 'user',
                  is_company_admin: session.user.user_metadata?.role === 'company_admin',
                  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
                });

              if (insertError) {
                console.error('Error creating profile:', insertError);
              } else {
                // Fetch the newly created profile
                const { data: newProfile } = await supabase
                  .from('profiles_revend')
                  .select(`*`)
                  .eq('id', session.user.id)
                  .single();
                
                setUser({
                  id: session.user.id,
                  email: session.user.email,
                  ...newProfile
                });
              }
            }
          } else {
            // Combine auth data with profile data
            setUser({
              id: session.user.id,
              email: session.user.email,
              ...profile
            });
          }
        }
      } catch (error) {
        console.error('Session check error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log('Auth state changed:', event, newSession?.user?.email);
        setSession(newSession);
        
        if (newSession) {
          try {
            // Fetch user profile data
            const { data: profile, error: profileError } = await supabase
              .from('profiles_revend')
              .select(`*`)
              .eq('id', newSession.user.id)
              .single();

            if (profileError) {
              console.error('Error fetching profile:', profileError);
              // Create profile if it doesn't exist
              if (profileError.code === 'PGRST116') {
                const { error: insertError } = await supabase
                  .from('profiles_revend')
                  .insert({
                    id: newSession.user.id,
                    name: newSession.user.user_metadata?.name || 'User',
                    email: newSession.user.email,
                    company: newSession.user.user_metadata?.company || '',
                    role: newSession.user.user_metadata?.role || 'user',
                    is_company_admin: newSession.user.user_metadata?.role === 'company_admin',
                    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
                  });

                if (!insertError) {
                  // Fetch the newly created profile
                  const { data: newProfile } = await supabase
                    .from('profiles_revend')
                    .select(`*`)
                    .eq('id', newSession.user.id)
                    .single();
                  
                  setUser({
                    id: newSession.user.id,
                    email: newSession.user.email,
                    ...newProfile
                  });
                }
              }
            } else {
              // Combine auth data with profile data
              setUser({
                id: newSession.user.id,
                email: newSession.user.email,
                ...profile
              });
            }
          } catch (error) {
            console.error('Profile fetch error:', error);
          }
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

    try {
      // Register user with Supabase Auth with auto-confirm enabled
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            company,
            role,
          },
          emailRedirectTo: window.location.origin,
        },
      });

      if (error) {
        throw error;
      }

      // For this application, we'll auto-login the user even without email confirmation
      if (data.user) {
        // Create profile in profiles table
        const { error: profileError } = await supabase
          .from('profiles_revend')
          .insert({
            id: data.user.id,
            name,
            email,
            company,
            role: role || 'user',
            is_company_admin: role === 'company_admin',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
          });

        if (profileError) {
          console.error('Profile creation error:', profileError);
          throw profileError;
        }
        
        // Auto sign-in after registration to bypass email confirmation
        await login(email, password);
      }

      return data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error logging out:', error);
    }
    setUser(null);
  };

  // Add a method to handle email confirmation
  const confirmEmail = async (token, email) => {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: token,
      type: 'email',
      email
    });
    
    if (error) {
      throw error;
    }
    
    // After confirmation, we should already have a session from onAuthStateChange
    return true;
  };

  const value = {
    user,
    session,
    login,
    register,
    logout,
    confirmEmail,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};