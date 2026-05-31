import * as React from "react"
import { cn } from "@/lib/utils"

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  bg?: "default" | "card" | "footer" | "muted"
  container?: "default" | "wide" | "narrow" | "text" | "none"
}

export function Section({
  children,
  className,
  bg = "default",
  container = "default",
  ...props
}: SectionProps) {
  const bgClasses = {
    default: "bg-background",
    card: "bg-card",
    footer: "bg-footer",
    muted: "bg-muted",
  }

  const containerClasses = {
    default: "max-w-container-default",
    wide: "max-w-container-wide",
    narrow: "max-w-container-narrow",
    text: "max-w-container-text",
    none: "",
  }

  return (
    <section 
      className={cn("section-padding", bgClasses[bg], className)} 
      {...props}
    >
      {container !== "none" ? (
        <div className={cn("mx-auto px-5", containerClasses[container])}>
          {children}
        </div>
      ) : (
        children
      )}
    </section>
  )
}
