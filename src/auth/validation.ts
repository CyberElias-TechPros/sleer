export function validateCredentials(email: string, password: string): string | null {
  if (!email.trim() || !password) return 'Enter your email and password.';
  return null;
}
export function validateProfile(name: string, bio: string): string | null {
  if (!name.trim()) return 'Display name cannot be empty.';
  if (name.trim().length > 40) return 'Display name must be 40 characters or less.';
  if (bio.length > 160) return 'Bio must be 160 characters or less.';
  return null;
}
