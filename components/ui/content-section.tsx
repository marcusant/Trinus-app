import * as React from "react"
import { cn } from "@/lib/utils"

interface ContentSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  icon?: React.ReactNode
  children: React.ReactNode
}

export function ContentSection({
  title,
  icon,
  children,
  className,
  ...props
}: ContentSectionProps) {
  return (
    <div 
      className={cn(
        "bg-card border border-border rounded-2xl p-6 shadow-sm reveal visible",
        className
      )} 
      {...props}
    >
      <div className="flex items-center gap-3 mb-6">
        {icon && (
          <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            {icon}
          </div>
        )}
        <h2 className="text-xl font-bold tracking-tight text-foreground">{title}</h2>
      </div>
      {children}
    </div>
  )
}
