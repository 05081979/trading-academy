// Algorithmic Academy — AI Tutor Worker
// Proxy Gemini + tier-gating + rate limit per user

import corpusStarterRaw from "../corpus/corpus-starter.json";
import corpusPremiumRaw from "../corpus/corpus-premium.json";

const corpusStarterData = Array.isArray(corpusStarterRaw) ? corpusStarterRaw : JSON.parse(corpusStarterRaw);
const corpusPremiumData = Array.isArray(corpusPremiumRaw) ? corpusPremiumRaw : JSON.parse(corpusPremiumRaw);

const MODEL = "gemini-2.5-flash";
const DAILY_LIMIT = 100; // questions par eleve par jour
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

// Liste de tokens AA revoques (copie de auth.js — a garder sync manuellement)
const REVOKED = new Set([
  "elgavacho8421|premium",
  "elgavacho8421|starter",
  "elgavacho8421|custom",
]);

// --- Utils ---
function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json", ...CORS },
  });
}

function todayKey(user) {
  const d = new Date();
  const ymd = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
  return `q:${user}:${ymd}`;
}

// Decode AA-S-xxx / AA-P-xxx / AA-C-xxx (meme logique que auth.js)
function decodeAA(token) {
  if (!token || !token.startsWith("AA-")) return null;
  const parts = token.split("-");
  if (parts.length < 3) return null;
  const tier = parts[1].toLowerCase();
  const encoded = parts.slice(2).join("-");
  let decoded;
  try {
    decoded = atob(encoded);
  } catch {
    return null;
  }
  if (!decoded || decoded.length < 2) return null;

  if (tier === "c") {
    const pipe = decoded.indexOf("|");
    if (pipe < 0) return null;
    const username = decoded.slice(0, pipe);
    if (REVOKED.has(`${username}|custom`)) return null;
    const slugs = decoded
      .slice(pipe + 1)
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    return { username, tier: "custom", allow: slugs };
  }
  if (tier !== "s" && tier !== "p") return null;
  const t = tier === "p" ? "premium" : "starter";
  if (REVOKED.has(`${decoded}|${t}`)) return null;
  return { username: decoded, tier: t, allow: [] };
}

function buildSystemPrompt(corpus, tier) {
  const tierNote =
    tier === "starter"
      ? "Cet eleve a un acces STARTER. Reponds uniquement sur les fondamentaux. Si la question depasse le niveau starter, dis-lui poliment que cela releve du tier Premium et d'upgrader pour avoir la reponse complete."
      : tier === "custom"
      ? "Cet eleve a un acces CUSTOM (modules specifiques). Reponds uniquement dans le cadre des modules disponibles ci-dessous."
      : "Cet eleve a un acces PREMIUM complet. Reponds avec toute la profondeur necessaire.";

  const modules = corpus
    .map((m) => `### ${m.title} (${m.slug}, tier=${m.tier})\n${m.text}`)
    .join("\n\n---\n\n");

  return `Tu es le tuteur IA de l'Algorithmic Academy (formation trading ICT/Kronos/QT).

${tierNote}

REGLES STRICTES:
- Reponds en francais, ton clair et pedagogique.
- Ne reponds QUE sur les sujets du cours (ICT, liquidite, order blocks, FVG, SMT, PO3, cycles temporels, Goldbach, killzones, macros, psychologie trading).
- Si la question est hors-sujet (vie perso, autres sujets), recadre gentiment vers le trading.
- Jamais de conseils financiers specifiques (ex: "achete NQ maintenant"). Explique les CONCEPTS et METHODES.
- Terminologie ICT: toujours BISI (jamais BC) et SIBI (jamais CB).
- Cite le module concerne quand pertinent (ex: "Voir le module 'Comprendre la liquidite'").
- Si tu ne sais pas, dis-le.

CONTENU DU COURS DISPONIBLE:

${modules}`;
}

async function getCount(env, user) {
  if (!env.RATE_KV) return 0;
  const v = await env.RATE_KV.get(todayKey(user));
  return v ? parseInt(v, 10) : 0;
}

async function incCount(env, user) {
  if (!env.RATE_KV) return;
  const key = todayKey(user);
  const cur = await getCount(env, user);
  await env.RATE_KV.put(key, String(cur + 1), { expirationTtl: 172800 });
}

async function callGemini(env, system, question) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${env.GEMINI_KEY}`;
  const body = {
    systemInstruction: { parts: [{ text: system }] },
    contents: [{ role: "user", parts: [{ text: question }] }],
    generationConfig: {
      temperature: 0.4,
      maxOutputTokens: 1024,
      thinkingConfig: { thinkingBudget: 0 },
    },
    safetySettings: [
      { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_ONLY_HIGH" },
      { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_ONLY_HIGH" },
      { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_ONLY_HIGH" },
      { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_ONLY_HIGH" },
    ],
  };
  const r = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await r.json();
  if (!r.ok) {
    if (r.status === 429) {
      const err = new Error("quota");
      err.quota = true;
      throw err;
    }
    throw new Error(`Gemini ${r.status}: ${JSON.stringify(data).slice(0, 300)}`);
  }
  const answer =
    data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") || "";
  return answer || "(pas de reponse)";
}

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS });
    }
    if (request.method !== "POST") {
      return json({ error: "POST only" }, 405);
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return json({ error: "JSON invalide" }, 400);
    }

    const { question, token } = body || {};
    if (!question || typeof question !== "string") {
      return json({ error: "question manquante" }, 400);
    }
    if (question.length > 2000) {
      return json({ error: "question trop longue (max 2000 caracteres)" }, 400);
    }

    const id = decodeAA(token || "");
    if (!id) {
      return json({ error: "Token invalide. Reconnecte-toi." }, 401);
    }

    // Rate limit
    const used = await getCount(env, id.username);
    if (used >= DAILY_LIMIT) {
      return json(
        {
          error: `Quota atteint (${DAILY_LIMIT} questions/jour). Reessaye demain.`,
          used,
          limit: DAILY_LIMIT,
        },
        429
      );
    }

    // Select corpus
    let corpus;
    if (id.tier === "starter") corpus = corpusStarterData;
    else if (id.tier === "premium") corpus = corpusPremiumData;
    else if (id.tier === "custom") {
      const allow = new Set(id.allow);
      corpus = corpusPremiumData.filter((m) => allow.has(m.slug));
      if (corpus.length === 0) {
        return json({ error: "Aucun module autorise pour ton compte." }, 403);
      }
    } else {
      return json({ error: "Tier inconnu" }, 400);
    }

    const system = buildSystemPrompt(corpus, id.tier);

    let answer;
    try {
      answer = await callGemini(env, system, question);
    } catch (e) {
      if (e.quota) {
        return json({
          error: "Le tuteur IA a atteint son quota journalier gratuit (reset a 02h heure francaise). Reviens demain ou attends un peu.",
        }, 429);
      }
      return json({ error: "Erreur IA: " + e.message }, 502);
    }

    await incCount(env, id.username);

    return json({
      answer,
      tier: id.tier,
      used: used + 1,
      limit: DAILY_LIMIT,
    });
  },
};
