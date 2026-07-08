import type { FieldError } from 'react-hook-form';
import { Input, type InputProps } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type FormFieldProps = InputProps & {
  label: string;
  error?: FieldError | string;
};

export function FormField({ error, id, label, ...props }: FormFieldProps) {
  const errorMessage = typeof error === 'string' ? error : error?.message;
  const inputId = id ?? props.name;

  return (
    <div className="space-y-2">
      <Label htmlFor={inputId}>{label}</Label>
      <Input
        aria-describedby={errorMessage ? `${inputId}-error` : undefined}
        id={inputId}
        {...props}
      />
      {errorMessage ? (
        <p className="text-sm text-destructive" id={`${inputId}-error`}>
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}
