export type UserRole = 'TEAM_MEMBER' | 'MANAGER' | 'ADMIN';

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export type AuthResponse = {
  user: AuthUser;
  tokens: AuthTokens;
};
