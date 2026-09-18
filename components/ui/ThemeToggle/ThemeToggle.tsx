"use client"

import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"

const ThemeToggle: React.FC = () => {
  const [isDark, setIsDark] = useState(() => {
    // Check localStorage or prefers-color-scheme
    const saved = localStorage.getItem("palei-theme")
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    return saved ? saved === "dark" : prefersDark
  })

  useEffect(() => {
    const html = document.documentElement
    const body = document.body

    if (isDark) {
      html.setAttribute("data-theme", "dark")
      body.classList.add("dark")
      localStorage.setItem("palei-theme", "dark")
    } else {
      html.setAttribute("data-theme", "light")
      body.classList.remove("dark")
      localStorage.setItem("palei-theme", "light")
    }
  }, [isDark])

  return (
    <div
      onClick={() => setIsDark((prev) => !prev)}
      className="relative p-2 rounded-md hover:bg-gold/10 transition-colors cursor-pointer"
      aria-label="Toggle theme"
    >
      <Moon
        className={`w-5 h-5 text-gold-light ${isDark ? "block" : "hidden"}`
        }
      />
      <Sun
        className={`w-5 h-5 text-gold-light ${isDark ? "hidden" : "block"}`
        }
      />
    </div>
  )
}

export default ThemeToggle