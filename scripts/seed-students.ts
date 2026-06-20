// Seed script — populate demo students and progress entries
// Run with: bun run /home/z/my-project/scripts/seed-students.ts

import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const demoStudents = [
  {
    email: "alex.rivera@example.com",
    name: "Alex Rivera",
    password: "ppcdemo123",
    role: "STUDENT",
    status: "ACTIVE",
    cohort: "Spring 2026",
    currentPhase: 3,
    targetAcos: 30,
    notes: "Strong on metrics, working on campaign structure.",
    progress: [
      { phaseNumber: 1, exercisesDone: 3, exercisesTotal: 3, quizScore: 5, quizTotal: 5, capstoneDone: false },
      { phaseNumber: 2, exercisesDone: 4, exercisesTotal: 4, quizScore: 4, quizTotal: 5, capstoneDone: false },
      { phaseNumber: 3, exercisesDone: 1, exercisesTotal: 3, quizScore: null, quizTotal: 5, capstoneDone: false },
    ],
  },
  {
    email: "jamie.chen@example.com",
    name: "Jamie Chen",
    password: "ppcdemo123",
    role: "STUDENT",
    status: "ACTIVE",
    cohort: "Spring 2026",
    currentPhase: 2,
    targetAcos: 28,
    notes: "New to PPC. Needs extra help with match types.",
    progress: [
      { phaseNumber: 1, exercisesDone: 3, exercisesTotal: 3, quizScore: 4, quizTotal: 5, capstoneDone: false },
      { phaseNumber: 2, exercisesDone: 2, exercisesTotal: 4, quizScore: null, quizTotal: 5, capstoneDone: false },
    ],
  },
  {
    email: "sam.patel@example.com",
    name: "Sam Patel",
    password: "ppcdemo123",
    role: "STUDENT",
    status: "PAUSED",
    cohort: "Spring 2026",
    currentPhase: 1,
    targetAcos: 35,
    notes: "Paused for 2 weeks due to work travel.",
    progress: [
      { phaseNumber: 1, exercisesDone: 1, exercisesTotal: 3, quizScore: null, quizTotal: 5, capstoneDone: false },
    ],
  },
  {
    email: "taylor.morgan@example.com",
    name: "Taylor Morgan",
    password: "ppcdemo123",
    role: "STUDENT",
    status: "GRADUATED",
    cohort: "Winter 2025",
    currentPhase: 4,
    targetAcos: 32,
    notes: "Excellent capstone — defended an insulated water bottle strategy.",
    progress: [
      { phaseNumber: 1, exercisesDone: 3, exercisesTotal: 3, quizScore: 5, quizTotal: 5, capstoneDone: true },
      { phaseNumber: 2, exercisesDone: 4, exercisesTotal: 4, quizScore: 5, quizTotal: 5, capstoneDone: true },
      { phaseNumber: 3, exercisesDone: 3, exercisesTotal: 3, quizScore: 5, quizTotal: 5, capstoneDone: true },
      { phaseNumber: 4, exercisesDone: 1, exercisesTotal: 1, quizScore: 4, quizTotal: 4, capstoneDone: true },
    ],
  },
  {
    email: "instructor.kim@example.com",
    name: "Instructor Kim",
    password: "ppcdemo123",
    role: "INSTRUCTOR",
    status: "ACTIVE",
    cohort: null,
    currentPhase: 4,
    targetAcos: 30,
    notes: "Lead instructor for Spring 2026 cohort.",
    progress: [],
  },
  {
    email: "admin.jordan@example.com",
    name: "Jordan Lee",
    password: "ppcdemo123",
    role: "ADMIN",
    status: "ACTIVE",
    cohort: null,
    currentPhase: 4,
    targetAcos: 30,
    notes: "Program administrator.",
    progress: [],
  },
];

async function main() {
  console.log("Seeding students...");

  // Wipe existing (so re-running is idempotent for demo)
  await db.progressEntry.deleteMany();
  await db.student.deleteMany();

  for (const s of demoStudents) {
    const { progress, ...studentData } = s;
    const student = await db.student.create({
      data: {
        ...studentData,
        role: studentData.role as any,
        status: studentData.status as any,
        progress: progress
          ? {
              create: progress.map((p) => ({
                phaseNumber: p.phaseNumber,
                exercisesDone: p.exercisesDone,
                exercisesTotal: p.exercisesTotal,
                quizScore: p.quizScore,
                quizTotal: p.quizTotal,
                capstoneDone: p.capstoneDone,
              })),
            }
          : undefined,
      },
    });
    console.log(`  ✓ ${student.name} (${student.role.toLowerCase()}) — ${student.email} · password: ${studentData.password}`);
  }

  const count = await db.student.count();
  console.log(`\nDone. ${count} students in the database.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
