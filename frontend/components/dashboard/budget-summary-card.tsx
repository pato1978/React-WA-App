"use client"

import { useState } from "react"
import {availableIcons} from "@/lib/icon-options";
interface BudgetSummaryCardProps {
  title: string
  budget: number
  totalExpenses?: number
  percentageUsed?: number
  onBudgetClick: () => void
  onTitleClick?: () => void
  onCategoryChange?: (category: string) => void
}

export function BudgetSummaryCard({
  title,
  budget,
  totalExpenses = 0,
  percentageUsed = 0,
  onBudgetClick,
  onTitleClick,
  onCategoryChange
}: BudgetSummaryCardProps) {
  const [categoryText, setCategoryText] = useState("gesamt")
  const hideBudget = categoryText !== "gesamt"

  // Stelle sicher, dass expenses ein gültiger Wert ist
  const safeExpenses = typeof totalExpenses === "number" ? totalExpenses : 0
  // Berechne percentageUsed falls nicht übergeben
  const safePercentageUsed =
    typeof percentageUsed === "number" ? percentageUsed : Math.min(100, Math.round((safeExpenses / budget) * 100))



  const chooseCategory = (categoryText) => {
      let newCategory = "gesamt";
      if (categoryText === "gesamt") {
      newCategory = availableIcons[0].name;
   }

   else {
     const index = availableIcons.findIndex(icon => icon.name === categoryText);
     if (index > -1) {
       const nextIndex = index + 1;
       newCategory = nextIndex < availableIcons.length ? availableIcons[nextIndex].name : "gesamt"
     }
   }
      setCategoryText(newCategory)
      // Callback an Parent auslösen
      if (onCategoryChange) {
          onCategoryChange(newCategory)
      }
  };

  return (
    <div className={`p-4 rounded-lg bg-gradient-to-r from-blue-50 via-blue-100 to-blue-50 ${hideBudget ? "pb-2" : ""}`}>
      <h4
        className="text-lg font-semibold text-black mb-3 cursor-pointer hover:opacity-80 transition-opacity"
        onClick={onTitleClick || (() => console.log(`${title} Übersicht anzeigen`))}
      >
        <div className="flex justify-between items-center">
          <span>{title}</span>
          <span
            className="text-blue-600 text-base font-semibold cursor-pointer"
            onClick={(e) => {
              e.stopPropagation()
              chooseCategory(categoryText)
              //setCategoryText(categoryText === "gesamt" ? "Freizeit" : "gesamt")
            }}
          >
            {categoryText}
          </span>
        </div>
      </h4>

      {hideBudget ? (
        // Freizeit-Ansicht - vereinfacht
        <div className="flex justify-between items-center py-2">
          <span className="text-gray-600 font-normal">Ausgegeben:</span>
          <span className="font-bold">€{safeExpenses.toFixed(2)}</span>
        </div>
      ) : (
        // Normale Budget-Ansicht
        <>
          {/* Budget - klickbar */}
          <div className="flex justify-between items-center mb-1">
            <button
              className="flex items-center text-gray-600 hover:text-blue-600 transition-colors font-normal"
              onClick={onBudgetClick}
            >
              <span>Budget:</span>
              <span className="ml-1 text-xs text-blue-600">(bearbeiten)</span>
            </button>
            <span className="font-normal">€{budget}</span>
          </div>

          {/* Ausgegeben */}
          <div className="flex justify-between items-center mb-3">
            <span className="text-gray-600 font-normal">Ausgegeben:</span>
            <span className="font-normal">€{safeExpenses.toFixed(2)}</span>
          </div>

          {/* Verfügbar - mit mehr Abstand und grüner Farbe */}
          <div className="flex justify-between items-center mt-2">
            <span className="text-gray-600">Verfügbar:</span>
            <span className="font-bold text-green-600">€{(budget - safeExpenses).toFixed(2)}</span>
          </div>

          {/* Progress bar */}
          <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 rounded-full" style={{ width: `${safePercentageUsed}%` }}></div>
          </div>
          <div className="text-right text-sm text-gray-500 mt-1">{safePercentageUsed}% verbraucht</div>
        </>
      )}
    </div>
  )
}

export default BudgetSummaryCard

