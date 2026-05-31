import * as React from "react"
import { cn } from "@/lib/utils"

interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string
  value: string | number
  delta?: {
    value: string | number
    type: "positive" | "negative" | "neutral"
  }
  icon?: React.ReactNode
}

export function StatCard({
  label,
  value,
  delta,
  icon,
  className,
  ...props
}: StatCardProps) {
  return (
    <div 
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-glow",
        className
      )} 
      {...props}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
          {label}
        </span>
        {icon && (
          <span className="text-primary opacity-70 group-hover:opacity-100 transition-opacity">
            {icon}
          </span>
        )}
      </div>
      
      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-3xl font-bold tracking-tight text-foreground">
          {value}
        </span>
        {delta && (
          <span className={cn(
            "text-xs font-semibold",
            delta.type === "positive" && "text-success",
            delta.type === "negative" && "text-destructive",
            delta.type === "neutral" && "text-muted-foreground"
          )}>
            {delta.type === "positive" ? "+" : ""}{delta.value}
          </span>
        )}
      </div>

      {/* Underline glow subtle */}
      <div className="absolute bottom-0 left-0 h-[2px] w-full scale-x-0 bg-primary opacity-50 transition-transform duration-500 group-hover:scale-x-100" />
    </div>
  )
}
