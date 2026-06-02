export function isValidAdminToken(token: string | undefined): boolean {
  if (!token) return false
  return token === process.env.ADMIN_SESSION_TOKEN
}
