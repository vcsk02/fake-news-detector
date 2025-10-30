const BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

export async function classifyText(text: string) {
  const res = await fetch(`${BASE}/classify_text`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function classifyUrl(url: string) {
  const res = await fetch(`${BASE}/classify_url`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
