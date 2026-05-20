import { useState } from "react";
import Head from "next/head";

const TEAL = "#1D9E75";
const TEAL_DARK = "#085041";
const TEAL_LIGHT = "#E1F5EE";

function Badge({ label, color, bg }) {
  return (
    <span style={{ background: bg, color: color, fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20, display: "inline-block" }}>
      {label}
    </span>
  );
}

function FlagCard({ flag }) {
  const isRed = flag.severity === "red";
  return (
    <div style={{ background: isRed ? "#FCEBEB" : "#FAEEDA", border: `1px solid ${isRed ? "#F7C1C1" : "#FAC775"}`, borderRadius: 10, padding: "14px 16px", marginBottom: 10 }}>
      <div style={{ fontWeight: 600, fontSize: 13, color: isRed ? "#791F1F" : "#633806", marginBottom: 6 }}>
        🚨 {flag.name}
      </div>
      <div style={{ fontSize: 13, color: isRed ? "#A32D2D" : "#854F0B", lineHeight: 1.6, marginBottom: 6 }}>{flag.body}</div>
      <div style={{ fontSize: 12, fontWeight: 600, color: isRed ? "#791F1F" : "#633806" }}>{flag.fix}</div>
    </div>
  );
}

function ReportModal({ sub, onClose }) {
  const r = sub.report;
  const subjects = r.subjects || {};
  const scoreColor = n => n >= 4 ? TEAL : n === 3 ? "#BA7517" : "#E24B4A";

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 200, display: "flex", alignItems: "flex-start", justifyContent: "center", overflowY: "auto", padding: "20px 16px" }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#F4F3EF", borderRadius: 20, maxWidth: 640, width: "100%", overflow: "hidden", marginTop: 20, marginBottom: 20 }}>

        {/* Report header */}
        <div style={{ background: TEAL_DARK, padding: "24px 28px", position: "relative" }}>
          <button onClick={onClose} style={{ position: "absolute", top: 16, right: 16, background: "rgba(255,255,255,0.15)", border: "none", color: "white", width: 32, height: 32, borderRadius: 8, cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
          <div style={{ color: "#9FE1CB", fontSize: 11, fontWeight: 600, marginBottom: 6 }}>EDOJO LEARNING · ACADEMIC PROFILE REPORT</div>
          <div style={{ color: "white", fontSize: 22, fontWeight: 700, marginBottom: 10 }}>{r.name}'s Learning Profile</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {[`Class ${r.class}`, sub.school || "School not specified", sub.city || "Delhi", r.date].map(p => (
              <span key={p} style={{ background: "#0F6E56", color: "#B5D4F4", fontSize: 11, padding: "3px 10px", borderRadius: 20 }}>{p}</span>
            ))}
          </div>
        </div>

        <div style={{ padding: "24px 28px", display: "grid", gap: 20 }}>

          {/* Learning style */}
          <div style={{ background: "white", borderRadius: 14, padding: "18px 20px", border: "1px solid #E8E6E0" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#888780", letterSpacing: "0.06em", marginBottom: 6 }}>OVERALL LEARNING PROFILE</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#0A0A08", marginBottom: 10 }}>{r.learningStyle}</div>
            <div style={{ fontSize: 13, color: "#5F5E5A", lineHeight: 1.65 }}>{r.styleDescription}</div>
          </div>

          {/* Habit index */}
          <div style={{ background: "white", borderRadius: 14, padding: "18px 20px", border: "1px solid #E8E6E0" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#888780", letterSpacing: "0.06em", marginBottom: 10 }}>ACADEMIC HABIT INDEX</div>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
              <span style={{ fontSize: 28, fontWeight: 700 }}>{r.habitScore}</span>
              <span style={{ fontSize: 14, color: "#888780" }}>/ 32</span>
              <span style={{ background: "#FAEEDA", color: "#633806", fontSize: 12, fontWeight: 600, padding: "4px 12px", borderRadius: 20 }}>{r.habitCategory}</span>
            </div>
            <div style={{ height: 8, background: "#F1EFE8", borderRadius: 4, overflow: "hidden", marginBottom: 12 }}>
              <div style={{ height: "100%", width: `${(r.habitScore/32)*100}%`, background: "#BA7517", borderRadius: 4 }} />
            </div>
            <div style={{ fontSize: 13, color: "#5F5E5A", lineHeight: 1.65 }}>{r.habitDescription}</div>
          </div>

          {/* Subject map */}
          <div style={{ background: "white", borderRadius: 14, padding: "18px 20px", border: "1px solid #E8E6E0" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#888780", letterSpacing: "0.06em", marginBottom: 14 }}>SUBJECT CONFIDENCE MAP</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 8, marginBottom: 14 }}>
              {Object.entries(subjects).map(([sub, score]) => (
                <div key={sub} style={{ background: "#F8F7F4", borderRadius: 10, padding: "12px 8px", textAlign: "center" }}>
                  <div style={{ fontSize: 11, color: "#888780", marginBottom: 4 }}>{sub}</div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: scoreColor(score) }}>{score}</div>
                  <div style={{ fontSize: 10, color: "#B4B2A9" }}>/ 5</div>
                </div>
              ))}
            </div>
            {r.red?.length > 0 && <div style={{ fontSize: 13, marginBottom: 6 }}><span style={{ color: "#E24B4A" }}>🔴</span> <strong>Immediate attention:</strong> {r.red.join(", ")}</div>}
            {r.yellow?.length > 0 && <div style={{ fontSize: 13, marginBottom: 6 }}><span style={{ color: "#BA7517" }}>🟡</span> <strong>Needs strengthening:</strong> {r.yellow.join(", ")}</div>}
            {r.green?.length > 0 && <div style={{ fontSize: 13, marginBottom: 10 }}><span style={{ color: TEAL }}>🟢</span> <strong>Performing well:</strong> {r.green.join(", ")}</div>}
            <div style={{ fontSize: 13, color: "#5F5E5A", lineHeight: 1.65, borderTop: "1px solid #F1EFE8", paddingTop: 10 }}>
              <strong>Finding:</strong> In {r.weakest}, {r.name} {r.c2Finding}
            </div>
          </div>

          {/* Flags */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#888780", letterSpacing: "0.06em", marginBottom: 12 }}>CRITICAL FLAGS — {r.flags?.length} IDENTIFIED</div>
            {r.flags?.map(f => <FlagCard key={f.name} flag={f} />)}
          </div>

          {/* Summary */}
          <div style={{ background: "white", borderRadius: 14, padding: "18px 20px", border: "1px solid #E8E6E0" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#888780", letterSpacing: "0.06em", marginBottom: 8 }}>WHAT THIS MEANS</div>
            <div style={{ fontSize: 13, color: "#5F5E5A", lineHeight: 1.65 }}>{r.summaryBody}</div>
          </div>

          {/* CTA */}
          <div style={{ background: TEAL_LIGHT, borderRadius: 14, padding: "18px 20px", border: `1px solid #9FE1CB` }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: TEAL_DARK, marginBottom: 8 }}>Recommendation — Free Academic Analysis Session</div>
            <div style={{ fontSize: 13, color: "#0F6E56", lineHeight: 1.65 }}>
              We'd like to invite {r.name} for a complimentary one-on-one Academic Analysis Session with an Edojo counsellor. We will show the document camera system live, walk through the exact gaps identified here, and demonstrate how weekly Sunday parent reports keep you informed every step of the way. No guesswork. No surprises before exams.
            </div>
          </div>

          <div style={{ textAlign: "center", fontSize: 12, color: "#B4B2A9", paddingTop: 4 }}>
            Prepared by Edojo Learning's Academic Intelligence System · edojolearning.com
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Admin() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submissions, setSubmissions] = useState([]);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");

  async function login() {
    setLoading(true); setError("");
    const res = await fetch(`/api/submissions?password=${encodeURIComponent(password)}`);
    if (res.ok) {
      const data = await res.json();
      setSubmissions(data.submissions || []);
      setAuthed(true);
    } else {
      setError("Incorrect password.");
    }
    setLoading(false);
  }

  async function refresh() {
    setLoading(true);
    const res = await fetch(`/api/submissions?password=${encodeURIComponent(password)}`);
    if (res.ok) { const d = await res.json(); setSubmissions(d.submissions || []); }
    setLoading(false);
  }

  const filtered = submissions.filter(s =>
    s.student_name.toLowerCase().includes(search.toLowerCase()) ||
    (s.school || "").toLowerCase().includes(search.toLowerCase()) ||
    (s.city || "").toLowerCase().includes(search.toLowerCase())
  );

  if (!authed) return (
    <>
      <Head><title>Edojo Admin</title></Head>
      <style>{`body { font-family: 'Inter', sans-serif; background: #F4F3EF; } *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }`}</style>
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <div style={{ background: "white", borderRadius: 20, padding: 36, maxWidth: 400, width: "100%", border: "1px solid #E8E6E0", textAlign: "center" }}>
          <div style={{ width: 56, height: 56, background: TEAL_DARK, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <span style={{ color: "white", fontWeight: 700, fontSize: 24 }}>E</span>
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Admin Dashboard</h1>
          <p style={{ fontSize: 14, color: "#888780", marginBottom: 28 }}>Edojo Learning · Submissions</p>
          <input
            type="password" value={password} onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === "Enter" && login()}
            placeholder="Enter admin password"
            style={{ width: "100%", padding: "12px 16px", border: "1.5px solid #D3D1C7", borderRadius: 10, fontSize: 15, marginBottom: 12, outline: "none", fontFamily: "Inter, sans-serif" }}
          />
          {error && <div style={{ color: "#A32D2D", fontSize: 13, marginBottom: 12 }}>{error}</div>}
          <button onClick={login} disabled={loading} style={{ width: "100%", background: TEAL_DARK, color: "white", border: "none", borderRadius: 10, padding: "13px", fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "Inter, sans-serif" }}>
            {loading ? "Checking..." : "Sign In →"}
          </button>
        </div>
      </div>
    </>
  );

  return (
    <>
      <Head><title>Edojo Admin — Submissions</title></Head>
      <style>{`body { font-family: 'Inter', sans-serif; background: #F4F3EF; } *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }`}</style>

      {selected && <ReportModal sub={selected} onClose={() => setSelected(null)} />}

      {/* Admin header */}
      <div style={{ background: TEAL_DARK, padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 32, height: 32, background: TEAL, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "white", fontWeight: 700, fontSize: 14 }}>E</span>
          </div>
          <div>
            <div style={{ color: "white", fontWeight: 600, fontSize: 14 }}>Edojo Admin</div>
            <div style={{ color: "#9FE1CB", fontSize: 11 }}>Submissions Dashboard</div>
          </div>
        </div>
        <button onClick={refresh} style={{ background: "rgba(255,255,255,0.12)", border: "none", color: "white", padding: "7px 16px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontFamily: "Inter, sans-serif" }}>
          {loading ? "..." : "↻ Refresh"}
        </button>
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "28px 20px" }}>
        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 24 }}>
          {[
            ["Total Submissions", submissions.length],
            ["This Week", submissions.filter(s => new Date(s.submitted_at) > new Date(Date.now()-7*86400000)).length],
            ["Avg Habit Score", submissions.length ? Math.round(submissions.reduce((a,s) => a + (s.report?.habitScore||0), 0)/submissions.length) + "/32" : "—"],
          ].map(([label, val]) => (
            <div key={label} style={{ background: "white", borderRadius: 12, padding: "16px 18px", border: "1px solid #E8E6E0" }}>
              <div style={{ fontSize: 12, color: "#888780", marginBottom: 6 }}>{label}</div>
              <div style={{ fontSize: 26, fontWeight: 700, color: "#0A0A08" }}>{val}</div>
            </div>
          ))}
        </div>

        {/* Search */}
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, school, or city..."
          style={{ width: "100%", padding: "11px 16px", border: "1.5px solid #D3D1C7", borderRadius: 10, fontSize: 14, marginBottom: 16, outline: "none", background: "white", fontFamily: "Inter, sans-serif" }}
        />

        {/* Submissions list */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px", color: "#888780" }}>
            {submissions.length === 0 ? "No submissions yet. Share the form link to get started." : "No results found."}
          </div>
        ) : (
          <div style={{ display: "grid", gap: 10 }}>
            {filtered.map(sub => {
              const r = sub.report || {};
              const flagCount = r.flags?.length || 0;
              const date = new Date(sub.submitted_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
              const time = new Date(sub.submitted_at).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
              return (
                <div key={sub.id} onClick={() => setSelected(sub)}
                  style={{ background: "white", borderRadius: 14, padding: "18px 20px", border: "1px solid #E8E6E0", cursor: "pointer", transition: "border-color 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = TEAL}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "#E8E6E0"}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                        <div style={{ width: 36, height: 36, background: TEAL_LIGHT, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: TEAL_DARK, flexShrink: 0 }}>
                          {sub.student_name[0]?.toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 15 }}>{sub.student_name}</div>
                          <div style={{ fontSize: 12, color: "#888780" }}>Class {sub.class} · {sub.school || "School not specified"} · {sub.city || "Delhi"}</div>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        <Badge label={r.learningStyle || "—"} bg="#E6F1FB" color="#0C447C" />
                        <Badge label={r.habitCategory || "—"} bg="#FAEEDA" color="#633806" />
                        <Badge label={`${flagCount} flag${flagCount !== 1 ? "s" : ""}`} bg={flagCount >= 3 ? "#FCEBEB" : "#F1EFE8"} color={flagCount >= 3 ? "#791F1F" : "#444441"} />
                      </div>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div style={{ fontSize: 12, color: "#888780" }}>{date}</div>
                      <div style={{ fontSize: 11, color: "#B4B2A9" }}>{time}</div>
                      <div style={{ marginTop: 8, fontSize: 12, color: TEAL, fontWeight: 500 }}>View report →</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
