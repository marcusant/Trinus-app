"use client"

import { useRef } from "react"
import { Star } from "lucide-react"
import { AvatarSeeded as Avatar } from "@/components/ui/avatar-stack"
import { DEPOIMENTOS } from "@/constants/landing"

export function LandingDepoimentos() {
  const trackRef = useRef<HTMLDivElement>(null)
  const items    = [...DEPOIMENTOS, ...DEPOIMENTOS] // loop infinito

  return (
    <section id="depoimentos" className="overflow-hidden bg-background px-0 section-padding">
      <div className="mx-auto max-w-5xl px-5 text-center reveal">
        <h2 className="text-h2 font-bold">Quem vive o Trinus, não volta atrás</h2>
      </div>

      <div className="mt-14 overflow-hidden">
        <div ref={trackRef} className="flex w-max gap-7 animate-scroll-x px-5">
          {items.map((d, i) => (
            <article key={i} className="flex w-80 flex-shrink-0 flex-col rounded-2xl border border-border bg-card p-7">
              <div className="flex items-center gap-4">
                <Avatar size="lg" ring="primary" initials={d.name} colorToken={d.colorToken} />
                <div>
                  <p className="font-semibold text-foreground">{d.name}, {d.age}</p>
                  <p className="text-sm text-muted-foreground">{d.role}</p>
                </div>
              </div>

              <div className="mt-4 flex gap-0.5">
                {[1, 2, 3, 4, 5].map(s => <Star key={s} className="h-4 w-4 fill-primary text-primary" />)}
              </div>

              <p className="mt-4 italic leading-relaxed text-muted-foreground">"{d.text}"</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
