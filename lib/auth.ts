export const AUTH_TOKEN_KEY = "c_token";

export async function setStoredToken(token: string): Promise<void> {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(AUTH_TOKEN_KEY, token);
  await fetch("/api/auth/set-cookie", {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({ token }),
  });
}

export async function clearStoredAuth(): Promise<void> {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(AUTH_TOKEN_KEY);
  await fetch("/api/auth/logout", { method: "POST" });
}

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(AUTH_TOKEN_KEY);
}

export function isAuthenticated(): boolean {
  return !!getStoredToken();
}
