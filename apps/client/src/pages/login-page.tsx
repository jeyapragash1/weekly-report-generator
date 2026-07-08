import { AuthShell } from '@/features/auth/components/auth-shell';
import { LoginForm } from '@/features/auth/components/login-form';

export function LoginPage() {
  return (
    <AuthShell
      description="Sign in to manage weekly reports, project visibility, and team review workflows."
      eyebrow="Secure access"
      title="Sign in"
    >
      <LoginForm />
    </AuthShell>
  );
}
