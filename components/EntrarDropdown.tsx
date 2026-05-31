"use client"

import Link from "next/link"
import { useState, useRef, useEffect } from "react"
import { User, Dumbbell, BookOpen } from "lucide-react"

export function EntrarDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="relative group" ref={dropdownRef}>
      <Link 
        href="/login"
        className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
        onClick={() => setIsOpen(false)}
      >
        <User className="h-4 w-4" /> Entrar
      </Link>
      
      {/* Invisible bridge with pt-2 so the mouse doesn't leave the group when crossing the gap */}
      <div 
        className={`absolute right-0 top-full pt-2 w-48 z-50 transition-all duration-200 invisible opacity-0 translate-y-1 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 ${
          isOpen ? "!visible !opacity-100 !translate-y-0" : ""
        }`}
      >
        <div className="rounded-md border border-border bg-card/95 backdrop-blur-xl p-1 shadow-md">
          <Link 
            href="/login" 
            className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground cursor-pointer"
            onClick={() => setIsOpen(false)}
          >
            <Dumbbell className="h-4 w-4" />
            <span>Treino</span>
          </Link>
          <a 
            href="https://aluno.cakto.com.br/auth/login" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground cursor-pointer"
            onClick={() => setIsOpen(false)}
          >
            <BookOpen className="h-4 w-4" />
            <span>Programa</span>
          </a>
        </div>
      </div>
    </div>
  )
}
