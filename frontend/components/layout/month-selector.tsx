"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { formatMonthYear } from "@/lib/utils"

interface MonthSelectorProps {
  initialDate?: Date
  onChange?: (date: Date) => void
}

export function MonthSelector({ initialDate = new Date(), onChange }: MonthSelectorProps) {
  const [currentDate, setCurrentDate] = useState(initialDate)

  // Functions to navigate between months
  const goToPreviousMonth = () => {
    const newDate = new Date(currentDate)
    newDate.setMonth(newDate.getMonth() - 1)
    setCurrentDate(newDate)
    onChange?.(newDate)
  }

  const goToNextMonth = () => {
    const newDate = new Date(currentDate)
    newDate.setMonth(newDate.getMonth() + 1)
    setCurrentDate(newDate)
    onChange?.(newDate)
  }

  return (
    <div className="flex justify-between items-center bg-white shadow-sm rounded-lg p-3 w-[70%] border border-gray-100">
      <button
        onClick={goToPreviousMonth}
        className="p-2 flex items-center justify-center rounded-full active:bg-gray-200 transition-colors"
        aria-label="Vorheriger Monat"
      >
        <ChevronLeft className="h-5 w-5 text-blue-500" />
      </button>
      <div className="font-medium text-gray-700">{formatMonthYear(currentDate)}</div>
      <button
        onClick={goToNextMonth}
        className="p-2 flex items-center justify-center rounded-full active:bg-gray-200 transition-colors"
        aria-label="Nächster Monat"
      >
        <ChevronRight className="h-5 w-5 text-blue-500" />
      </button>
    </div>
  )
}

