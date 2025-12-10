import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useToast } from './useToast';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { addToast } = useToast();
  const navigate = useNavigate();
  
  // Check if we're in development or test mode
  const isDevMode = process.env.NODE_ENV === 'development';
  const isTestMode = process.env.NODE_ENV === 'test';
  
  // Check if demo mode is enabled via environment variable
  const isDemoEnabled = import.meta.env.VITE_ENABLE_DEMO_MODE === 'true';

  // Get current session and user
  const getCurrentUser = useCallback(async () => {
    try {
      // For development, testing, or demo mode, we can bypass authentication
      if (isDevMode || isTestMode || isDemoEnabled) {
        const demoUser = {
          id: 'demo-user-id',
          email: 'demo@impactsoluce.com',
          user_metadata: {
            first_name: 'Demo',
            last_name: 'User',
            company: 'Demo Company',
          },
          created_at: new Date().toISOString(),
          last_sign_in_at: new Date().toISOString(),
        };
        
        setUser(demoUser);
        setIsAuthenticated(true);
        setIsLoading(false);
        return demoUser;
      }
      
      setIsLoading(true);
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error && error.message !== 'Auth session missing!') {
        console.error('Error getting user:', error);
        throw error;
      }
      
      setUser(user);
      setIsAuthenticated(!!user);
      return user;
    } catch (error) {
      console.error('Error in getCurrentUser:', error);
      setUser(null);
      setIsAuthenticated(false);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isDevMode, isTestMode, isDemoEnabled]);

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      // For development, testing, or demo mode, we can bypass authentication
      if ((isDevMode || isTestMode || isDemoEnabled) && 
          email === 'demo@esgsoluce.com' && 
          password === 'Demo123!') {
        
        const demoUser = {
          id: 'demo-user-id',
          email: 'demo@impactsoluce.com',
          user_metadata: {
            first_name: 'Demo',
            last_name: 'User',
            company: 'Demo Company',
          }
        };
        
        setUser(demoUser);
        setIsAuthenticated(true);
        addToast('success', 'Welcome to the demo!');
        return demoUser;
      }
      
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      setUser(data.user);
      setIsAuthenticated(true);
      addToast('success', 'Welcome back!');
      return data.user;
    } catch (error: any) {
      console.error('Sign in error:', error);
      addToast('error', 'Sign in failed', error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Sign up with email and password
  const signUp = async (email: string, password: string, metadata?: Record<string, any>) => {
    try {
      // For development, testing, or demo mode, we can bypass authentication
      if (isDevMode || isTestMode || isDemoEnabled) {
        const demoUser = {
          id: 'demo-user-id',
          email,
          user_metadata: metadata || {},
        };
        
        setUser(demoUser);
        setIsAuthenticated(true);
        addToast('success', 'Account created successfully!', 'Welcome to the demo.');
        return demoUser;
      }
      
      setIsLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata
        }
      });

      if (error) throw error;
      
      addToast('success', 'Account created successfully!', 'Please check your email to verify your account.');
      return data.user;
    } catch (error: any) {
      console.error('Sign up error:', error);
      addToast('error', 'Sign up failed', error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      // For development, testing, or demo mode, we can bypass authentication
      if (isDevMode || isTestMode || isDemoEnabled) {
        setUser(null);
        setIsAuthenticated(false);
        addToast('info', 'Signed out successfully');
        navigate('/login');
        return;
      }
      
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      setIsAuthenticated(false);
      addToast('info', 'Signed out successfully');
      navigate('/login');
    } catch (error: any) {
      console.error('Sign out error:', error);
      addToast('error', 'Sign out failed', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset password
  const resetPassword = async (email: string) => {
    try {
      // For development, testing, or demo mode, we can bypass authentication
      if (isDevMode || isTestMode || isDemoEnabled) {
        addToast('success', 'Password reset email sent', 'Please check your email for the reset link');
        return;
      }
      
      setIsLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      
      addToast('success', 'Password reset email sent', 'Please check your email for the reset link');
    } catch (error: any) {
      console.error('Password reset error:', error);
      addToast('error', 'Password reset failed', error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Update user profile
  const updateProfile = async (updates: Record<string, any>) => {
    try {
      // For development, testing, or demo mode, we can bypass authentication
      if (isDevMode || isTestMode || isDemoEnabled) {
        const updatedUser = {
          ...user,
          user_metadata: {
            ...user?.user_metadata,
            ...updates
          }
        };
        
        setUser(updatedUser);
        addToast('success', 'Profile updated successfully');
        return updatedUser;
      }
      
      setIsLoading(true);
      const { data, error } = await supabase.auth.updateUser({
        data: updates
      });
      
      if (error) throw error;
      
      setUser(data.user);
      addToast('success', 'Profile updated successfully');
      return data.user;
    } catch (error: any) {
      console.error('Profile update error:', error);
      addToast('error', 'Profile update failed', error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Listen for auth state changes
  useEffect(() => {
    // For development, testing, or demo mode, we can bypass authentication
    if (isDevMode || isTestMode || isDemoEnabled) {
      const urlParams = new URLSearchParams(window.location.search);
      const demoParam = urlParams.get('demo');
      
      if (demoParam === 'true') {
        const demoUser = {
          id: 'demo-user-id',
          email: 'demo@impactsoluce.com',
          user_metadata: {
            first_name: 'Demo',
            last_name: 'User',
            company: 'Demo Company',
          },
          created_at: new Date().toISOString(),
          last_sign_in_at: new Date().toISOString(),
        };
        
        setUser(demoUser);
        setIsAuthenticated(true);
        setIsLoading(false);
        return;
      }
    }
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      // @ts-ignore - event parameter is required by Supabase but not used
      async (_event, session) => {
        if (session) {
          setUser(session.user);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
        setIsLoading(false);
      }
    );

    // Get initial user
    getCurrentUser();

    return () => {
      subscription.unsubscribe();
    };
  }, [getCurrentUser, isDevMode, isTestMode, isDemoEnabled]);

  return {
    user,
    isLoading,
    isAuthenticated,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile,
    getCurrentUser
  };
};