import { createClient } from "@supabase/supabase-js";
import { generateReport } from "../../lib/reportEngine";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { name, class: cls, school, city, answers } = req.body;

  if (!name || !cls || !answers) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const report = generateReport({ name, class: cls, school, city, answers });

  const { error } = await supabase.from("submissions").insert([{
    student_name: name,
    class: cls,
    school: school || "",
    city: city || "",
    answers: answers,
    report: report,
    submitted_at: new Date().toISOString(),
  }]);

  if (error) {
    console.error("Supabase error:", error);
    return res.status(500).json({ error: "Failed to save submission" });
  }

  return res.status(200).json({ success: true });
}
