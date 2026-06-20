// ============================================================================
// Comprehensive seed script — populates the full robust schema
// Run: bun run /home/z/my-project/scripts/seed-full.ts
//
// Creates: Cohorts, Modules, Exercises, Quizzes, QuizQuestions, Tags,
//          Enrollments, and links existing students to cohorts.
// Idempotent: wipes and recreates everything except Student records.
// ============================================================================

import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

// ============================================================================
// Cohorts
// ============================================================================

const cohorts = [
  {
    name: "Spring 2026",
    description: "Spring 2026 cohort — currently in progress",
    startDate: new Date("2026-03-01"),
    endDate: new Date("2026-06-30"),
    status: "ACTIVE",
    maxStudents: 30,
  },
  {
    name: "Winter 2025",
    description: "Winter 2025 cohort — completed",
    startDate: new Date("2025-01-01"),
    endDate: new Date("2025-04-30"),
    status: "COMPLETED",
    maxStudents: 25,
  },
  {
    name: "Summer 2026",
    description: "Summer 2026 cohort — planned",
    startDate: new Date("2026-06-15"),
    endDate: new Date("2026-09-15"),
    status: "PLANNED",
    maxStudents: 40,
  },
];

// ============================================================================
// Modules + Exercises + Quizzes  (derived from course-data.ts)
// ============================================================================

const modules = [
  // Phase 1 — Foundations
  { code: "1.1", title: "How Amazon Works", phaseNumber: 1, order: 1, hasQuiz: false },
  { code: "1.2", title: "PPC Metrics Fundamentals", phaseNumber: 1, order: 2, hasQuiz: true, quizTitle: "Phase 1 Checkpoint" },
  // Phase 2 — Amazon Ads Deep Dive
  { code: "2.1", title: "Ad Types", phaseNumber: 2, order: 1, hasQuiz: false },
  { code: "2.2", title: "Targeting & Match Types", phaseNumber: 2, order: 2, hasQuiz: false },
  { code: "2.3", title: "2026 Strategy Principles", phaseNumber: 2, order: 3, hasQuiz: true, quizTitle: "Phase 2 Checkpoint" },
  // Phase 3 — Simulated Practice
  { code: "3.1", title: "Keyword Research", phaseNumber: 3, order: 1, hasQuiz: false },
  { code: "3.2", title: "Campaign Structure Design", phaseNumber: 3, order: 2, hasQuiz: false },
  { code: "3.3", title: "Optimization with Dummy Data", phaseNumber: 3, order: 3, hasQuiz: true, quizTitle: "Phase 3 Checkpoint" },
  // Phase 4 — Reporting & Capstone
  { code: "4.1", title: "Reporting", phaseNumber: 4, order: 1, hasQuiz: false },
  { code: "4.2", title: "Client Communication", phaseNumber: 4, order: 2, hasQuiz: false },
  { code: "4.3", title: "Capstone Project", phaseNumber: 4, order: 3, hasQuiz: true, quizTitle: "Phase 4 Checkpoint" },
];

const exercises = [
  { code: "1.1A", moduleCode: "1.1", title: "Identify Ads vs Organic", type: "OPEN", order: 1, prompt: "Go to Amazon and search for 'water bottle'. Find 3 results marked 'Sponsored' and 3 without that label. Note: (1) What differences do you see in placement and labels? (2) Which ones would you click and why?" },
  { code: "1.1B", moduleCode: "1.1", title: "Buy Box", type: "OPEN", order: 2, prompt: "Find a product with multiple sellers (on the same ASIN). (1) Who currently holds the Buy Box? (2) Why do you think they hold it? (Consider price, shipping, rating, Prime badge.)" },
  { code: "1.2A", moduleCode: "1.2", title: "Calculations", type: "CALCULATION", order: 1, prompt: "Calculate each metric using the given inputs." },
  { code: "2.1A", moduleCode: "2.1", title: "Headlines", type: "OPEN", order: 1, prompt: 'For "Organic Coffee Beans", write 3 potential Sponsored Brands headlines.' },
  { code: "2.2A", moduleCode: "2.2", title: "Broad Match Risks", type: "OPEN", order: 1, prompt: 'Keyword: "yoga mat" (Broad match). List 5 irrelevant or low-quality search terms that might show up.' },
  { code: "2.2B", moduleCode: "2.2", title: "ASIN Targeting Choice", type: "OPEN", order: 2, prompt: "Choose which competitors to target with product targeting ads." },
  { code: "2.3A", moduleCode: "2.3", title: "Voice-Friendly Copy", type: "OPEN", order: 1, prompt: 'Rewrite this bullet in a more natural, customer-friendly way.' },
  { code: "3.1A", moduleCode: "3.1", title: "Build a Keyword List", type: "OPEN", order: 1, prompt: "Choose ONE product category and find at least 50 keywords, grouped into Tier 1, Tier 2, Tier 3." },
  { code: "3.2A", moduleCode: "3.2", title: "Design a Structure", type: "OPEN", order: 1, prompt: "Design a campaign structure for 'Premium Yoga Mat — $45'." },
  { code: "3.3A", moduleCode: "3.3", title: "Analyze Search Terms", type: "DECISION", order: 1, prompt: "For each search term, decide: Keep, Negative, or Promote to Exact." },
  { code: "4.1A", moduleCode: "4.1", title: "Write a Report", type: "OPEN", order: 1, prompt: "Write a short weekly report email using your decisions from Exercise 3.3A." },
];

