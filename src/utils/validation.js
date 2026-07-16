// Centralized client-side validation.
// NOTE: client-side checks are a UX convenience only — the backend MUST
// re-validate everything here, since a person can bypass the frontend entirely
// (browser devtools, direct API calls with curl/Postman, etc).

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(value) {
  return EMAIL_RE.test(String(value).trim());
}

// Requires 8+ chars, at least one letter and one number.
// Intentionally does NOT force special characters — long, memorable
// passphrases are safer than short "complex" passwords per NIST guidance.
export function getPasswordIssues(password) {
  const issues = [];
  if (!password || password.length < 8) issues.push("At least 8 characters");
  if (!/[a-zA-Z]/.test(password)) issues.push("At least one letter");
  if (!/[0-9]/.test(password)) issues.push("At least one number");
  return issues;
}

export function isValidPassword(password) {
  return getPasswordIssues(password).length === 0;
}

// Strips control characters and trims. React already escapes everything it
// renders (no dangerouslySetInnerHTML is used anywhere in this app), so this
// is a light defense-in-depth pass, not the only line of defense against XSS.
export function sanitizeText(value, maxLength = 2000) {
  return String(value ?? "")
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .trim()
    .slice(0, maxLength);
}

// Simple in-memory throttle to stop accidental double-submits (double click,
// double Enter) from firing the same request twice. Real rate limiting still
// has to live on the backend.
export function createSubmitGuard(minIntervalMs = 800) {
  let last = 0;
  return function guard(fn) {
    return async (...args) => {
      const now = Date.now();
      if (now - last < minIntervalMs) return;
      last = now;
      return fn(...args);
    };
  };
}
