import { chromium } from 'playwright'
import fs from 'fs'
import path from 'path'

async function generateIcons() {
  console.log('=== GENERATING PWA ICONS VIA HEADLESS CHROMIUM ===')
  
  let browser;
  try {
    browser = await chromium.launch({ headless: true })
    const page = await browser.newPage()
    
    // Ler a imagem original e converter para base64 para injetar na página
    const originalPath = 'C:\\dev\\TRINUS-APP\\public\\logo_trinus.png'
    if (!fs.existsSync(originalPath)) {
      throw new Error(`Imagem original não encontrada em: ${originalPath}`)
    }
    const base64Image = fs.readFileSync(originalPath).toString('base64')
    const imgSrc = `data:image/png;base64,${base64Image}`
    
    // Executar processamento de imagem na página do browser
    const result = await page.evaluate(async (imgSrc) => {
      return new Promise((resolve, reject) => {
        const img = new Image()
        img.src = imgSrc
        img.onload = () => {
          // 1. Criar um canvas temporário para remover o fundo escuro/verde
          const tempCanvas = document.createElement('canvas')
          tempCanvas.width = img.width
          tempCanvas.height = img.height
          const tempCtx = tempCanvas.getContext('2d')
          
          if (!tempCtx) {
            reject(new Error('Não foi possível obter o contexto 2D para o canvas temporário'))
            return
          }
          
          tempCtx.drawImage(img, 0, 0)
          const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height)
          const data = imageData.data
          const threshold = 40
          
          // Percorrer todos os píxeis e remover o fundo escuro/verde
          for (let i = 0; i < data.length; i += 4) {
            const r = data[i]
            const g = data[i + 1]
            const b = data[i + 2]
            
            const isDark = r < threshold && g < threshold + 15 && b < threshold
            const isGreenishBg = g > r && g > b && g < 60 && r < 25 && b < 25
            
            if (isDark || isGreenishBg) {
              data[i + 3] = 0 // Define alfa (transparência) como 0
            }
          }
          tempCtx.putImageData(imageData, 0, 0)
          
          // 2. Gerar os tamanhos necessários aplicando o filtro roxo
          const sizes = [192, 512]
          const output = {}
          
          sizes.forEach(size => {
            const canvas = document.createElement('canvas')
            canvas.width = size
            canvas.height = size
            const ctx = canvas.getContext('2d')
            
            if (ctx) {
              // Limpar canvas
              ctx.clearRect(0, 0, size, size)
              
              // Aplicar o filtro de cor para converter dourado em roxo vibrante
              ctx.filter = 'hue-rotate(230deg) saturate(250%) brightness(110%)'
              
              // Desenhar a imagem transparente centralizada no canvas
              // Deixar 10% de padding para o ícone de app ficar harmonioso e centralizado
              const padding = size * 0.10
              const drawSize = size - (padding * 2)
              ctx.drawImage(tempCanvas, padding, padding, drawSize, drawSize)
              
              output[size] = canvas.toDataURL('image/png')
            }
          })
          resolve(output)
        }
        img.onerror = () => reject(new Error('Erro ao carregar imagem no browser'))
      })
    }, imgSrc)
    
    // Salvar as imagens geradas na pasta public/
    const publicDir = 'C:\\dev\\TRINUS-APP\\public'
    
    // 1. Salvar icon-192.png
    const data192 = result[192].split(',')[1]
    fs.writeFileSync(path.join(publicDir, 'icon-192.png'), Buffer.from(data192, 'base64'))
    console.log('🎉 icon-192.png gerado com fundo transparente e salvo em public/')
    
    // 2. Salvar icon-512.png
    const data512 = result[512].split(',')[1]
    fs.writeFileSync(path.join(publicDir, 'icon-512.png'), Buffer.from(data512, 'base64'))
    console.log('🎉 icon-512.png gerado com fundo transparente e salvo em public/')
    
  } catch (err) {
    console.error('❌ Erro durante a geração de ícones:', err)
  } finally {
    if (browser) await browser.close()
    console.log('=== FIM DA GERAÇÃO ===')
  }
}

generateIcons()
