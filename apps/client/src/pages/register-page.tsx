import { AuthShell } from '@/features/auth/components/auth-shell';
import { RegisterForm } from '@/features/auth/components/register-form';

export function RegisterPage() {
  return (
    <AuthShell
      description="Create a team member or manager account for weekly reporting."
      eyebrow="Start reporting"
      title="Create account"
    >
      <RegisterForm />
    </AuthShell>
  );
}
