import { createContext, useContext, useMemo, useState, type PropsWithChildren } from 'react';
import { httpClient } from '@/api/http-client';
import { authTokenStore } from '@/lib/auth-token-store';

type UserRole = 'TEAM_MEMBER' | 'MANAGER' | 'ADMIN';

type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (tokens: { accessToken: string; refreshToken: string }, user: AuthUser) => void;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<AuthUser | null>(null);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(authTokenStore.getAccessToken()),
      login(tokens, nextUser) {
        authTokenStore.setTokens(tokens);
        setUser(nextUser);
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
    [user],
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
