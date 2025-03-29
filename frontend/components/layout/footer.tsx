"use client"

import { Home, BarChart3 } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { EnhancedPlusButton } from "@/components/ui/enhanced-plus-button"

interface FooterProps {
  onAddButtonClick?: () => void
  showAddButton?: boolean
}

export function Footer({ onAddButtonClick, showAddButton = true }: FooterProps) {
  const router = useRouter()
  const pathname = usePathname()

  const isStatisticsActive = pathname === "/statistics"

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-blue-600 text-white h-16 flex items-center justify-around z-10 max-w-md mx-auto">
      <button
        className={`p-4 ${isStatisticsActive ? "" : "bg-blue-700"} active:bg-blue-600 transition-colors rounded-full`}
        onClick={() => router.push("/")}
        aria-label="Dashboard"
      >
        <Home className="h-6 w-6" />
      </button>

      {showAddButton && (
        <div className="relative -mt-10 active:scale-95 transition-transform duration-150">
          <EnhancedPlusButton variant="outline" onClick={onAddButtonClick} />
        </div>
      )}

      <button
        className={`p-4 ${isStatisticsActive ? "bg-blue-700" : ""} active:bg-blue-600 transition-colors rounded-full`}
        onClick={() => router.push("/statistics")}
        aria-label="Statistiken"
      >
        <BarChart3 className="h-6 w-6" />
      </button>
    </footer>
  )
}

