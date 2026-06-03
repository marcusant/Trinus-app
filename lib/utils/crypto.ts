import crypto from 'crypto'

const ALGORITHM = 'aes-256-gcm'
const IV_LENGTH = 12 // Standard for GCM
const TAG_LENGTH = 16
const MIN_KEY_LENGTH = 32

/**
 * Deriva a chave de 32 bytes a partir de ENCRYPTION_KEY.
 * Validação preguiçosa (lazy): falha de forma explícita no primeiro uso se a
 * variável não estiver definida ou for demasiado curta — NUNCA usa fallback
 * hardcoded (que encriptaria dados clínicos com chave pública conhecida).
 */
function getKey(): Buffer {
  const raw = process.env.ENCRYPTION_KEY
  if (!raw || raw.length < MIN_KEY_LENGTH) {
    throw new Error(
      `ENCRYPTION_KEY ausente ou demasiado curta (mín. ${MIN_KEY_LENGTH} caracteres). ` +
      `Defina-a em .env.local — encriptação de dados de saúde abortada.`
    )
  }
  return crypto.createHash('sha256').update(raw).digest()
}

/**
 * Encrypts a plaintext string using AES-256-GCM.
 * Output format: hex(iv):hex(tag):hex(ciphertext)
 */
export function encrypt(text: string): string {
  if (!text) return ''
  const iv = crypto.randomBytes(IV_LENGTH)
  const cipher = crypto.createCipheriv(ALGORITHM, getKey(), iv)
  let encrypted = cipher.update(text, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  const tag = cipher.getAuthTag().toString('hex')
  return `${iv.toString('hex')}:${tag}:${encrypted}`
}

/**
 * Decrypts a ciphertext string using AES-256-GCM.
 *
 * Segurança (C-2): se o valor TEM formato de cifra válido (iv:tag:ciphertext)
 * mas a autenticação GCM falha (adulteração, chave errada, corrupção), LANÇA erro
 * em vez de devolver dados não confiáveis — preservando a garantia de integridade.
 *
 * Valores que claramente NÃO estão encriptados (sem o formato de 3 partes) são
 * devolvidos como estão, por resiliência a dados não-encriptados (não é um vetor
 * de bypass: são dados que nunca foram cifrados, protegidos por RLS na escrita).
 */
export function decrypt(encryptedText: string): string {
  if (!encryptedText) return ''

  const parts = encryptedText.split(':')
  if (parts.length !== 3) {
    return encryptedText // valor não-encriptado (legado/plaintext)
  }

  const [ivHex, tagHex, encrypted] = parts
  if (ivHex.length !== IV_LENGTH * 2 || tagHex.length !== TAG_LENGTH * 2) {
    return encryptedText // não corresponde ao formato de cifra
  }

  // A partir daqui o valor afirma ser cifra válida — qualquer falha é integridade.
  const iv = Buffer.from(ivHex, 'hex')
  const tag = Buffer.from(tagHex, 'hex')
  const decipher = crypto.createDecipheriv(ALGORITHM, getKey(), iv)
  decipher.setAuthTag(tag)
  let decrypted = decipher.update(encrypted, 'hex', 'utf8')
  decrypted += decipher.final('utf8') // lança se o authTag não validar
  return decrypted
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
