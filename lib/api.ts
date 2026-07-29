const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4040";
console.log("API_URL:", API_URL);

const TOKEN_KEY = "githubchi_jwt";

export function getApiToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setApiToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearApiToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export async function exchangeGithubToken(accessToken: string) {
  const res = await fetch(`${API_URL}/auth/github`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ accessToken }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Auth failed");
  }
  const data = (await res.json()) as {
    token: string;
    user: {
      id: string;
      username: string;
      name: string | null;
      email: string | null;
      avatarUrl: string | null;
    };
  };
  setApiToken(data.token);
  return data;
}

async function apiFetch(path: string, init: RequestInit = {}) {
  const token = getApiToken();
  const headers = new Headers(init.headers);
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  const res = await fetch(`${API_URL}${path}`, { ...init, headers });
  return res;
}

export async function fetchMe() {
  const res = await apiFetch("/me");
  if (!res.ok) throw new Error("Unauthorized");
  return res.json();
}

export async function fetchGithubMeta() {
  const res = await apiFetch("/me/github-meta");
  if (!res.ok) return { joinedYear: 2010 };
  return res.json() as Promise<{ joinedYear: number }>;
}

export async function fetchActions() {
  const res = await apiFetch("/actions");
  if (!res.ok) throw new Error("Failed to load actions");
  return res.json() as Promise<{ actions: ActionDto[] }>;
}

export type ProgressEvent = {
  step: string;
  message: string;
  current?: number;
  total?: number;
  error?: string;
};

export async function createActionStream(
  config: object,
  onProgress: (e: ProgressEvent) => void,
): Promise<{ ok: boolean; actionId?: string; githubUrl?: string; error?: string }> {
  const token = getApiToken();
  const res = await fetch(`${API_URL}/actions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "text/event-stream",
    },
    body: JSON.stringify(config),
  });

  if (!res.ok || !res.body) {
    const err = await res.json().catch(() => ({}));
    return { ok: false, error: err.error || `HTTP ${res.status}` };
  }

  return readSSE(res.body, onProgress);
}

export async function deleteActionStream(
  id: string,
  onProgress: (e: ProgressEvent) => void,
): Promise<{ ok: boolean; error?: string }> {
  const token = getApiToken();
  const res = await fetch(`${API_URL}/actions/${id}?stream=1`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "text/event-stream",
    },
  });

  if (!res.ok || !res.body) {
    const err = await res.json().catch(() => ({}));
    return { ok: false, error: err.error || `HTTP ${res.status}` };
  }

  return readSSE(res.body, onProgress);
}

async function readSSE(
  body: ReadableStream<Uint8Array>,
  onProgress: (e: ProgressEvent) => void,
): Promise<{ ok: boolean; actionId?: string; githubUrl?: string; error?: string }> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let result: { ok: boolean; actionId?: string; githubUrl?: string; error?: string } = {
    ok: false,
  };

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const parts = buffer.split("\n\n");
    buffer = parts.pop() || "";

    for (const part of parts) {
      const lines = part.split("\n");
      let event = "message";
      let data = "";
      for (const line of lines) {
        if (line.startsWith("event:")) event = line.slice(6).trim();
        if (line.startsWith("data:")) data += line.slice(5).trim();
      }
      if (!data) continue;
      try {
        const parsed = JSON.parse(data);
        if (event === "progress") onProgress(parsed);
        if (event === "done") result = parsed;
      } catch {
        /* ignore */
      }
    }
  }
  return result;
}

export type ActionDto = {
  id: string;
  year: number;
  pattern: string;
  density: number;
  yearPart: string;
  months?: number[];

  weekPart: string;
  text: string | null;
  textCommitsPerDay: number | null;
  preview: Record<string, number>;
  commitCount: number;
  dayCount: number;
  status: string;
  githubUrl: string | null;
  errorMessage: string | null;
  createdAt: string;
  cancelledAt: string | null;
};
