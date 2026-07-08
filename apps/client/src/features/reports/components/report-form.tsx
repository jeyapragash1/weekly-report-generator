import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { Project } from '@/features/projects/project-types';
import { reportFormSchema, type ReportFormValues } from '@/features/reports/report-schemas';
import type { WeeklyReport } from '@/features/reports/report-types';
import { toDateInputValue } from '@/features/reports/report-utils';

type ReportFormProps = {
  formId: string;
  report?: WeeklyReport;
  projects: Project[];
  disabled?: boolean;
  onSubmit: (values: ReportFormValues) => void;
};

export function ReportForm({
  disabled = false,
  formId,
  onSubmit,
  projects,
  report,
}: ReportFormProps) {
  const activeProjects = projects.filter((project) => project.status !== 'ARCHIVED');
  const form = useForm<ReportFormValues>({
    resolver: zodResolver(reportFormSchema),
    defaultValues: {
      weekStartDate: report ? toDateInputValue(report.weekStartDate) : '',
      weekEndDate: report ? toDateInputValue(report.weekEndDate) : '',
      projectId: report?.project.id ?? '',
      tasksCompleted: report?.tasksCompleted ?? '',
      tasksPlanned: report?.tasksPlanned ?? '',
      blockers: report?.blockers ?? '',
      hoursWorked: report?.hoursWorked ?? undefined,
      notes: report?.notes ?? '',
    },
  });

  useEffect(() => {
    form.reset({
      weekStartDate: report ? toDateInputValue(report.weekStartDate) : '',
      weekEndDate: report ? toDateInputValue(report.weekEndDate) : '',
      projectId: report?.project.id ?? '',
      tasksCompleted: report?.tasksCompleted ?? '',
      tasksPlanned: report?.tasksPlanned ?? '',
      blockers: report?.blockers ?? '',
      hoursWorked: report?.hoursWorked ?? undefined,
      notes: report?.notes ?? '',
    });
  }, [form, report]);

  return (
    <form className="space-y-5" id={formId} onSubmit={form.handleSubmit(onSubmit)}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor={`${formId}-week-start`}>Week Start Date</Label>
          <Input
            disabled={disabled}
            id={`${formId}-week-start`}
            type="date"
            {...form.register('weekStartDate')}
          />
          {form.formState.errors.weekStartDate ? (
            <p className="text-sm text-destructive">
              {form.formState.errors.weekStartDate.message}
            </p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${formId}-week-end`}>Week End Date</Label>
          <Input
            disabled={disabled}
            id={`${formId}-week-end`}
            type="date"
            {...form.register('weekEndDate')}
          />
          {form.formState.errors.weekEndDate ? (
            <p className="text-sm text-destructive">{form.formState.errors.weekEndDate.message}</p>
          ) : null}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${formId}-project`}>Project</Label>
        <Select disabled={disabled} id={`${formId}-project`} {...form.register('projectId')}>
          <option value="">Select a project</option>
          {activeProjects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </Select>
        {form.formState.errors.projectId ? (
          <p className="text-sm text-destructive">{form.formState.errors.projectId.message}</p>
        ) : null}
      </div>

      {(
        [
          ['tasksCompleted', 'Tasks Completed'],
          ['tasksPlanned', 'Tasks Planned'],
          ['blockers', 'Blockers'],
          ['notes', 'Notes'],
        ] as const
      ).map(([name, label]) => (
        <div className="space-y-2" key={name}>
          <Label htmlFor={`${formId}-${name}`}>{label}</Label>
          <Textarea
            disabled={disabled}
            id={`${formId}-${name}`}
            placeholder={label}
            {...form.register(name as keyof ReportFormValues)}
          />
          {form.formState.errors[name as keyof ReportFormValues]?.message ? (
            <p className="text-sm text-destructive">
              {form.formState.errors[name as keyof ReportFormValues]?.message}
            </p>
          ) : null}
        </div>
      ))}

      <div className="space-y-2">
        <Label htmlFor={`${formId}-hours`}>Hours Worked</Label>
        <Input
          disabled={disabled}
          id={`${formId}-hours`}
          max={168}
          min={0}
          placeholder="e.g. 40"
          step="0.25"
          type="number"
          {...form.register('hoursWorked', {
            setValueAs: (value) => (value === '' ? undefined : Number(value)),
          })}
        />
        {form.formState.errors.hoursWorked ? (
          <p className="text-sm text-destructive">{form.formState.errors.hoursWorked.message}</p>
        ) : null}
      </div>
    </form>
  );
}
