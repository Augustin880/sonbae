export type User = {
  id: string;
  name: string;
  role: 'teacher' | 'department-lead' | 'admin';
};

export type AuthService = {
  getCurrentUser(): Promise<User>;
  isAuthenticated(): Promise<boolean>;
};

export function createDemoAuthService(): AuthService {
  const demoUser: User = {
    id: 'demo-user',
    name: 'Avery Kim',
    role: 'department-lead',
  };

  return {
    getCurrentUser() {
      return Promise.resolve(demoUser);
    },
    isAuthenticated() {
      return Promise.resolve(true);
    },
  };
}
