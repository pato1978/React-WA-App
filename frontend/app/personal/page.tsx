"use client"

import { useState } from "react"
import { HelpCircle } from "lucide-react"
import { saveExpense } from "@/lib/expense-actions"
import { iconMap } from "@/lib/icon-map"
import { availableIcons } from "@/lib/icon-options"
import { calculateTotalExpenses, calculatePercentageUsed } from "@/lib/budget-utils"

import { PageLayout } from "@/components/layout/page-layout"
import { PageHeader } from "@/components/layout/page-header"
import { MonthSelector } from "@/components/layout/month-selector"
import { BudgetSummaryCard } from "@/components/dashboard/budget-summary-card"
import ExpenseEditorModal from "@/components/modals/expense-editor-modal"
import BudgetEditorModal from "@/components/modals/budget-editor-modal"
import { VerbesserteLitenansicht } from "@/components/dashboard/verbesserte-listenansicht"
import { convertDateToISO } from "@/lib/utils"


import type { Expense } from "@/types"
import { useMonth } from "@/context/month-context"
import { useBudget } from "@/context/budget-context"

export default function PersonalPage() {
  const { currentDate, setCurrentDate } = useMonth()

  const {
    budget,
    setBudget,
    expenses,
    setExpenses,
    isLoading,
    refreshExpenses,
  } = useBudget()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)
  const [selectedIcon, setSelectedIcon] = useState<any>(null)
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false)

  // NEU: Aktuell ausgewählte Kategorie (von BudgetSummaryCard)
  const [selectedCategory, setSelectedCategory] = useState("gesamt")

  // ➕ Ausgaben hinzufügen
  const handleAdd = () => {
    setEditingExpense({
      id: "",
      name: "",
      amount: "",
      date: new Date().toISOString().split("T")[0],
      category: "",
      icon: HelpCircle,
      isPersonal: true,
      isShared: false,
      isChild: false,
      isRecurring: false,
      isBalanced: false,
    })
    setSelectedIcon(HelpCircle)
    setIsModalOpen(true)
  }

  // ✏️ Ausgaben bearbeiten
  const handleEdit = (e: Expense) => {
    setEditingExpense({
      ...e,
      date: convertDateToISO(e.date),
    })
    setSelectedIcon(iconMap[e.category] || HelpCircle)
    setIsModalOpen(true)
  }

  // 💾 Speichern
  const handleSave = async (exp: Expense) => {
    await saveExpense(exp, selectedIcon, setExpenses)
    refreshExpenses()
    setIsModalOpen(false)
    setEditingExpense(null)
  }

  // 🗑️ Löschen
  const deleteExpense = async (id: string) => {
    await fetch(`http://localhost:5289/api/expenses/${id}`, { method: "DELETE" })
    refreshExpenses()
  }

  // 💡 Filtern nach ausgewählter Kategorie („gesamt“ = keine Filterung)
  const filteredExpenses = selectedCategory === "gesamt"
      ? expenses
      : expenses.filter(e => e.category === selectedCategory)

  // 🧩 Icon zum Expense mappen (für Anzeige in Listenansicht)
  const mapped = filteredExpenses.map(e => ({
    ...e,
    icon: iconMap[e.category] || HelpCircle,
  }))
  const totalExpenses = calculateTotalExpenses(filteredExpenses)
  const percentageUsed = calculatePercentageUsed(totalExpenses, budget)
  return (
      <PageLayout onAddButtonClick={handleAdd}>
        <div className="page-header-container">
          <PageHeader title="Persönlich" />
          <MonthSelector />
        </div>

        <div className="flex-1 px-4 pb-6 mt-8 flex flex-col overflow-hidden">
          <div className="bg-white shadow-md rounded-lg p-4 flex-1 flex flex-col overflow-hidden mb-0">

            {/* 🔢 Zusammenfassung mit Kategorie-Umschalter */}
            <BudgetSummaryCard
                title="Monatliche Ausgaben"
                budget={budget}
                totalExpenses={totalExpenses}
                percentageUsed={percentageUsed}
                onBudgetClick={() => setIsBudgetModalOpen(true)}
                onCategoryChange={(newCat) => {
                  setSelectedCategory(newCat) // ← Wichtig: setzt die Filterkategorie
                }}
            />

            {/* 🧾 Anzeige der Einträge */}
            {isLoading ? (
                <div className="text-center text-sm text-gray-500 py-8">🔄 Lade Ausgaben…</div>
            ) : (
                <VerbesserteLitenansicht
                    expenses={mapped}
                    onDelete={deleteExpense}
                    onEdit={handleEdit}
                />
            )}
          </div>
        </div>

        {/* ➕ Modal für neue/bearbeitete Ausgabe */}
        <ExpenseEditorModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            expense={editingExpense}
            onSave={handleSave}
            availableIcons={availableIcons}
        />

        {/* 💰 Modal für Budget bearbeiten */}
        <BudgetEditorModal
            isOpen={isBudgetModalOpen}
            onClose={() => setIsBudgetModalOpen(false)}
            currentBudget={budget}
            onSave={b => {
              setBudget(b)
              setIsBudgetModalOpen(false)
            }}
        />
      </PageLayout>
  )
}
