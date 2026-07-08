import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';
import { httpClient } from '@/api/http-client';
import { getCurrentUserRequest } from '@/features/auth/auth-api';
import { authTokenStore } from '@/lib/auth-token-store';
import type { AuthTokens, AuthUser } from '@/features/auth/auth-types';

type AuthContextValue = {
  user: AuthUser | null;
  isAuthLoading: boolean;
  isAuthenticated: boolean;
  login: (tokens: AuthTokens, user: AuthUser) => void;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(Boolean(authTokenStore.getAccessToken()));

  useEffect(() => {
    let isMounted = true;

    async function hydrateCurrentUser() {
      if (!authTokenStore.getAccessToken()) {
        setIsAuthLoading(false);
        return;
      }

      try {
        const currentUser = await getCurrentUserRequest();

        if (isMounted) {
          setUser(currentUser);
        }
      } catch {
        authTokenStore.clearTokens();

        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setIsAuthLoading(false);
        }
      }
    }

    void hydrateCurrentUser();

    return () => {
      isMounted = false;
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthLoading,
      isAuthenticated: Boolean(authTokenStore.getAccessToken()),
      login(tokens, nextUser) {
        authTokenStore.setTokens(tokens);
        setUser(nextUser);
        setIsAuthLoading(false);
      },
      async logout() {
        const refreshToken = authTokenStore.getRefreshToken();

        if (refreshToken) {
          await httpClient.post('/auth/logout', { refreshToken }).catch(() => undefined);
        }

        authTokenStore.clearTokens();
        setUser(null);
      },
    }),
    [isAuthLoading, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
