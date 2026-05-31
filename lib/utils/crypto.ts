import crypto from 'crypto'

// Use a fallback key for development to prevent runtime crashes if not set
const secretKeyRaw = process.env.ENCRYPTION_KEY || 'trinus_default_dev_secret_key_change_me_in_prod'
// Generate a secure 32-byte key from whatever key is supplied
const ENCRYPTION_KEY = crypto.createHash('sha256').update(secretKeyRaw).digest()

const ALGORITHM = 'aes-256-gcm'
const IV_LENGTH = 12 // Standard for GCM
const TAG_LENGTH = 16

/**
 * Encrypts a plaintext string using AES-256-GCM.
 * Output format: hex(iv):hex(tag):hex(ciphertext)
 */
export function encrypt(text: string): string {
  if (!text) return ''
  const iv = crypto.randomBytes(IV_LENGTH)
  const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv)
  let encrypted = cipher.update(text, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  const tag = cipher.getAuthTag().toString('hex')
  return `${iv.toString('hex')}:${tag}:${encrypted}`
}

/**
 * Decrypts a ciphertext string using AES-256-GCM.
 * Tolerates hybrid/unencrypted legacy values by returning them as-is on failure.
 */
export function decrypt(encryptedText: string): string {
  if (!encryptedText) return ''
  
  const parts = encryptedText.split(':')
  if (parts.length !== 3) {
    return encryptedText
  }

  const [ivHex, tagHex, encrypted] = parts
  if (ivHex.length !== IV_LENGTH * 2 || tagHex.length !== TAG_LENGTH * 2) {
    return encryptedText // Fallback to raw text if format is invalid
  }

  try {
    const iv = Buffer.from(ivHex, 'hex')
    const tag = Buffer.from(tagHex, 'hex')
    const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY, iv)
    decipher.setAuthTag(tag)
    let decrypted = decipher.update(encrypted, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    return decrypted
  } catch (error) {
    // Fail silently and return original text for legacy records compatibility
    return encryptedText
  }
}

/**
 * Recursively encrypts all string properties inside a nested object/array.
 */
export function encryptObject(obj: any): any {
  if (obj === null || obj === undefined) return obj
  if (typeof obj === 'string') return encrypt(obj)
  if (Array.isArray(obj)) return obj.map(encryptObject)
  if (typeof obj === 'object') {
    const res: any = {}
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        res[key] = encryptObject(obj[key])
      }
    }
    return res
  }
  return obj
}

/**
 * Recursively decrypts all string properties inside a nested object/array.
 */
export function decryptObject(obj: any): any {
  if (obj === null || obj === undefined) return obj
  if (typeof obj === 'string') return decrypt(obj)
  if (Array.isArray(obj)) return obj.map(decryptObject)
  if (typeof obj === 'object') {
    const res: any = {}
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        res[key] = decryptObject(obj[key])
      }
    }
    return res
  }
  return obj
}
