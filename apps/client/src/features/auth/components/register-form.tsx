import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Loader2, UserPlus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { registerRequest } from '@/features/auth/auth-api';
import { getApiErrorMessage, getApiFieldErrors } from '@/features/auth/api-error';
import { registerFormSchema, type RegisterFormValues } from '@/features/auth/auth-schemas';
import { useAuth } from '@/features/auth/auth-context';
import { getDefaultAuthenticatedPath } from '@/features/auth/auth-routes';
import { FormField } from '@/features/auth/components/form-field';
import { useToast } from '@/providers/toast-provider';

export function RegisterForm() {
  const { isAuthLoading, isAuthenticated, login, user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [apiError, setApiError] = useState<string | null>(null);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'TEAM_MEMBER',
    },
  });

  const mutation = useMutation({
    mutationFn: registerRequest,
    onSuccess(result) {
      login(result.tokens, result.user);
      showToast({
        title: 'Account created',
        description: 'Your workspace session is ready.',
        variant: 'success',
      });
      void navigate(getDefaultAuthenticatedPath(result.user.role), { replace: true });
    },
    onError(error) {
      setApiError(getApiErrorMessage(error));
      const fieldErrors = getApiFieldErrors(error);

      for (const [field, messages] of Object.entries(fieldErrors)) {
        if (
          messages?.[0] &&
          (field === 'name' || field === 'email' || field === 'password' || field === 'role')
        ) {
          form.setError(field, { message: messages[0] });
        }
      }
    },
  });

  useEffect(() => {
    const subscription = form.watch(() => setApiError(null));

    return () => subscription.unsubscribe();
  }, [form]);

  if (isAuthLoading) {
    return null;
  }

  if (isAuthenticated) {
    return <Navigate replace to={getDefaultAuthenticatedPath(user?.role)} />;
  }

  return (
    <form className="space-y-5" onSubmit={form.handleSubmit((values) => mutation.mutate(values))}>
      {apiError ? (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {apiError}
        </div>
      ) : null}
      <FormField
        autoComplete="name"
        error={form.formState.errors.name}
        label="Name"
        placeholder="Jane Cooper"
        type="text"
        {...form.register('name')}
      />
      <FormField
        autoComplete="email"
        error={form.formState.errors.email}
        label="Email"
        placeholder="name@company.com"
        type="email"
        {...form.register('email')}
      />
      <FormField
        autoComplete="new-password"
        error={form.formState.errors.password}
        label="Password"
        placeholder="At least 8 characters"
        type="password"
        {...form.register('password')}
      />
      <div className="space-y-2">
        <label className="text-sm font-medium leading-none text-foreground" htmlFor="role">
          Role
        </label>
        <select
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          id="role"
          {...form.register('role')}
        >
          <option value="TEAM_MEMBER">Team Member</option>
          <option value="MANAGER">Manager</option>
        </select>
        {form.formState.errors.role ? (
          <p className="text-sm text-destructive">{form.formState.errors.role.message}</p>
        ) : null}
      </div>
      <Button className="w-full gap-2" disabled={mutation.isPending} type="submit">
        {mutation.isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <UserPlus className="h-4 w-4" />
        )}
        Create account
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link className="font-medium text-primary hover:underline" to="/login">
          Sign in
        </Link>
      </p>
    </form>
  );
}
