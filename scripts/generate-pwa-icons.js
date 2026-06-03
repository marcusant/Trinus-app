import sharp from 'sharp'
import fs from 'fs'
import path from 'path'

/**
 * Gera os ícones da app (PWA + favicon) a partir da logo original.
 *
 * Objetivo: um ÍCONE (estilo Google Drive / Vercel) — apenas o símbolo do
 * tridente violeta preenchendo o quadro, com FUNDO TRANSPARENTE. Removemos o
 * fundo escuro texturizado da logo original (que fazia parecer uma foto) e
 * recortamos justo no tridente.
 */

const SOURCE = path.resolve('logo/logo.png')
const PUBLIC_DIR = path.resolve('public')
const APP_DIR = path.resolve('app')

const PNG_SIZES = [192, 512]
const FAVICON_SIZE = 64
const PADDING_RATIO = 0.08 // 8% de respiro em volta do tridente

/**
 * Remove o fundo escuro da logo deixando só o tridente colorido.
 * Usa a saturação como discriminador: o fundo é cinza (baixa saturação),
 * o tridente é violeta/rosa (alta saturação). A transição gera alpha suave
 * (anti-aliasing) nas bordas. Retorna um buffer PNG RGBA recortado no tridente.
 */
async function extractTrident() {
  const { data, info } = await sharp(SOURCE).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  const { width: w, height: h, channels: c } = info

  for (let i = 0; i < data.length; i += c) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    const maxc = Math.max(r, g, b)
    const minc = Math.min(r, g, b)
    const sat = maxc - minc
    // sat <= 10 → fundo (transparente); sat >= 40 → tridente (opaco); meio → feather
    const alpha = Math.max(0, Math.min(1, (sat - 10) / 30))
    data[i + 3] = Math.round(alpha * 255)
  }

  // Reconstrói e recorta as bordas totalmente transparentes (trim no tridente).
  return sharp(data, { raw: { width: w, height: h, channels: c } })
    .png()
    .trim({ threshold: 1 })
    .toBuffer()
}

/** Coloca o tridente recortado, centrado, num quadrado transparente com respiro. */
async function toSquareIcon(tridentPng, size) {
  const padding = Math.round(size * PADDING_RATIO)
  const inner = size - padding * 2
  const resized = await sharp(tridentPng)
    .resize(inner, inner, { fit: 'inside', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer()
  return sharp({
    create: { width: size, height: size, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite([{ input: resized, gravity: 'center' }])
    .png()
    .toBuffer()
}

/** Embrulha um PNG num contêiner .ico (suportado por browsers modernos). */
function pngToIco(pngBuffer, dimension) {
  const header = Buffer.alloc(6)
  header.writeUInt16LE(0, 0)
  header.writeUInt16LE(1, 2) // tipo: ícone
  header.writeUInt16LE(1, 4) // nº de imagens

  const entry = Buffer.alloc(16)
  entry.writeUInt8(dimension >= 256 ? 0 : dimension, 0)
  entry.writeUInt8(dimension >= 256 ? 0 : dimension, 1)
  entry.writeUInt8(0, 2)
  entry.writeUInt8(0, 3)
  entry.writeUInt16LE(1, 4)
  entry.writeUInt16LE(32, 6)
  entry.writeUInt32LE(pngBuffer.length, 8)
  entry.writeUInt32LE(6 + 16, 12)

  return Buffer.concat([header, entry, pngBuffer])
}

async function generateIcons() {
  console.log('=== GERANDO ÍCONES DA APP (sharp) ===')

  if (!fs.existsSync(SOURCE)) {
    throw new Error(`Logo original não encontrada em: ${SOURCE}`)
  }

  const trident = await extractTrident()

  for (const size of PNG_SIZES) {
    const outPath = path.join(PUBLIC_DIR, `icon-${size}.png`)
    fs.writeFileSync(outPath, await toSquareIcon(trident, size))
    console.log(`🎉 icon-${size}.png (transparente) gerado → ${outPath}`)
  }

  const faviconPng = await toSquareIcon(trident, FAVICON_SIZE)
  const icoPath = path.join(APP_DIR, 'favicon.ico')
  fs.writeFileSync(icoPath, pngToIco(faviconPng, FAVICON_SIZE))
  console.log(`🎉 favicon.ico (transparente) gerado → ${icoPath}`)

  console.log('=== FIM DA GERAÇÃO ===')
}

generateIcons().catch((err) => {
  console.error('❌ Erro durante a geração de ícones:', err)
  process.exit(1)
})
