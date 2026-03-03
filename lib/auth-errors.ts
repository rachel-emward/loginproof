/**
 * Map auth provider errors to generic user-facing messages.
 * Avoids leaking implementation details (e.g. "Email not confirmed" vs "Invalid credentials")
 * which can aid enumeration and is recommended for regulated environments.
 */
export function sanitizeAuthError(message: string | null | undefined): string {
  if (!message || typeof message !== "string") {
    return "An error occurred. Please try again.";
  }
  const lower = message.toLowerCase();
  // Generic messages only; do not expose provider-specific reasons
  if (
    lower.includes("invalid") ||
    lower.includes("credentials") ||
    lower.includes("not confirmed")
  ) {
    return "Invalid credentials. Please check your email and password.";
  }
  if (lower.includes("rate") || lower.includes("too many")) {
    return "Too many attempts. Please try again later.";
  }
  if (
    lower.includes("already been registered") ||
    lower.includes("already registered") ||
    lower.includes("email already in use")
  ) {
    return "An account with this email already exists. Sign in above or use a different email.";
  }
  if (lower.includes("network") || lower.includes("fetch")) {
    return "Connection error. Please check your network and try again.";
  }
  // Default: do not expose raw message
  return "An error occurred. Please try again.";
}
