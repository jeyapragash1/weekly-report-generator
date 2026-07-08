import { Prisma, PrismaClient, ProjectStatus, ReportStatus, RoleName } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const SALT_ROUNDS = 12;
const SEED_PASSWORD = 'Password@123';

type SeedUser = {
  name: string;
  email: string;
  role: RoleName;
};

type SeedProject = {
  name: string;
  description: string;
  status: ProjectStatus;
  archivedAt?: Date | null;
};

type WeekRange = {
  start: Date;
  end: Date;
};

function utcDate(year: number, month: number, day: number) {
  return new Date(Date.UTC(year, month - 1, day, 0, 0, 0));
}

function addDays(date: Date, days: number) {
  return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
}

function formatHours(value: number) {
  return new Prisma.Decimal(value.toFixed(2));
}

const roles = [
  {
    name: RoleName.ADMIN,
    description: 'System administrator with full access to the platform.',
  },
  {
    name: RoleName.MANAGER,
    description: 'Manager responsible for projects, reports, and team oversight.',
  },
  {
    name: RoleName.TEAM_MEMBER,
    description: 'Team member who submits weekly project updates.',
  },
] as const;

const users: SeedUser[] = [
  {
    name: 'Kisho Jeyapragash',
    email: 'kisho.jeyapragash@weeklyreport.local',
    role: RoleName.ADMIN,
  },
  {
    name: 'Denusha Jesunesan',
    email: 'denusha.jesunesan@weeklyreport.local',
    role: RoleName.MANAGER,
  },
  {
    name: 'Liam Anderson',
    email: 'liam.anderson@weeklyreport.local',
    role: RoleName.TEAM_MEMBER,
  },
  {
    name: 'Emma Brown',
    email: 'emma.brown@weeklyreport.local',
    role: RoleName.TEAM_MEMBER,
  },
  {
    name: 'Noah Wilson',
    email: 'noah.wilson@weeklyreport.local',
    role: RoleName.TEAM_MEMBER,
  },
  {
    name: 'Olivia Thomas',
    email: 'olivia.thomas@weeklyreport.local',
    role: RoleName.TEAM_MEMBER,
  },
  {
    name: 'Ethan Martinez',
    email: 'ethan.martinez@weeklyreport.local',
    role: RoleName.TEAM_MEMBER,
  },
  {
    name: 'Ava Jackson',
    email: 'ava.jackson@weeklyreport.local',
    role: RoleName.TEAM_MEMBER,
  },
  {
    name: 'James White',
    email: 'james.white@weeklyreport.local',
    role: RoleName.TEAM_MEMBER,
  },
  {
    name: 'Mia Harris',
    email: 'mia.harris@weeklyreport.local',
    role: RoleName.TEAM_MEMBER,
  },
] as const;

const projects: SeedProject[] = [
  {
    name: 'AI Operations Platform',
    description: 'Centralizes operational metrics, incident triage, and AI-assisted reporting.',
    status: ProjectStatus.ACTIVE,
  },
  {
    name: 'Digital Transformation 4001',
    description: 'Enterprise workflow modernization program for internal service teams.',
    status: ProjectStatus.ACTIVE,
  },
  {
    name: 'Customer Portal Revamp',
    description: 'Redesigns the customer portal with faster navigation and improved self-service.',
    status: ProjectStatus.ON_HOLD,
  },
  {
    name: 'HR Management System',
    description: 'Supports onboarding, leave tracking, and employee profile management.',
    status: ProjectStatus.ACTIVE,
  },
  {
    name: 'Mobile Banking App',
    description: 'Delivers secure banking features for retail customers and support teams.',
    status: ProjectStatus.ACTIVE,
  },
  {
    name: 'Inventory Management System',
    description: 'Tracks warehouse stock levels, replenishment, and fulfillment workflows.',
    status: ProjectStatus.ON_HOLD,
  },
  {
    name: 'CRM Enhancement',
    description: 'Improves sales workflows, activity tracking, and customer follow-up automation.',
    status: ProjectStatus.ACTIVE,
  },
  {
    name: 'Smart Analytics Dashboard',
    description: 'Provides executives with real-time KPIs and operational trend analysis.',
    status: ProjectStatus.ACTIVE,
  },
  {
    name: 'E-Commerce Platform',
    description: 'Supports catalog browsing, checkout flows, and order lifecycle management.',
    status: ProjectStatus.ARCHIVED,
    archivedAt: utcDate(2026, 2, 14),
  },
  {
    name: 'University Management System',
    description: 'Handles student records, course administration, and academic reporting.',
    status: ProjectStatus.ACTIVE,
  },
] as const;

const weekRanges: WeekRange[] = [
  {
    start: utcDate(2026, 6, 1),
    end: utcDate(2026, 6, 7),
  },
  {
    start: utcDate(2026, 6, 8),
    end: utcDate(2026, 6, 14),
  },
  {
    start: utcDate(2026, 6, 15),
    end: utcDate(2026, 6, 21),
  },
];

