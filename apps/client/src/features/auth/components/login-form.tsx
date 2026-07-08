import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Loader2, LogIn } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { loginRequest } from '@/features/auth/auth-api';
import { getApiErrorMessage, getApiFieldErrors } from '@/features/auth/api-error';
import { loginFormSchema, type LoginFormValues } from '@/features/auth/auth-schemas';
import { useAuth } from '@/features/auth/auth-context';
import { getDefaultAuthenticatedPath } from '@/features/auth/auth-routes';
import { FormField } from '@/features/auth/components/form-field';
import { useToast } from '@/providers/toast-provider';

export function LoginForm() {
  const { isAuthLoading, isAuthenticated, login, user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [apiError, setApiError] = useState<string | null>(null);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const mutation = useMutation({
    mutationFn: loginRequest,
    onSuccess(result) {
      login(result.tokens, result.user);
      showToast({ title: 'Welcome back', description: 'You are signed in.', variant: 'success' });
      void navigate(getDefaultAuthenticatedPath(result.user.role), { replace: true });
    },
    onError(error) {
      setApiError(getApiErrorMessage(error));
      const fieldErrors = getApiFieldErrors(error);

      for (const [field, messages] of Object.entries(fieldErrors)) {
        if (messages?.[0] && (field === 'email' || field === 'password')) {
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
        autoComplete="email"
        error={form.formState.errors.email}
        label="Email"
        placeholder="name@company.com"
        type="email"
        {...form.register('email')}
      />
      <FormField
        autoComplete="current-password"
        error={form.formState.errors.password}
        label="Password"
        placeholder="Enter your password"
        type="password"
        {...form.register('password')}
      />
      <Button className="w-full gap-2" disabled={mutation.isPending} type="submit">
        {mutation.isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <LogIn className="h-4 w-4" />
        )}
        Sign in
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        New to the workspace?{' '}
        <Link className="font-medium text-primary hover:underline" to="/register">
          Create an account
        </Link>
      </p>
    </form>
  );
}
