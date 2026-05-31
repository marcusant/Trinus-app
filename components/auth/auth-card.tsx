import * as React from "react"
import { cn } from "@/lib/utils"

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
            <svg viewBox="0 0 40 40" className="w-12 h-12 fill-none stroke-primary stroke-[1.8] transition-all duration-300 hover:scale-105">
              <path d="M12 28V14L16 18L20 10L24 18L28 14V28" strokeLinejoin="round" strokeLinecap="round" />
              <path d="M20 10V30" strokeLinecap="round" />
              <circle cx="20" cy="30" r="1" fill="currentColor" />
            </svg>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-extrabold tracking-tight text-primary">TRINUS</span>
            </div>
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