const quizQuestions = [
  // Phase 1 quiz (module 1.2)
  {
    moduleCode: "1.2",
    questions: [
      { type: "OPEN", question: "Describe the Amazon customer journey in your own words (3–4 sentences).", modelAnswer: "A customer searches Amazon by typing or using voice. Amazon returns a results page with a mix of sponsored ads and organic listings. The customer clicks a product, views the detail page, and if the offer is good adds to cart and purchases. After receiving the product, they may leave a review that influences future shoppers.", points: 1, order: 1 },
      { type: "OPEN", question: "What happens to Sponsored Products ads if the seller loses the Buy Box?", modelAnswer: "If the seller loses the Buy Box, their Sponsored Products ads usually will not show (or will not convert well) because Amazon will not promote an offer the customer cannot immediately purchase through the Buy Box.", points: 1, order: 2 },
      { type: "NUMERIC", question: "If ad spend is $800 and ad-attributed sales are $3,200, what is ACoS?", acceptableAnswers: "[\"25\", \"25%\", \"0.25\"]", explanation: "ACoS = Ad Spend / Ad Sales x 100 = 800 / 3200 x 100 = 25%.", points: 1, order: 3 },
      { type: "OPEN", question: "When can a high ACoS be acceptable?", modelAnswer: "A high ACoS (e.g. 30-50%) can be acceptable during the launch phase (first ~30 days) when the goal is data collection, ranking, and keyword discovery rather than immediate profit.", points: 1, order: 4 },
      { type: "OPEN", question: "What is the difference between ACoS and TACoS, and why is TACoS important?", modelAnswer: "ACoS = Ad Spend / Ad Sales — measures efficiency of ad spend against ad-attributed sales only. TACoS = Ad Spend / Total Revenue (ad + organic) — measures the impact of ads on the entire business. TACoS is important because successful ads grow organic ranking and organic sales, which dilutes ad spend as a share of total revenue.", points: 1, order: 5 },
    ],
  },
  // Phase 2 quiz (module 2.3)
  {
    moduleCode: "2.3",
    questions: [
      { type: "MCQ", question: "Which ad type requires Brand Registry and appears as a banner at the top of search results?", options: '[{"id":"a","label":"Sponsored Products"},{"id":"b","label":"Sponsored Brands","correct":true},{"id":"c","label":"Sponsored Display"},{"id":"d","label":"Sponsored TV"}]', explanation: "Sponsored Brands (and SB Video) require Brand Registry.", points: 1, order: 1 },
      { type: "MCQ", question: "Which match type should you use for proven, profitable 'hero' keywords?", options: '[{"id":"a","label":"Auto"},{"id":"b","label":"Broad"},{"id":"c","label":"Phrase"},{"id":"d","label":"Exact","correct":true}]', explanation: "Exact match gives maximum control over proven hero keywords.", points: 1, order: 2 },
      { type: "MCQ", question: "For untested keywords and new launches, which bid strategy is safest?", options: '[{"id":"a","label":"Dynamic – Up and Down"},{"id":"b","label":"Dynamic – Down Only","correct":true},{"id":"c","label":"Fixed Bids"}]', explanation: "'Dynamic – Down Only' protects budget on untested keywords.", points: 1, order: 3 },
      { type: "OPEN", question: "Why are negatives more important in 2026's Broad/Auto strategy?", modelAnswer: "CPCs are higher in 2026, so wasted spend on irrelevant search terms is more painful. Negatives are how you stop that waste while still harvesting winners.", points: 1, order: 4 },
      { type: "OPEN", question: "Rewrite this bullet in a voice-friendly, natural way.", modelAnswer: "This bottle is built to last. It's made of food-grade stainless steel with double-wall insulation, so it keeps your drinks cold for 24 hours and hot for 12.", points: 1, order: 5 },
    ],
  },
  // Phase 3 quiz (module 3.3)
  {
    moduleCode: "3.3",
    questions: [
      { type: "MCQ", question: "A search term has 12 clicks and 0 orders. What is the most likely action?", options: '[{"id":"a","label":"Increase bid 20%"},{"id":"b","label":"Promote to Exact"},{"id":"c","label":"Add as negative keyword","correct":true},{"id":"d","label":"Do nothing"}]', explanation: "10–15+ clicks with 0 orders is a strong negative candidate.", points: 1, order: 1 },
      { type: "MCQ", question: "A search term has 3+ orders and ACoS at or below target. What should you do?", options: '[{"id":"a","label":"Pause the keyword"},{"id":"b","label":"Promote to Exact (Hero campaign)","correct":true},{"id":"c","label":"Decrease bid 20%"},{"id":"d","label":"Add as negative"}]', explanation: "3+ orders at/below target ACoS = promote to Exact Hero campaign.", points: 1, order: 2 },
      { type: "MCQ", question: "Which budget split matches the four-layer structure?", options: '[{"id":"a","label":"Discovery 10% / Expansion 10% / Heroes 70% / Defense 10%"},{"id":"b","label":"Discovery 30% / Expansion 20% / Heroes 40% / Defense 10%","correct":true},{"id":"c","label":"Discovery 40% / Expansion 30% / Heroes 20% / Defense 10%"}]', explanation: "Recommended split: Discovery ~30%, Expansion ~20%, Heroes ~40%, Defense ~10%.", points: 1, order: 3 },
      { type: "OPEN", question: "Name the three free (or free-tier) keyword research tools recommended in Module 3.1.", modelAnswer: "Helium 10 Magnet (free tier), Amazon Autocomplete (search bar suggestions), and competitor listings (titles, bullets, A+ content).", points: 1, order: 4 },
      { type: "OPEN", question: "Explain the difference between Tier 1, Tier 2, and Tier 3 keywords.", modelAnswer: "Tier 1 = Hero keywords (high volume, high intent, very relevant). Tier 2 = Discovery/long-tail (specific, lower volume, experimental). Tier 3 = Competitor/ASIN-based (brand names, product names, ASINs).", points: 1, order: 5 },
    ],
  },
  // Phase 4 quiz (module 4.3)
  {
    moduleCode: "4.3",
    questions: [
      { type: "MCQ", question: "Which is NOT a required section of the weekly report?", options: '[{"id":"a","label":"Executive Summary"},{"id":"b","label":"Wins"},{"id":"c","label":"Issues"},{"id":"d","label":"Competitor P&L","correct":true}]', explanation: "The 5 sections are: Executive Summary, Wins, Issues, Actions Taken, Next Steps & Requests.", points: 1, order: 1 },
      { type: "MCQ", question: "A client says 'ACoS is 45%, turn off the ads!' — what's the first thing you should do?", options: '[{"id":"a","label":"Immediately pause all campaigns"},{"id":"b","label":"Acknowledge the concern, then ask about margin & target ACoS","correct":true},{"id":"c","label":"Argue that 45% is fine"},{"id":"d","label":"Cut all bids by 50%"}]', explanation: "Acknowledge the concern, then ask about their margin and target ACoS to contextualize whether 45% is actually a problem.", points: 1, order: 2 },
      { type: "OPEN", question: "List the 5 capstone deliverables.", modelAnswer: "1) Keyword Research File (50-100 keywords in Tier 1/2/3). 2) Campaign Blueprint (Discovery, Expansion, Heroes, Defense). 3) 30-Day Launch Plan (week-by-week). 4) Optimization Report (using dummy data). 5) 5-10 minute presentation.", points: 1, order: 3 },
      { type: "OPEN", question: "Why is TACoS often a better long-term metric than ACoS for a growing product?", modelAnswer: "TACoS accounts for organic sales too. As ads lift organic ranking, organic sales grow, so ad spend becomes a smaller share of total revenue. A product can have a stable (or even rising) ACoS while TACoS falls — that signals healthy scaling and strong long-term unit economics.", points: 1, order: 4 },
    ],
  },
];

