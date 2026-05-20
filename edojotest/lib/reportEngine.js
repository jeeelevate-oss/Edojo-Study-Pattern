// Pure JS report engine — no Claude credits needed

const SCORE = { a: 4, b: 3, c: 2, d: 1 };

function score(ans) { return SCORE[ans] ?? 0; }

export function generateReport(data) {
  const { name, class: cls, school, city, answers } = data;
  const A = answers; // shorthand

  // ── Learning Style ──────────────────────────────────────────
  const sectionA = ["A1","A2","A3","A4","A5","A6","A7","A8"].map(k => A[k]);
  const counts = { a:0, b:0, c:0, d:0 };
  sectionA.forEach(v => { if (v) counts[v]++; });
  const maxCount = Math.max(...Object.values(counts));
  const dominant = Object.keys(counts).filter(k => counts[k] === maxCount);
  const styleMap = { a: "Structured Learner", b: "Visual Learner", c: "Collaborative Learner", d: "Experiential Learner" };
  const learningStyle = dominant.length > 1 ? "Adaptive Learner" : styleMap[dominant[0]];

  const styleDesc = {
    "Structured Learner": `${name} thrives with clear systems, organized notes, and a predictable study routine. Step-by-step explanations work best for them. Unstructured or fast-paced classroom sessions likely cause them to fall behind silently, even when they're paying full attention.`,
    "Visual Learner": `${name} processes information most effectively through diagrams, charts, and visual summaries. Pure text-based study — which is how most CBSE teaching happens — works against their natural strengths. They likely understand something much better after seeing it drawn or demonstrated.`,
    "Collaborative Learner": `${name} learns best through discussion, explanation, and interaction. Sitting and reading alone is the least effective study method for them. The traditional classroom and solo homework model doesn't give them the verbal processing they need to truly consolidate concepts.`,
    "Experiential Learner": `${name} connects with learning through doing — real problems, experiments, and hands-on application. Abstract explanations without context tend to lose them quickly. They need to see the "so what" of every concept before it sticks.`,
    "Adaptive Learner": `${name} doesn't fit neatly into one learning box — and that's actually a strength. They can adjust to different teaching styles and situations. The risk, however, is that without a structured system tailored to them, they tend to follow the pace set by school rather than building their own momentum. They learn best when someone explains the why behind a concept, not just the what.`,
  };

  // ── Habit Index ──────────────────────────────────────────────
  const habitScore = ["B1","B2","B3","B4","B5","B6","B7","B8"].reduce((s,k) => s + score(A[k]), 0);
  const habitCategory =
    habitScore >= 26 ? "Disciplined Learner" :
    habitScore >= 18 ? "Inconsistent Learner" :
    habitScore >= 10 ? "Reactive Learner" : "Critical Intervention Needed";

  const habitDescriptions = {
    "Disciplined Learner": `${name} shows strong, consistent academic habits. They revise regularly, plan their study sessions, and check their own understanding. The system is largely in place — what's needed is fine-tuning and challenge, not rebuilding.`,
    "Inconsistent Learner": `${name} shows strong intent but uneven follow-through. Some days the system works; others it doesn't. They likely study well before tests but don't maintain that consistency in between. New concepts are being built on a foundation that hasn't had time to settle.`,
    "Reactive Learner": `${name}'s study pattern is largely reactive — responding to deadlines rather than building proactively. This means they are always slightly behind where they could be, and exam season becomes a crisis instead of a confidence moment.`,
    "Critical Intervention Needed": `${name}'s academic habits currently lack the structure needed for consistent progress. This is not about motivation or intelligence — it is about the absence of a working system. Without a system, even a hardworking student will keep falling short.`,
  };

  // ── Subject Confidence ───────────────────────────────────────
  const subjects = ["Maths","Science","English","SST","Hindi"];
  const ratings = {};
  subjects.forEach(s => { ratings[s] = parseInt(A[`C1_${s}`]) || 3; });

  const red    = subjects.filter(s => ratings[s] <= 2);
  const yellow = subjects.filter(s => ratings[s] === 3);
  const green  = subjects.filter(s => ratings[s] >= 4);
  const weakest = subjects.reduce((a,b) => ratings[a] <= ratings[b] ? a : b);

  const c2Desc = {
    a: `understands mistakes immediately once they see the solution — but crucially, they don't catch them independently during the exam. This is the gap between concept exposure and concept mastery.`,
    b: `needs step-by-step explanation to understand a mistake, suggesting the concept hasn't been internalised yet. One-to-one explanation is the only thing that works here.`,
    c: `often remains confused even after explanation — which points to a deeper foundational gap that needs to be traced back and rebuilt, not just reviewed.`,
    d: `tends to give up trying to understand mistakes, which is a sign that repeated failure in this subject has started to erode confidence and persistence.`,
  };

  // ── Flags ────────────────────────────────────────────────────
  const flags = [];

  if (["c","d"].includes(A.D3)) flags.push({
    name: "Learned Helplessness",
    severity: "red",
    body: `When ${name} faces a difficult problem, their instinct — based on D3 — is to briefly try and then move on or give up, rather than persist independently. This isn't laziness. It is a pattern that develops when a student has faced repeated situations where trying harder didn't lead to success, so the brain quietly learns to protect itself by not trying. In Class ${cls}, this becomes dangerous because the syllabus demands independent problem-solving — especially in Maths and Science.`,
    fix: "This is fixable with consistent, small wins built into every session."
  });

  if (["b","c"].includes(A.D6)) flags.push({
    name: "Comprehension Gap",
    severity: "amber",
    body: `${name}'s D6 response indicates they sometimes move forward in class without fully understanding a concept — not because they're careless, but because the pace doesn't allow for questions. This is extremely common in large Delhi school classes. Small gaps in comprehension quietly stack up over weeks, and by exam time, what felt like a minor confusion has become a wall.`,
    fix: "This is fixable with a space where it's safe and normal to stop and ask."
  });

  if (["c","d"].includes(A.D7)) flags.push({
    name: "Zero Verification",
    severity: "red",
    body: `${name}'s D7 response reveals they don't actively verify whether they've understood a topic after studying it — they either re-read and assume understanding, or move straight on. This means they can spend hours studying and still walk into an exam without knowing whether they're actually prepared. The feeling of "I studied but it didn't help" is almost always caused by this pattern.`,
    fix: "This is the single most impactful habit to change — and it's entirely fixable."
  });

  if (["c","d"].includes(A.C6)) flags.push({
    name: "Foundation Gap",
    severity: "amber",
    body: `${name}'s C6 response suggests that some of their current struggles trace back to concepts from earlier classes that were never fully solidified. Class ${cls} assumes comfort with prior foundations — and when those aren't firmly in place, even sincere effort this year produces limited results because the building blocks are shaky. This is not a reflection of ${name}'s ability; it is a reflection of a system that moved forward without checking what was actually learned.`,
    fix: "This is fixable — the gaps are usually narrower than they feel."
  });

  if (["c","d"].includes(A.D4)) flags.push({
    name: "Home Pressure",
    severity: "amber",
    body: `${name}'s responses indicate a significant amount of academic pressure at home. While this often comes from care and genuine concern, high home pressure can narrow a student's focus from learning to just not failing — which is a very different mindset. Students under high home pressure often avoid asking for help because they don't want to disappoint, making gaps harder to catch early.`,
    fix: "This is manageable — structure reduces pressure more effectively than expectations do."
  });

  if (["c","d"].includes(A.D5)) flags.push({
    name: "Confidence Erosion",
    severity: "red",
    body: `${name}'s D5 response reveals that confidence drops significantly before exams — not because they haven't studied, but because they aren't sure whether what they studied was the right thing. When a student can't look at their preparation and say "I'm ready," performance on exam day is unpredictable regardless of hours put in. This gap between effort and confidence is one of the most important things to close before the next academic year.`,
    fix: "This is fixable — confidence follows verified preparation, not just time spent."
  });

  // Always add Zero Verification if not already there and D7 is b (re-read only)
  if (A.D7 === "b" && !flags.find(f => f.name === "Zero Verification")) {
    flags.push({
      name: "Passive Verification",
      severity: "amber",
      body: `${name} currently checks understanding by re-reading notes and feeling satisfied — but this is one of the least reliable ways to confirm learning. Re-reading creates a feeling of familiarity, not mastery. The brain recognises the words but hasn't tested whether it can reproduce them. This is why students are often surprised by questions they feel they "studied."`,
      fix: "This is fixable with one simple habit change introduced the right way."
    });
  }

  // Ensure at least 2 flags
  if (flags.length < 2 && !flags.find(f => f.name === "Zero Verification")) {
    flags.push({
      name: "Zero Verification",
      severity: "amber",
      body: `Most students across all confidence levels share one silent gap: they don't actively test whether they've understood a topic after studying it. ${name}'s study pattern shows this tendency — moving forward after reading without confirming the understanding is solid. This is the difference between feeling prepared and being prepared.`,
      fix: "This is fixable — and when corrected, it changes exam results fast."
    });
  }

  // ── What this means ──────────────────────────────────────────
  const lowestSubject = weakest;
  const highestSubject = subjects.reduce((a,b) => ratings[a] >= ratings[b] ? a : b);

  const summaryBody = `If you've noticed that ${name} puts in effort but results don't always match — this profile explains exactly why. It is not about intelligence. It is not about attitude. ${name}'s ${highestSubject} score of ${ratings[highestSubject]}/5 makes that clear: they are fully capable of genuine mastery when the conditions match their learning style. The core issue is that the current system doesn't verify whether learning has actually happened. ${name} is moving forward, but without enough checkpoints. Their ${habitCategory} habit profile (${habitScore}/32) shows the raw material is there — the structure just needs to be shaped around them properly. Students with this exact profile typically show visible improvement within 6–8 weeks with the right one-on-one support.`;

  return {
    name, class: cls, school, city,
    date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }),
    learningStyle,
    styleDescription: styleDesc[learningStyle],
    habitScore,
    habitCategory,
    habitDescription: habitDescriptions[habitCategory],
    subjects: ratings,
    red, yellow, green,
    weakest,
    c2Finding: c2Desc[A.C2] || c2Desc.a,
    flags: flags.slice(0, 5),
    summaryBody,
  };
}
