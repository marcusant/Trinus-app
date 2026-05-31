import * as React from "react"
import { cn } from "@/lib/utils"

interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  eyebrow?: string
  title: string
  description?: string
  align?: "left" | "center"
}

export function PageHeader({
  eyebrow,
  title,
  description,
  align = "left",
  className,
  ...props
}: PageHeaderProps) {
  return (
    <div 
      className={cn(
        "reveal flex flex-col gap-2", 
        align === "center" && "items-center text-center",
        className
      )} 
      {...props}
    >
      {eyebrow && (
        <span className="text-eyebrow text-primary">
          {eyebrow}
        </span>
      )}
      <h2 className="text-h2 font-bold text-foreground">
        {title}
      </h2>
      {description && (
        <p className="max-w-container-text text-lg text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  )
}
