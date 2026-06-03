import * as React from "react"
import { cn } from "@/lib/utils"
import { BrandLogo } from "@/components/ui/brand-logo"

interface AuthCardProps {
  title: string
  description?: string
  children: React.ReactNode
  footer?: React.ReactNode
  className?: string
}

export function AuthCard({
  title,
  description,
  children,
  footer,
  className,
}: AuthCardProps) {
  return (
    <div className={cn("flex min-h-screen items-center justify-center bg-background px-5 py-10", className)}>
      <div className="absolute inset-0 -z-10 opacity-30" style={{ background: "var(--gradient-hero-ambient)" }} />
      
      <div className="w-full max-w-[420px] sm:max-w-[480px] md:max-w-[520px] rounded-2xl border border-border bg-card p-6 sm:p-10 shadow-card reveal visible">
        <div className="mb-8 text-center">
          <div className="mb-6 flex flex-col items-center gap-2">
            <BrandLogo variant="full" className="h-10 w-auto transition-all duration-300 hover:scale-[1.02]" />
          </div>
          <h1 className="text-h2 font-bold text-foreground">{title}</h1>
          {description && (
            <p className="mt-2 text-sm text-muted-foreground">{description}</p>
          )}
        </div>

        {children}

        {footer && (
          <div className="mt-8 border-t border-border pt-6 text-center text-sm text-muted-foreground">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