// ============================================================================
// Tags
// ============================================================================

const tags = [
  { name: "Fast learner", color: "emerald", description: "Quickly grasps new concepts" },
  { name: "Needs help", color: "rose", description: "Struggling with current phase material" },
  { name: "Capstone-ready", color: "violet", description: "Ready to start capstone project" },
  { name: "Top performer", color: "amber", description: "Consistently high quiz scores" },
  { name: "New to PPC", color: "blue", description: "No prior PPC experience" },
  { name: "Returning student", color: "teal", description: "Has taken other courses before" },
];

async function main() {
  console.log("Seeding full schema...");

  // Wipe everything except students AND their progress entries
  // (progress entries are created by seed-students.ts and should be preserved)
  console.log("  Clearing old data...");
  await db.auditLog.deleteMany();
  await db.sessionLog.deleteMany();
  await db.studentTag.deleteMany();
  await db.tag.deleteMany();
  await db.comment.deleteMany();
  await db.notification.deleteMany();
  await db.capstoneProject.deleteMany();
  await db.quizAttempt.deleteMany();
  await db.exerciseSubmission.deleteMany();
  await db.quizQuestion.deleteMany();
  await db.quiz.deleteMany();
  await db.exercise.deleteMany();
  await db.module.deleteMany();
  // NOTE: progressEntry is NOT deleted — preserved from seed-students.ts
  await db.enrollment.deleteMany();
  await db.cohort.deleteMany();

  // ----------------------------------------------------------------
  // Cohorts
  // ----------------------------------------------------------------
  console.log("  Creating cohorts...");
  const instructor = await db.student.findFirst({ where: { role: "INSTRUCTOR" } });
  const cohortMap: Record<string, any> = {};
  for (const c of cohorts) {
    const created = await db.cohort.create({
      data: {
        ...c,
        status: c.status as any,
        instructorId: instructor?.id ?? null,
      },
    });
    cohortMap[c.name] = created;
    console.log(`    ✓ Cohort: ${created.name} (${created.status.toLowerCase()})`);
  }

  // ----------------------------------------------------------------
  // Enrollments — link existing students to their cohorts
  // ----------------------------------------------------------------
  console.log("  Creating enrollments...");
  const springCohort = cohortMap["Spring 2026"];
  const winterCohort = cohortMap["Winter 2025"];
  const students = await db.student.findMany({ where: { role: "STUDENT" } });

  for (const s of students) {
    let cohortId: string | null = null;
    let status: "ENROLLED" | "COMPLETED" = "ENROLLED";
    let completedAt: Date | null = null;

    if (s.cohort === "Spring 2026") {
      cohortId = springCohort.id;
    } else if (s.cohort === "Winter 2025") {
      cohortId = winterCohort.id;
      status = "COMPLETED";
      completedAt = new Date("2025-04-30");
    }

    if (cohortId) {
      await db.enrollment.create({
        data: { studentId: s.id, cohortId, status: status as any, completedAt },
      });
      console.log(`    ✓ Enrolled ${s.name} → ${s.cohort}`);
    }
  }

  // ----------------------------------------------------------------
  // Modules + Exercises + Quizzes
  // ----------------------------------------------------------------
  console.log("  Creating modules...");
  const moduleMap: Record<string, any> = {};
  for (const m of modules) {
    const created = await db.module.create({
      data: {
        code: m.code,
        title: m.title,
        phaseNumber: m.phaseNumber,
        order: m.order,
        isPublished: true,
      },
    });
    moduleMap[m.code] = created;
    console.log(`    ✓ Module: ${m.code} · ${m.title}`);
  }

  console.log("  Creating exercises...");
  for (const ex of exercises) {
    const mod = moduleMap[ex.moduleCode];
    if (!mod) continue;
    await db.exercise.create({
      data: {
        moduleId: mod.id,
        code: ex.code,
        title: ex.title,
        prompt: ex.prompt,
        type: ex.type as any,
        order: ex.order,
      },
    });
    console.log(`    ✓ Exercise: ${ex.code} · ${ex.title}`);
  }

  console.log("  Creating quizzes + questions...");
  for (const q of quizQuestions) {
    const mod = moduleMap[q.moduleCode];
    if (!mod) continue;
    const quiz = await db.quiz.create({
      data: {
        moduleId: mod.id,
        title: `${mod.code} Checkpoint`,
        passingScore: 60,
      },
    });
    for (const question of q.questions) {
      await db.quizQuestion.create({
        data: {
          quizId: quiz.id,
          question: question.question,
          type: question.type as any,
          options: question.options ?? null,
          modelAnswer: question.modelAnswer ?? null,
          explanation: question.explanation ?? null,
          points: question.points,
          order: question.order,
        },
      });
    }
    console.log(`    ✓ Quiz for module ${q.moduleCode} (${q.questions.length} questions)`);
  }

  // ----------------------------------------------------------------
  // Tags
  // ----------------------------------------------------------------
  console.log("  Creating tags...");
  const tagMap: Record<string, any> = {};
  for (const t of tags) {
    const created = await db.tag.create({ data: t });
    tagMap[t.name] = created;
    console.log(`    ✓ Tag: ${t.name}`);
  }

  // ----------------------------------------------------------------
  // Assign some tags to students
  // ----------------------------------------------------------------
  console.log("  Assigning tags...");
  const alex = students.find((s) => s.email === "alex.rivera@example.com");
  const jamie = students.find((s) => s.email === "jamie.chen@example.com");
  const taylor = students.find((s) => s.email === "taylor.morgan@example.com");

  if (alex) {
    await db.studentTag.create({ data: { studentId: alex.id, tagId: tagMap["Fast learner"].id, assignedBy: instructor?.id } });
    await db.studentTag.create({ data: { studentId: alex.id, tagId: tagMap["Top performer"].id, assignedBy: instructor?.id } });
    console.log(`    ✓ Alex Rivera: Fast learner, Top performer`);
  }
  if (jamie) {
    await db.studentTag.create({ data: { studentId: jamie.id, tagId: tagMap["New to PPC"].id, assignedBy: instructor?.id } });
    await db.studentTag.create({ data: { studentId: jamie.id, tagId: tagMap["Needs help"].id, assignedBy: instructor?.id } });
    console.log(`    ✓ Jamie Chen: New to PPC, Needs help`);
  }
  if (taylor) {
    await db.studentTag.create({ data: { studentId: taylor.id, tagId: tagMap["Capstone-ready"].id, assignedBy: instructor?.id } });
    await db.studentTag.create({ data: { studentId: taylor.id, tagId: tagMap["Returning student"].id, assignedBy: instructor?.id } });
    console.log(`    ✓ Taylor Morgan: Capstone-ready, Returning student`);
  }

  // ----------------------------------------------------------------
  // Notifications — welcome messages
  // ----------------------------------------------------------------
  console.log("  Creating notifications...");
  for (const s of students) {
    await db.notification.create({
      data: {
        studentId: s.id,
        type: "INFO",
        title: "Welcome to the program!",
        message: `Hi ${s.name.split(" ")[0]}, welcome to the Amazon PPC Manager Training Program. Start with Phase 1 if you haven't already.`,
        link: "/curriculum",
      },
    });
  }
  console.log(`    ✓ Created welcome notifications for ${students.length} students`);

  // ----------------------------------------------------------------
  // Audit log — record this seed operation
  // ----------------------------------------------------------------
  await db.auditLog.create({
    data: {
      actorId: instructor?.id ?? null,
      action: "CREATE",
      entityType: "system",
      entityId: "seed",
      summary: "Database seeded with cohorts, modules, exercises, quizzes, and tags",
    },
  });

  // Summary
  const counts = {
    cohorts: await db.cohort.count(),
    enrollments: await db.enrollment.count(),
    modules: await db.module.count(),
    exercises: await db.exercise.count(),
    quizzes: await db.quiz.count(),
    quizQuestions: await db.quizQuestion.count(),
    tags: await db.tag.count(),
    studentTags: await db.studentTag.count(),
    notifications: await db.notification.count(),
    auditLogs: await db.auditLog.count(),
    students: await db.student.count(),
  };

  console.log("\n✅ Seed complete. Final counts:");
  Object.entries(counts).forEach(([k, v]) => console.log(`   ${k.padEnd(15)} ${v}`));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
