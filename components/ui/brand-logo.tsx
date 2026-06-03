"use client"

import { cn } from "@/lib/utils"

interface BrandLogoProps {
  variant?: "full" | "trident" | "dynamic"
  scrolled?: boolean
  className?: string
}

export function BrandLogo({ variant = "full", scrolled = false, className }: BrandLogoProps) {
  if (variant === "dynamic") {
    return (
      <div className={cn("relative flex items-center group w-[77.58px] md:w-[96.97px] h-8 md:h-10 shrink-0 select-none", className)}>
        {/* O Logotipo Completo (Unificado, 100% nítido, sem cortes ou lacunas) */}
        <img
          src="/trinus_final.png"
          alt="TRINUS"
          className={cn(
            "absolute top-0 left-0 h-full w-auto object-contain transition-all duration-300",
            scrolled ? "opacity-0 scale-95 pointer-events-none" : "opacity-100 scale-100"
          )}
        />

        {/* O Tridente Limpo - Posicionado cirurgicamente exatamente em cima do tridente da imagem principal */}
        <img
          src="/logo_clean_v3.png"
          alt="TRINUS"
          className={cn(
            "absolute top-0 h-full w-auto object-contain left-[27.05px] md:left-[33.82px] transition-all duration-300",
            scrolled ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
          )}
        />
      </div>
    )
  }

  if (variant === "trident") {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src="/logo_clean_v3.png"
        alt="TRINUS Logo"
        className={cn("h-8 w-auto object-contain select-none shrink-0", className)}
      />
    )
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/trinus_final.png"
      alt="TRINUS Brand"
      className={cn("h-8 w-auto object-contain select-none shrink-0", className)}
    />
  )
}

