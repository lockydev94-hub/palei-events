"use client"

import { useState, useEffect, useCallback } from "react"
import { Search, X } from "lucide-react"

interface Command {
  key: string
  label: string
  description?: string
  action: () => void
}

const CommandPalette: React.FC<{
  open: boolean
  setOpen: (open: boolean) => void
  onExecute: (key: string) => void
}> = ({ open, setOpen, onExecute }) => {
  const [query, setQuery] = useState("")
  const [commands, setCommands] = useState<Command[]>([])

  // Initialize commands based on context
  useEffect(() => {
    const defaultCommands: Command[] = [
      { key: "new-event", label: "Create new event", action: () => onExecute("new-event") },
      { key: "toggle-flag", label: "Toggle feature flag", action: () => onExecute("toggle-flag") },
      { key: "announce", label: "Create announcement", action: () => onExecute("announce") },
    ]
    setCommands(defaultCommands)
  }, [onExecute])

  const handleInputKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setOpen(false)
      setQuery("")
      return
    }

    if (e.key === "Enter") {
      if (query.startsWith("/")) {
        const cmd = query.slice(1).trim().toLowerCase()
        const command = commands.find((c) => c.key === cmd)
        if (command) {
          command.action()
          setOpen(false)
          setQuery("")
        }
      } else {
        setOpen(false)
      }
      e.preventDefault()
    }
  }, [query, commands, onExecute])

  const handleWindowKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") {
      setOpen(false)
      setQuery("")
    }
  }, [])

  useEffect(() => {
    window.addEventListener("keydown", handleWindowKeyDown)
    return () => window.removeEventListener("keydown", handleWindowKeyDown)
  }, [handleWindowKeyDown])

  const filtered = commands.filter((c) =>
    c.label.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div
      className={`
        fixed inset-0 z-50 bg-navy-dark/90 backdrop-blur-xl
        transition-opacity duration-300
        ${open ? "opacity-100" : "opacity-0 pointer-events-auto"}
        ${!open ? "opacity-0 pointer-events-none" : ""}
      `}
    >
      <div className="min-h-screen p-6 pt-16">
        <div className="max-w-md mx-auto">
          <div className="bg-navy-dark border border-white/10 rounded-xl p-4 shadow-xl">
            <div className="flex items-start gap-3">
              <Search className="w-5 h-5 text-gold-light flex-shrink-0 mt-0.5" />
              <input
                type="text"
                placeholder="Type / for commands or search..."
                value={query}
                onInput={(e) => setQuery((e.target as HTMLInputElement).value)}
                onKeyDown={handleInputKeyDown}
                className="bg-navy-dark w-full rounded-xl px-3 py-2 text-gold-light outline-none placeholder-gold-light text-sm transition-colors"
                readOnly={!open}
              />
              <X
                className="w-5 h-5 text-gold-light/60 hover:text-gold transition-colors cursor-pointer"
                onClick={() => { setOpen(false); setQuery("") }}
                aria-label="Close"
              />
            </div>

            {open && (
              <div className="mt-3 max-h-80 overflow-y-auto">
                {/* Search results */}
                {query && !query.startsWith("/") && (
                  <div className="mb-3">
                    <p className="text-xs text-muted/60 uppercase tracking-wider mb-1">Results:</p>
                    <p className="text-sm text-gold-light/60">No matching items found</p>
                  </div>
                )}

                {/* Commands */}
                {filtered.length > 0 && (
                  <div className="space-y-1 max-h-40 overflow-y-auto">
                    {filtered.map((cmd) => (
                      <div
                        key={cmd.key}
                        className="px-2 py-1 rounded-md hover:bg-gold/10 transition-colors cursor-pointer"
                        onClick={() => { onExecute(cmd.key); setOpen(false); }}
                        role="button"
                        tabIndex={0}
                      >
                        <span className="font-medium text-gold-light">{cmd.label}</span>
                        {cmd.description && <span className="text-xs text-gold-light/60 ml-2">{cmd.description}</span>}
                      </div>
                    ))}
                  </div>
                )}

                {/* Recent items placeholder */}
                {!filtered.length && query && (
                  <p className="text-xs text-muted/60 py-2">No commands match</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CommandPalette