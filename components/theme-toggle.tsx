"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isShaking, setIsShaking] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="w-12 h-12 rounded-lg bg-gray-200 dark:bg-gray-800 animate-pulse" />
  }

  const isDark = theme === "dark"

  const toggleTheme = () => {
    // Trigger shake animation
    setIsShaking(true)
    setTimeout(() => setIsShaking(false), 600)

    // Toggle theme after a short delay for effect
    setTimeout(() => {
      setTheme(isDark ? "light" : "dark")
    }, 200)
  }

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "relative w-12 h-12 rounded-lg transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
        isDark
          ? "bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-gray-600"
          : "bg-gradient-to-br from-gray-200 to-gray-300 border-2 border-gray-400",
        isShaking && "animate-pulse",
      )}
      style={{
        transform: isShaking ? "rotate(-5deg)" : "rotate(0deg)",
        animation: isShaking ? "shake 0.6s ease-in-out" : "none",
      }}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      {/* Turnbuckle pad */}
      <div
        className={cn(
          "absolute inset-1 rounded transition-all duration-200",
          isDark
            ? "bg-gradient-to-br from-red-900 to-red-800 border border-red-700"
            : "bg-gradient-to-br from-red-400 to-red-500 border border-red-600",
        )}
      >
        {/* Corner details */}
        <div className="absolute top-0 left-0 w-2 h-2 bg-yellow-400 rounded-full opacity-80"></div>
        <div className="absolute top-0 right-0 w-2 h-2 bg-yellow-400 rounded-full opacity-80"></div>
        <div className="absolute bottom-0 left-0 w-2 h-2 bg-yellow-400 rounded-full opacity-80"></div>
        <div className="absolute bottom-0 right-0 w-2 h-2 bg-yellow-400 rounded-full opacity-80"></div>

        {/* Center icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          {isDark ? (
            <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-gray-800" fill="currentColor" viewBox="0 0 20 20">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: rotate(0deg); }
          10% { transform: rotate(-8deg) scale(1.05); }
          20% { transform: rotate(8deg) scale(1.05); }
          30% { transform: rotate(-6deg) scale(1.03); }
          40% { transform: rotate(6deg) scale(1.03); }
          50% { transform: rotate(-4deg) scale(1.02); }
          60% { transform: rotate(4deg) scale(1.02); }
          70% { transform: rotate(-2deg) scale(1.01); }
          80% { transform: rotate(2deg) scale(1.01); }
          90% { transform: rotate(-1deg); }
        }
      `}</style>
    </button>
  )
}
