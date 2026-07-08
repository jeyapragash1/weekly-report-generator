import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { projectFormSchema, type ProjectFormValues } from '@/features/projects/project-schemas';
import type { Project } from '@/features/projects/project-types';

type ProjectFormProps = {
  formId: string;
  project?: Project;
  onSubmit: (values: ProjectFormValues) => void;
  disabled?: boolean;
  showStatus?: boolean;
};

export function ProjectForm({
  disabled = false,
  formId,
  onSubmit,
  project,
  showStatus = false,
}: ProjectFormProps) {
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      name: project?.name ?? '',
      description: project?.description ?? '',
      status: project?.status ?? 'ACTIVE',
    },
  });

  useEffect(() => {
    form.reset({
      name: project?.name ?? '',
      description: project?.description ?? '',
      status: project?.status ?? 'ACTIVE',
    });
  }, [form, project]);

  return (
    <form className="space-y-5" id={formId} onSubmit={form.handleSubmit(onSubmit)}>
      <div className="space-y-2">
        <Label htmlFor={`${formId}-name`}>Project Name</Label>
        <Input
          autoComplete="off"
          disabled={disabled}
          id={`${formId}-name`}
          placeholder="e.g. Mobile app migration"
          {...form.register('name')}
        />
        {form.formState.errors.name ? (
          <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${formId}-description`}>Description</Label>
        <textarea
          className="flex min-h-28 w-full resize-y rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
          disabled={disabled}
          id={`${formId}-description`}
          placeholder="Add a short project summary"
          {...form.register('description')}
        />
        {form.formState.errors.description ? (
          <p className="text-sm text-destructive">{form.formState.errors.description.message}</p>
        ) : null}
      </div>

      {showStatus ? (
        <div className="space-y-2">
          <Label htmlFor={`${formId}-status`}>Status</Label>
          <select
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
            disabled={disabled}
            id={`${formId}-status`}
            {...form.register('status')}
          >
            <option value="ACTIVE">Active</option>
            <option value="ON_HOLD">On hold</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>
      ) : null}
    </form>
  );
}
