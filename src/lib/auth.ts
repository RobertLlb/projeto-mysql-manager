import { User } from '@supabase/supabase-js';
import { create } from 'zustand';
import { supabase } from './supabase';

interface AuthState {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  setUser: (user: User | null) => void;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  loading: true,
  signUp: async (email: string, password: string, name: string) => {
    const { error: dbError } = await supabase
      .from('users')
      .insert([
        {
          email: email,
          name: name,
          password: password,
        },
      ]);
    if (dbError) throw dbError;
  },

  signIn: async (email: string, password: string) => {
    const { data: userData, error: userDataError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .eq('password', password)
      .single();

    if (userDataError) throw userDataError;

    set({ user: userData, loading: false });

    // Salva o usuário no localStorage
    localStorage.setItem('user', JSON.stringify(userData));
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;

    set({ user: null, loading: false });

    // Remove o usuário do localStorage
    localStorage.removeItem('user');
  },

  setUser: (user) => {
    set({ user, loading: false });
  },
}));
