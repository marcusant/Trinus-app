import fs from 'fs'
import path from 'path'

const sourceDir = 'C:\\dev\\TRINUS-APP\\logo'
const destDir = 'C:\\dev\\TRINUS-APP\\public'

try {
  // Garantir que a pasta destino existe
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true })
  }

  // Copiar logo_trinus.png
  fs.copyFileSync(
    path.join(sourceDir, 'logo_trinus.png'),
    path.join(destDir, 'logo_trinus.png')
  )
  console.log('logo_trinus.png copiado com sucesso para public/')

  // Copiar nome_trinus.png
  fs.copyFileSync(
    path.join(sourceDir, 'nome_trinus.png'),
    path.join(destDir, 'nome_trinus.png')
  )
  console.log('nome_trinus.png copiado com sucesso para public/')
  
} catch (err) {
  console.error('Erro ao copiar ficheiros de logo:', err.message)
}
