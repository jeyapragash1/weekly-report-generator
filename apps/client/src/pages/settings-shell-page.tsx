import { zodResolver } from '@hookform/resolvers/zod';
import { Globe, Info, MoonStar, Save, Sun, Volume2 } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { PageContainer } from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useTheme } from '@/providers/theme-provider';
import { useToast } from '@/providers/toast-provider';

const settingsSchema = z.object({
  theme: z.enum(['light', 'dark']),
  notificationsEnabled: z.boolean(),
  language: z.enum(['en', 'id']),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

export function SettingsShellPage() {
  const { showToast } = useToast();
  const { theme, toggleTheme } = useTheme();
  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      theme,
      notificationsEnabled: true,
      language: 'en',
    },
  });

  useEffect(() => {
    form.setValue('theme', theme);
  }, [form, theme]);

  function onSubmit(values: SettingsFormValues) {
    if (values.theme !== theme) {
      toggleTheme();
    }

    showToast({
      title: 'Settings updated',
      description:
        values.language === 'en'
          ? 'Your preferences were saved locally.'
          : 'Preferensi Anda berhasil disimpan secara lokal.',
      variant: 'success',
    });
  }

  return (
    <PageContainer
      description="Manage your workspace preferences and application behavior."
      title="Settings"
    >
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <section className="rounded-lg border border-border bg-card p-5 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Appearance
          </h2>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-md border border-border bg-background p-4">
              <div className="flex items-center gap-2 text-sm font-medium">
                <MoonStar className="h-4 w-4 text-primary" />
                Theme mode
              </div>
              <div className="mt-3 flex items-center justify-between gap-3">
                <p className="text-sm text-muted-foreground">Switch between light and dark mode.</p>
                <Switch
                  aria-label="Toggle theme"
                  checked={form.watch('theme') === 'dark'}
                  onCheckedChange={(checked) => {
                    form.setValue('theme', checked ? 'dark' : 'light');
                  }}
                />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Current: {form.watch('theme') === 'dark' ? 'Dark' : 'Light'}
              </p>
            </div>

            <div className="rounded-md border border-border bg-background p-4">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Globe className="h-4 w-4 text-primary" />
                Language
              </div>
              <Label className="mt-3 block" htmlFor="settings-language">
                Preferred language
              </Label>
              <Select
                className="mt-2"
                id="settings-language"
                onChange={(event) => form.setValue('language', event.target.value as 'en' | 'id')}
                value={form.watch('language')}
              >
                <option value="en">English (default)</option>
                <option value="id">Bahasa Indonesia</option>
              </Select>
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-border bg-card p-5 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Notifications
          </h2>

          <div className="mt-4 rounded-md border border-border bg-background p-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Volume2 className="h-4 w-4 text-primary" />
              Notify on updates
            </div>
            <div className="mt-3 flex items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground">Control in-app notification prompts.</p>
              <Switch
                aria-label="Toggle notifications"
                checked={form.watch('notificationsEnabled')}
                onCheckedChange={(checked) => form.setValue('notificationsEnabled', checked)}
              />
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-border bg-card p-5 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            About
          </h2>

          <div className="mt-4 rounded-md border border-border bg-background p-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Info className="h-4 w-4 text-primary" />
              Weekly Report Generator
            </div>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              This workspace helps teams track weekly progress, blockers, and planning outcomes.
              Settings are currently stored in-browser for a lightweight experience.
            </p>
            <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
              <Sun className="h-3.5 w-3.5" />
              Theme-aware and accessible interface
            </div>
          </div>
        </section>

        <div className="flex justify-end">
          <Button className="gap-2" type="submit">
            <Save className="h-4 w-4" />
            Save settings
          </Button>
        </div>
      </form>
    </PageContainer>
  );
}
