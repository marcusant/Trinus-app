"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

export function useLandingPage() {
  const [scrolled, setScrolled]   = useState(false)
  const [menuOpen, setMenuOpen]   = useState(false)
  const [openFaq, setOpenFaq]     = useState<number | null>(null)
  const supabase = createClient()

  // Redireciona para reset-password se chegou via link de recuperação
  useEffect(() => {
    if (typeof window === "undefined") return

    const redirect = () => {
      const hash   = window.location.hash   || ""
      const search = window.location.search || ""
      window.location.replace(`/reset-password${search}${hash}`)
    }

    const hash   = window.location.hash   || ""
    const search = window.location.search || ""
    const isRecoveryHash = hash.includes("type=recovery") || hash.includes("access_token=")
    const hasCode = new URLSearchParams(search).has("code")

    if (isRecoveryHash || hasCode) { redirect(); return }

    const { data: sub } = supabase.auth.onAuthStateChange(event => {
      if (event === "PASSWORD_RECOVERY") redirect()
    })
    return () => sub.subscription.unsubscribe()
  }, [supabase])

  // Navbar scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Scroll reveal
  useEffect(() => {
    const els = document.querySelectorAll(".reveal")
    const io  = new IntersectionObserver((entries) => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          setTimeout(() => e.target.classList.add("visible"), i * 80)
          io.unobserve(e.target)
        }
      })
    }, { threshold: 0.12 })
    els.forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [])

  const scrollTo = (id: string) => {
    setMenuOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  const toggleFaq = (i: number) => setOpenFaq(prev => prev === i ? null : i)

  return { scrolled, menuOpen, setMenuOpen, openFaq, toggleFaq, scrollTo }
}
