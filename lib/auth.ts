import bcrypt from 'bcryptjs'

/**
 * Hash a password
 */
export async function hashPassword(password: string): Promise<string> {
  const hashedPassword = await bcrypt.hash(password, 12)
  return hashedPassword
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  const isValid = await bcrypt.compare(password, hashedPassword)
  return isValid
}

/**
 * Generate a unique slug from email
 */
export function generateSlug(email: string): string {
  const username = email.split('@')[0]
  const randomString = Math.random().toString(36).substring(2, 8)
  return `${username}-${randomString}`.toLowerCase()
}

