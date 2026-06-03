"use client"

import { useEffect, useState } from "react"

interface TransparentImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string
  threshold?: number // Limiar de brilho para remover (0-255)
  tintColor?: { r: number; g: number; b: number } // Cor de tintagem opcional (RGB)
}

export function TransparentImage({
  src,
  threshold = 40,
  tintColor,
  alt,
  className,
  style,
  ...props
}: TransparentImageProps) {
  const [processedSrc, setProcessedSrc] = useState<string>(src)

  useEffect(() => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.src = src
    img.onload = () => {
      const canvas = document.createElement("canvas")
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      ctx.drawImage(img, 0, 0)
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData.data

      let minX = canvas.width
      let minY = canvas.height
      let maxX = -1
      let maxY = -1

      // 1. Percorrer todos os píxeis e aplicar transparência / tintagem
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i]
        const g = data[i + 1]
        const b = data[i + 2]

        // Se o píxel for muito escuro (fundo preto/verde escuro)
        // ou se for predominantemente verde escuro (r e b baixos, g ligeiramente maior)
        const isDark = r < threshold && g < threshold + 15 && b < threshold
        const isGreenishBg = g > r && g > b && g < 60 && r < 25 && b < 25

        if (isDark || isGreenishBg) {
          data[i + 3] = 0 // Define alfa (transparência) como 0
        } else {
          // Pixel ativo!
          const pixelIndex = i / 4
          const x = pixelIndex % canvas.width
          const y = Math.floor(pixelIndex / canvas.width)
          
          if (x < minX) minX = x
          if (x > maxX) maxX = x
          if (y < minY) minY = y
          if (y > maxY) maxY = y

          // Aplicar tintagem se tintColor estiver definido
          if (tintColor) {
            // Calcular o brilho do pixel com base no canal máximo
            // Isso preserva perfeitamente os degrades e a suavização das bordas (anti-aliasing)
            const brightness = Math.max(r, g, b) / 255
            data[i] = Math.round(tintColor.r * brightness)
            data[i + 1] = Math.round(tintColor.g * brightness)
            data[i + 2] = Math.round(tintColor.b * brightness)
          }
        }
      }

      // 2. Recortar a imagem rente aos pixels ativos (Remoção total de margens invisíveis)
      if (maxX >= minX && maxY >= minY) {
        const croppedWidth = maxX - minX + 1
        const croppedHeight = maxY - minY + 1

        // Atualizar o canvas original com a transparência e cores modificadas
        ctx.putImageData(imageData, 0, 0)

        // Criar um canvas secundário com o tamanho exato do logotipo ativo
        const croppedCanvas = document.createElement("canvas")
        croppedCanvas.width = croppedWidth
        croppedCanvas.height = croppedHeight
        const croppedCtx = croppedCanvas.getContext("2d")
        
        if (croppedCtx) {
          croppedCtx.drawImage(
            canvas,
            minX,
            minY,
            croppedWidth,
            croppedHeight,
            0,
            0,
            croppedWidth,
            croppedHeight
          )
          setProcessedSrc(croppedCanvas.toDataURL())
        } else {
          setProcessedSrc(canvas.toDataURL())
        }
      } else {
        ctx.putImageData(imageData, 0, 0)
        setProcessedSrc(canvas.toDataURL())
      }
    }
  }, [src, threshold, tintColor])

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={processedSrc}
      alt={alt}
      className={className}
      style={style}
      {...props}
    />
  )
}