const completedTaskPool = [
  'Implemented JWT authentication',
  'Fixed dashboard APIs',
  'Added report validation',
  'Integrated Ollama AI',
  'Optimized Prisma queries',
  'Fixed authentication bugs',
  'Improved UI responsiveness',
  'Added project CRUD',
  'Refactored report module',
  'Added analytics endpoints',
  'Improved export handling',
  'Reviewed weekly audit logs',
] as const;

const plannedTaskPool = [
  'Finish dashboard',
  'Improve AI assistant',
  'Add PDF export',
  'Optimize queries',
  'Improve notifications',
  'Write unit tests',
  'Refactor frontend',
  'Add search filters',
  'Improve performance',
  'Harden validation rules',
  'Document integration flow',
  'Polish manager reports',
] as const;

const blockerPool = [
  'Waiting for API approval',
  'Database migration',
  'Client feedback pending',
  'Authentication issue',
  'Testing environment',
  'None',
] as const;

function pickTasks(pool: readonly string[], offset: number) {
  return [pool[offset % pool.length], pool[(offset + 1) % pool.length]].join('\n');
}

function buildReports(userNames: string[], projectNames: string[]) {
  const teamMemberIndexes = users
    .map((user, index) => ({ user, index }))
    .filter(({ user }) => user.role === RoleName.TEAM_MEMBER);

  return teamMemberIndexes.flatMap(({ user, index: userIndex }) => {
    return weekRanges.map((week, weekIndex) => {
      const projectName = projectNames[(userIndex + weekIndex) % projectNames.length];
      const hoursWorked = 20 + ((userIndex * 7 + weekIndex * 5) % 29);
      const status = (userIndex + weekIndex) % 3 === 0 ? ReportStatus.DRAFT : ReportStatus.SUBMITTED;
      const submittedAt =
        status === ReportStatus.SUBMITTED
          ? addDays(week.end, 1 + ((userIndex + weekIndex) % 3))
          : null;

      return {
        userName: user.name,
        projectName,
        week,
        status,
        hoursWorked,
        submittedAt,
        tasksCompleted: pickTasks(completedTaskPool, userIndex * 3 + weekIndex),
        tasksPlanned: pickTasks(plannedTaskPool, userIndex * 2 + weekIndex),
        blockers: blockerPool[(userIndex + weekIndex) % blockerPool.length],
      };
    });
  });
}

async function main() {
  console.log('Seeding database...');

  await prisma.$transaction(async (tx) => {
    await tx.refreshToken.deleteMany();
    await tx.weeklyReport.deleteMany();
    await tx.user.deleteMany();
    await tx.project.deleteMany();
    await tx.role.deleteMany();

    const roleRecords = await Promise.all(
      roles.map((role) => {
        return tx.role.upsert({
          where: { name: role.name },
          update: { description: role.description },
          create: {
            name: role.name,
            description: role.description,
          },
        });
      }),
    );

    const roleIdByName = new Map(roleRecords.map((role) => [role.name, role.id]));

    const createdUsers = await Promise.all(
      users.map(async (user) => {
        const roleId = roleIdByName.get(user.role);

        if (!roleId) {
          throw new Error(`Missing role record for ${user.role}`);
        }

        return tx.user.create({
          data: {
            name: user.name,
            email: user.email,
            passwordHash: await bcrypt.hash(SEED_PASSWORD, SALT_ROUNDS),
            roleId,
            isActive: true,
          },
        });
      }),
    );

    const createdProjects = await Promise.all(
      projects.map((project) => {
        return tx.project.create({
          data: {
            name: project.name,
            description: project.description,
            status: project.status,
            archivedAt: project.archivedAt ?? null,
          },
        });
      }),
    );

    const projectIdByName = new Map(createdProjects.map((project) => [project.name, project.id]));
    const reports = buildReports(
      createdUsers.map((user) => user.name),
      createdProjects.map((project) => project.name),
    );

    await tx.weeklyReport.createMany({
      data: reports.map((report) => {
        const projectId = projectIdByName.get(report.projectName);

        if (!projectId) {
          throw new Error(`Missing project record for ${report.projectName}`);
        }

        const userId = createdUsers.find((user) => user.name === report.userName)?.id;

        if (!userId) {
          throw new Error(`Missing user record for ${report.userName}`);
        }

        return {
          userId,
          projectId,
          weekStartDate: report.week.start,
          weekEndDate: report.week.end,
          tasksCompleted: report.tasksCompleted,
          tasksPlanned: report.tasksPlanned,
          blockers: report.blockers,
          hoursWorked: formatHours(report.hoursWorked),
          notes: report.status === ReportStatus.SUBMITTED ? 'Weekly status submitted on time.' : 'Draft prepared for review.',
          status: report.status,
          submittedAt: report.submittedAt,
        };
      }),
    });
  });

  console.log('Seed completed successfully.');
}

main()
  .catch((error: unknown) => {
    console.error('Seed failed.');
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });