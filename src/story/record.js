import { NPCS } from "./data.js";
import { FINAL_CHOICES } from "./chapter2.js";
import { ROUTES3 } from "./chapter3.js";
import { REFLECTION } from "./sources.js";
// Plain-text record of the player's decisions, for a worksheet or a teacher.
export function buildRecord(state, { name = "", date = new Date() } = {}) {
  const who = name.trim().slice(0, 60);
  const lines = ["CAESAR – Március idusa · tanulói feljegyzés"];
  if (who) lines.push("Név: " + who);
  lines.push("Dátum: " + date.toISOString().slice(0, 10), "");
  lines.push("Döntéseim");
  const recipient = NPCS[state.decisions?.messageRecipient];
  lines.push(
    "I. fejezet: az üzenetet " +
      (recipient ? recipient.name : "— ") +
      " kapta.",
  );
  lines.push(
    "II. fejezet: " + (FINAL_CHOICES[state.chapter2?.decision] || "—"),
  );
  lines.push(
    "III. fejezet: " + (ROUTES3[state.chapter2?.decision]?.result || "—"),
  );
  lines.push(
    "Városi nyomok: Subura " +
      (state.city?.seal ? "✓" : "—") +
      " · Tiberis-part " +
      (state.city?.dockConclusion ? "✓" : "—") +
      " · Palatinusi kert " +
      (state.city?.delivered ? "✓" : "—"),
  );
  lines.push(
    "Következtetési kísérletek (I./II./III. fejezet): " +
      [
        state.conclusionAttempts,
        state.chapter2?.attempts,
        state.chapter3?.attempts,
      ]
        .map((n) => n ?? 0)
        .join(" / "),
    "",
  );
  lines.push("Önreflexió – válaszolj röviden az alábbi kérdésekre:");
  REFLECTION.forEach((q, i) => lines.push(`${i + 1}. ${q}`, "   "));
  return lines.join("\n");
}
