"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface AvatarStackProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function AvatarStack({ children, className, ...props }: AvatarStackProps) {
  return (
    <div className={cn("flex -space-x-3 overflow-hidden", className)} {...props}>
      {children}
    </div>
  )
}

interface AvatarSeededProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  seed?: number
  size?: "sm" | "md" | "lg"
  ring?: "none" | "subtle" | "primary"
  initials?: string
  colorToken?: string
}

export function AvatarSeeded({ 
  seed, 
  size = "md", 
  ring = "none", 
  initials, 
  colorToken,
  className,
  ...props 
}: AvatarSeededProps) {
  const sizeClasses = {
    sm: "h-6 w-6 text-[10px]",
    md: "h-8 w-8 text-xs",
    lg: "h-12 w-12 text-base",
  }

  const ringClasses = {
    none: "",
    subtle: "ring-2 ring-background",
    primary: "ring-2 ring-primary",
  }

  const bgStyle = colorToken ? { backgroundColor: colorToken } : {}

  return (
    <div 
      className={cn(
        "inline-flex items-center justify-center rounded-full bg-muted font-medium text-muted-foreground",
        sizeClasses[size],
        ringClasses[ring],
        className
      )}
      style={bgStyle}
    >
      {initials ? (
        <span>{initials.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}</span>
      ) : (
        <img
          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`}
          alt="Avatar"
          className="h-full w-full rounded-full"
          {...props}
        />
      )}
    </div>
  )
}

export { AvatarSeeded as Avatar }
