"use client"

import { useEffect, useState } from "react"

interface TransparentImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string
  threshold?: number // Limiar de brilho para remover (0-255)
}

export function TransparentImage({ src, threshold = 40, alt, className, style, ...props }: TransparentImageProps) {
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

      // Percorrer todos os píxeis e remover o fundo escuro/verde
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
        }
      }

      ctx.putImageData(imageData, 0, 0)
      setProcessedSrc(canvas.toDataURL())
    }
  }, [src, threshold])

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
