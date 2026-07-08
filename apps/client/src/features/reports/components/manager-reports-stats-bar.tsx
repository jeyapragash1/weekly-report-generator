import { FileCheck2, FilePenLine, FolderKanban, UsersRound } from 'lucide-react';

type ManagerReportsStatsBarProps = {
  totalReports: number;
  submittedReports: number;
  draftReports: number;
  uniqueMembers: number;
  uniqueProjects: number;
};

export function ManagerReportsStatsBar({
  draftReports,
  submittedReports,
  totalReports,
  uniqueMembers,
  uniqueProjects,
}: ManagerReportsStatsBarProps) {
  const cards = [
    {
      label: 'Total team reports',
      value: totalReports,
      icon: FileCheck2,
    },
    {
      label: 'Submitted',
      value: submittedReports,
      icon: FileCheck2,
    },
    {
      label: 'Draft',
      value: draftReports,
      icon: FilePenLine,
    },
    {
      label: 'Team members',
      value: uniqueMembers,
      icon: UsersRound,
    },
    {
      label: 'Projects',
      value: uniqueProjects,
      icon: FolderKanban,
    },
  ];

  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <article
            className="rounded-lg border border-border bg-card p-4 shadow-sm"
            key={card.label}
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground">{card.label}</p>
              <div className="rounded-md bg-primary/10 p-2 text-primary">
                <Icon className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-3 text-2xl font-semibold tracking-normal">
              {card.value.toLocaleString()}
            </p>
          </article>
        );
      })}
    </section>
  );
}
