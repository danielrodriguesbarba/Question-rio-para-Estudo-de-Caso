import { useState, useEffect, useCallback } from 'react';
import { User } from 'firebase/auth';
import { 
  initAuth, 
  googleSignIn, 
  googleSignOut, 
  getAccessToken,
  auth 
} from '../utils/googleAuth';

export function useGoogleAuth() {
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [token, setToken] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const unsubscribe = initAuth(
      (authenticatedUser, accessToken) => {
        setUser(authenticatedUser);
        setToken(accessToken);
        setIsInitialized(true);
      },
      () => {
        setUser(auth.currentUser);
        // Token might still need prompt if page refreshed
        setIsInitialized(true);
      }
    );

    return () => unsubscribe();
  }, []);

  const login = useCallback(async (): Promise<{ user: User; accessToken: string } | null> => {
    setIsLoggingIn(true);
    try {
      const result = await googleSignIn();
      setUser(result.user);
      setToken(result.accessToken);
      return result;
    } catch (err) {
      console.error('Falha ao conectar com conta Google:', err);
      throw err;
    } finally {
      setIsLoggingIn(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await googleSignOut();
    setUser(null);
    setToken(null);
  }, []);

  return {
    user,
    token,
    isLoggingIn,
    isInitialized,
    isAuthenticated: !!user && !!token,
    login,
    logout,
  };
}
