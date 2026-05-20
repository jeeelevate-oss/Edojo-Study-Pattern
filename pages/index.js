import { useState } from "react";
import { sections } from "../lib/questions";
import Head from "next/head";

const TEAL = "#1D9E75";
const TEAL_DARK = "#085041";
const TEAL_LIGHT = "#E1F5EE";

export default function Home() {
  const [step, setStep] = useState("intro"); // intro | form | done
  const [sectionIdx, setSectionIdx] = useState(0);
  const [questionIdx, setQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [profile, setProfile] = useState({ name: "", class: "", school: "", city: "" });
  const [profileErrors, setProfileErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [fadeIn, setFadeIn] = useState(true);

  const currentSection = sections[sectionIdx];
  const currentQuestion = currentSection?.questions[questionIdx];
  const totalQuestions = sections.reduce((s, sec) => s + sec.questions.length, 0);
  const answeredCount = Object.keys(answers).filter(k => answers[k] !== undefined).length;

  function transition(fn) {
    setFadeIn(false);
    setTimeout(() => { fn(); setFadeIn(true); }, 200);
  }

  function handleProfileChange(e) {
    setProfile(p => ({ ...p, [e.target.name]: e.target.value }));
    setProfileErrors(er => ({ ...er, [e.target.name]: "" }));
  }

  function startForm() {
    const errors = {};
    if (!profile.name.trim()) errors.name = "Please enter the student's name";
    if (!profile.class.trim()) errors.class = "Please select a class";
    if (Object.keys(errors).length) { setProfileErrors(errors); return; }
    transition(() => setStep("form"));
  }

  function handleAnswer(qid, value) {
    setAnswers(a => ({ ...a, [qid]: value }));
    setTimeout(() => advance(qid, value), 350);
  }

  function handleRating(subject, value) {
    setAnswers(a => ({ ...a, [`C1_${subject}`]: value }));
  }

  function allRatingsDone() {
    const q = currentQuestion;
    if (q?.type !== "rating") return true;
    return q.subjects.every(s => answers[`C1_${s}`]);
  }

  function advance(qid, value) {
    const nextQIdx = questionIdx + 1;
    if (nextQIdx < currentSection.questions.length) {
      transition(() => setQuestionIdx(nextQIdx));
    } else {
      const nextSec = sectionIdx + 1;
      if (nextSec < sections.length) {
        transition(() => { setSectionIdx(nextSec); setQuestionIdx(0); });
      } else {
        handleSubmit({ ...answers, [qid]: value });
      }
    }
  }

  function advanceRating() {
    const nextQIdx = questionIdx + 1;
    if (nextQIdx < currentSection.questions.length) {
      transition(() => setQuestionIdx(nextQIdx));
    } else {
      const nextSec = sectionIdx + 1;
      if (nextSec < sections.length) {
        transition(() => { setSectionIdx(nextSec); setQuestionIdx(0); });
      } else {
        handleSubmit(answers);
      }
    }
  }

  async function handleSubmit(finalAnswers) {
    setSubmitting(true);
    try {
      await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profile.name,
          class: profile.class,
          school: profile.school,
          city: profile.city,
          answers: finalAnswers,
        }),
      });
    } catch (e) { console.error(e); }
    setSubmitting(false);
    transition(() => setStep("done"));
  }

  const progressPct = step === "form"
    ? Math.round((answeredCount / totalQuestions) * 100)
    : step === "done" ? 100 : 0;

  return (
    <>
      <Head>
        <title>Edojo Learning — Student Profile Test</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
      </Head>

      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Inter', sans-serif; background: #F4F3EF; min-height: 100vh; color: #1A1A18; }
        .fade { transition: opacity 0.2s ease; }
        .fade-in { opacity: 1; }
        .fade-out { opacity: 0; }
        input, select { font-family: 'Inter', sans-serif; }
        ::selection { background: ${TEAL_LIGHT}; }
      `}</style>

      {/* Top progress bar */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: 3, background: "#E0DED8", zIndex: 100 }}>
        <div style={{ height: "100%", width: `${progressPct}%`, background: TEAL, transition: "width 0.4s ease", borderRadius: "0 2px 2px 0" }} />
      </div>

      {/* Header */}
      <div style={{ background: TEAL_DARK, padding: "14px 20px", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 32, height: 32, background: TEAL, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ color: "white", fontWeight: 700, fontSize: 14 }}>E</span>
        </div>
        <div>
          <div style={{ color: "white", fontWeight: 600, fontSize: 14, lineHeight: 1.2 }}>Edojo Learning</div>
          <div style={{ color: "#9FE1CB", fontSize: 11 }}>Student Profile Test</div>
        </div>
      </div>

      <div style={{ maxWidth: 600, margin: "0 auto", padding: "32px 20px 80px" }}>

        {/* ── INTRO ── */}
        {step === "intro" && (
          <div className={`fade ${fadeIn ? "fade-in" : "fade-out"}`}>
            <div style={{ textAlign: "center", marginBottom: 36 }}>
              <div style={{ width: 64, height: 64, background: TEAL_LIGHT, borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                <span style={{ fontSize: 30 }}>📋</span>
              </div>
              <h1 style={{ fontSize: 26, fontWeight: 600, marginBottom: 10, color: "#0A0A08" }}>Student Profile Test</h1>
              <p style={{ fontSize: 15, color: "#5F5E5A", lineHeight: 1.6, maxWidth: 440, margin: "0 auto" }}>
                This 10-minute test helps us understand exactly how you learn best, so we can build the right plan for you.
              </p>
            </div>

            {/* Info cards */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 32 }}>
              {[
                ["📚", "30 questions", "Across 4 sections"],
                ["⏱", "~10 minutes", "No right or wrong answers"],
                ["🔒", "Private", "Only seen by Edojo team"],
                ["📊", "Personalised", "Report just for you"],
              ].map(([icon, title, sub]) => (
                <div key={title} style={{ background: "white", borderRadius: 12, padding: "14px 16px", border: "1px solid #E8E6E0" }}>
                  <div style={{ fontSize: 22, marginBottom: 6 }}>{icon}</div>
                  <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>{title}</div>
                  <div style={{ fontSize: 12, color: "#888780" }}>{sub}</div>
                </div>
              ))}
            </div>

            {/* Profile form */}
            <div style={{ background: "white", borderRadius: 16, padding: "24px", border: "1px solid #E8E6E0", marginBottom: 24 }}>
              <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>Tell us about yourself</h2>
              <div style={{ display: "grid", gap: 16 }}>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 500, color: "#444", display: "block", marginBottom: 6 }}>Student's Full Name *</label>
                  <input
                    name="name" value={profile.name} onChange={handleProfileChange}
                    placeholder="e.g. Aryan Sharma"
                    style={{ width: "100%", padding: "10px 14px", border: `1.5px solid ${profileErrors.name ? "#E24B4A" : "#D3D1C7"}`, borderRadius: 10, fontSize: 15, outline: "none" }}
                  />
                  {profileErrors.name && <div style={{ color: "#A32D2D", fontSize: 12, marginTop: 4 }}>{profileErrors.name}</div>}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 500, color: "#444", display: "block", marginBottom: 6 }}>Class *</label>
                    <select
                      name="class" value={profile.class} onChange={handleProfileChange}
                      style={{ width: "100%", padding: "10px 14px", border: `1.5px solid ${profileErrors.class ? "#E24B4A" : "#D3D1C7"}`, borderRadius: 10, fontSize: 15, outline: "none", background: "white", appearance: "none" }}
                    >
                      <option value="">Select</option>
                      {[6,7,8,9,10].map(c => <option key={c} value={c}>{c}th</option>)}
                    </select>
                    {profileErrors.class && <div style={{ color: "#A32D2D", fontSize: 12, marginTop: 4 }}>{profileErrors.class}</div>}
                  </div>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 500, color: "#444", display: "block", marginBottom: 6 }}>City</label>
                    <input name="city" value={profile.city} onChange={handleProfileChange} placeholder="e.g. Delhi" style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #D3D1C7", borderRadius: 10, fontSize: 15, outline: "none" }} />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 500, color: "#444", display: "block", marginBottom: 6 }}>School Name</label>
                  <input name="school" value={profile.school} onChange={handleProfileChange} placeholder="e.g. DPS RK Puram" style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #D3D1C7", borderRadius: 10, fontSize: 15, outline: "none" }} />
                </div>
              </div>
            </div>

            <button onClick={startForm} style={{ width: "100%", background: TEAL_DARK, color: "white", border: "none", borderRadius: 12, padding: "16px", fontSize: 16, fontWeight: 600, cursor: "pointer", fontFamily: "Inter, sans-serif" }}>
              Start the Test →
            </button>
          </div>
        )}

        {/* ── FORM ── */}
        {step === "form" && currentQuestion && (
          <div className={`fade ${fadeIn ? "fade-in" : "fade-out"}`}>

            {/* Section header */}
            <div style={{ background: currentSection.lightColor, borderRadius: 12, padding: "14px 18px", marginBottom: 28, display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 36, height: 36, background: currentSection.color, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ color: "white", fontWeight: 700, fontSize: 16 }}>{currentSection.id}</span>
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 15, color: TEAL_DARK }}>{currentSection.title}</div>
                <div style={{ fontSize: 12, color: "#5F5E5A" }}>Question {questionIdx + 1} of {currentSection.questions.length}</div>
              </div>
            </div>

            {/* Question */}
            <h2 style={{ fontSize: 20, fontWeight: 600, lineHeight: 1.4, marginBottom: 24, color: "#0A0A08" }}>
              {currentQuestion.text}
            </h2>

            {/* Rating type */}
            {currentQuestion.type === "rating" ? (
              <div>
                {currentQuestion.subjects.map(subject => (
                  <div key={subject} style={{ background: "white", borderRadius: 12, padding: "16px 18px", marginBottom: 12, border: "1px solid #E8E6E0" }}>
                    <div style={{ fontWeight: 500, marginBottom: 12, fontSize: 15 }}>{subject}</div>
                    <div style={{ display: "flex", gap: 8 }}>
                      {[1,2,3,4,5].map(n => {
                        const sel = parseInt(answers[`C1_${subject}`]) === n;
                        const color = n <= 2 ? "#E24B4A" : n === 3 ? "#BA7517" : "#1D9E75";
                        return (
                          <button key={n} onClick={() => handleRating(subject, n)}
                            style={{ flex: 1, padding: "10px 4px", border: `2px solid ${sel ? color : "#D3D1C7"}`, borderRadius: 8, background: sel ? color : "white", color: sel ? "white" : "#444", fontWeight: 600, fontSize: 15, cursor: "pointer", transition: "all 0.15s", fontFamily: "Inter, sans-serif" }}>
                            {n}
                          </button>
                        );
                      })}
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                      <span style={{ fontSize: 11, color: "#A32D2D" }}>Not confident</span>
                      <span style={{ fontSize: 11, color: "#0F6E56" }}>Very confident</span>
                    </div>
                  </div>
                ))}
                <button onClick={advanceRating} disabled={!allRatingsDone()}
                  style={{ width: "100%", marginTop: 8, background: allRatingsDone() ? TEAL_DARK : "#D3D1C7", color: "white", border: "none", borderRadius: 12, padding: "15px", fontSize: 15, fontWeight: 600, cursor: allRatingsDone() ? "pointer" : "not-allowed", fontFamily: "Inter, sans-serif", transition: "background 0.2s" }}>
                  Continue →
                </button>
              </div>
            ) : (
              /* MCQ */
              <div style={{ display: "grid", gap: 10 }}>
                {currentQuestion.options.map(opt => {
                  const sel = answers[currentQuestion.id] === opt.value;
                  return (
                    <button key={opt.value} onClick={() => handleAnswer(currentQuestion.id, opt.value)}
                      style={{ width: "100%", textAlign: "left", padding: "16px 18px", background: sel ? TEAL_LIGHT : "white", border: `2px solid ${sel ? TEAL : "#E8E6E0"}`, borderRadius: 12, cursor: "pointer", display: "flex", alignItems: "flex-start", gap: 12, transition: "all 0.15s", fontFamily: "Inter, sans-serif" }}>
                      <div style={{ width: 26, height: 26, borderRadius: "50%", background: sel ? TEAL : "#F1EFE8", border: `2px solid ${sel ? TEAL : "#D3D1C7"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: sel ? "white" : "#888780" }}>{opt.value.toUpperCase()}</span>
                      </div>
                      <span style={{ fontSize: 14, lineHeight: 1.5, color: sel ? TEAL_DARK : "#2C2C2A", fontWeight: sel ? 500 : 400 }}>{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Submitting state */}
        {submitting && (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>⏳</div>
            <div style={{ fontSize: 18, fontWeight: 600, color: TEAL_DARK }}>Saving your responses...</div>
          </div>
        )}

        {/* ── DONE ── */}
        {step === "done" && (
          <div className={`fade ${fadeIn ? "fade-in" : "fade-out"}`} style={{ textAlign: "center", paddingTop: 40 }}>
            <div style={{ width: 80, height: 80, background: TEAL_LIGHT, borderRadius: 24, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", fontSize: 40 }}>✅</div>
            <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 12, color: "#0A0A08" }}>Thank you, {profile.name}!</h1>
            <p style={{ fontSize: 16, color: "#5F5E5A", lineHeight: 1.7, maxWidth: 420, margin: "0 auto 32px" }}>
              Your responses have been recorded. Our Academic Counsellor will review your profile and reach out within <strong>24 hours</strong> with a personalised plan.
            </p>
            <div style={{ background: "white", borderRadius: 16, padding: "24px", border: "1px solid #E8E6E0", maxWidth: 380, margin: "0 auto", textAlign: "left" }}>
              <div style={{ fontWeight: 600, marginBottom: 14, color: TEAL_DARK }}>What happens next?</div>
              {[
                ["📊", "Your Academic Profile Report is being prepared"],
                ["📞", "Our counsellor will call within 24 hours"],
                ["🎯", "Free one-on-one Academic Analysis Session"],
              ].map(([icon, text]) => (
                <div key={text} style={{ display: "flex", gap: 12, marginBottom: 12, alignItems: "flex-start" }}>
                  <span style={{ fontSize: 18 }}>{icon}</span>
                  <span style={{ fontSize: 14, color: "#444", lineHeight: 1.5 }}>{text}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 28, fontSize: 13, color: "#888780" }}>
              Edojo Learning · Delhi NCR · edojolearning.com
            </div>
          </div>
        )}
      </div>
    </>
  );
}
