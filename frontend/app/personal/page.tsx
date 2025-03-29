"use client"

import { useState } from "react"
import { ShoppingCart, Utensils, Fuel, Film, Tv, Pill, BookOpen, Coffee, ShoppingBag } from "lucide-react"
import { PageLayout } from "@/components/layout/page-layout"
import { PageHeader } from "@/components/layout/page-header"
import { MonthSelector } from "@/components/layout/month-selector"
import { BudgetSummaryCard } from "@/components/dashboard/budget-summary-card"
import ExpenseEditorModal from "@/components/modals/expense-editor-modal"
import BudgetEditorModal from "@/components/modals/budget-editor-modal"
import type { Expense, IconOption } from "@/types"
import { convertDateToISO, convertDateToDisplay } from "@/lib/utils"
import { VerbesserteLitenansicht } from "@/components/dashboard/verbesserte-listenansicht"

export default function PersonalPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [expenses, setExpenses] = useState<Expense[]>([
    {
      id: 1,
      name: "Supermarkt",
      amount: "€42.50",
      date: "Heute",
      category: "Lebensmittel",
      icon: ShoppingCart,
      isPersonal: true,
      isChild: false,
      isRecurring: false,
    },
    {
      id: 2,
      name: "Restaurant",
      amount: "€28.75",
      date: "14.03.2025",
      category: "Essen",
      icon: Utensils,
      isPersonal: true,
      isChild: false,
      isRecurring: false,
    },
    {
      id: 3,
      name: "Tankstelle",
      amount: "€65.20",
      date: "12.03.2025",
      category: "Transport",
      icon: Fuel,
      isPersonal: true,
      isChild: false,
      isRecurring: false,
    },
    {
      id: 4,
      name: "Streaming",
      amount: "€12.99",
      date: "10.03.2025",
      category: "Unterhaltung",
      icon: Tv,
      isPersonal: true,
      isChild: false,
      isRecurring: true,
    },
    {
      id: 5,
      name: "Kino",
      amount: "€22.00",
      date: "08.03.2025",
      category: "Unterhaltung",
      icon: Film,
      isPersonal: true,
      isChild: false,
      isRecurring: false,
    },
    {
      id: 6,
      name: "Apotheke",
      amount: "€18.75",
      date: "05.03.2025",
      category: "Gesundheit",
      icon: Pill,
      isPersonal: true,
      isChild: false,
      isRecurring: false,
    },
    {
      id: 7,
      name: "Buchhandlung",
      amount: "€24.99",
      date: "03.03.2025",
      category: "Bildung",
      icon: BookOpen,
      isPersonal: true,
      isChild: false,
      isRecurring: false,
    },
    {
      id: 8,
      name: "Café",
      amount: "€8.50",
      date: "02.03.2025",
      category: "Essen",
      icon: Coffee,
      isPersonal: true,
      isChild: false,
      isRecurring: false,
    },
    {
      id: 9,
      name: "Kleidung",
      amount: "€79.95",
      date: "01.03.2025",
      category: "Shopping",
      icon: ShoppingBag,
      isPersonal: true,
      isChild: false,
      isRecurring: false,
    },
  ])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)
  const [selectedIcon, setSelectedIcon] = useState<any>(null)
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false)
  const [budget, setBudget] = useState(1200)

  // Verfügbare Icons für den Icon-Selektor
  const availableIcons: IconOption[] = [
    { icon: ShoppingCart, name: "Einkaufen", defaultLabel: "Einkaufen" },
    { icon: Utensils, name: "Restaurant", defaultLabel: "Restaurant" },
    { icon: Fuel, name: "Tankstelle", defaultLabel: "Tankstelle" },
    { icon: Tv, name: "Streaming", defaultLabel: "Streaming" },
    { icon: Film, name: "Kino", defaultLabel: "Kino" },
    { icon: Pill, name: "Apotheke", defaultLabel: "Apotheke" },
    { icon: BookOpen, name: "Bücher", defaultLabel: "Bücher" },
    { icon: Coffee, name: "Café", defaultLabel: "Café" },
    { icon: ShoppingBag, name: "Kleidung", defaultLabel: "Kleidung" },
  ]

  // Öffne Modal für neue Ausgabe
  const handleAddButtonClick = () => {
    setEditingExpense({
      id: null,
      name: "",
      amount: "",
      date: new Date().toISOString().split("T")[0],
      category: "",
      icon: ShoppingCart,
      isPersonal: true,
      isChild: false,
      isRecurring: false,
    })
    setSelectedIcon(ShoppingCart)
    setIsModalOpen(true)
  }

  // Öffne Modal für bestehende Ausgabe
  const handleEditExpense = (expense: Expense) => {
    setEditingExpense({
      ...expense,
      date: convertDateToISO(expense.date),
      isChild: expense.isChild || false,
      isRecurring: expense.isRecurring || false,
    })
    setSelectedIcon(expense.icon)
    setIsModalOpen(true)
  }

  // Speichere Ausgabe (neu oder bearbeitet)
  const handleSaveExpense = (expense: Expense) => {
    if (!expense) return

    // Formatiere Datum für die Anzeige
    const formattedDate = convertDateToDisplay(expense.date)

    const updatedExpense = {
      ...expense,
      date: formattedDate,
      icon: selectedIcon || expense.icon,
    }

    if (expense.id) {
      // Bestehende Ausgabe aktualisieren
      setExpenses(expenses.map((exp) => (exp.id === expense.id ? updatedExpense : exp)))
    } else {
      // Neue Ausgabe hinzufügen
      const newId = Math.max(...expenses.map((exp) => exp.id), 0) + 1
      setExpenses([{ ...updatedExpense, id: newId }, ...expenses])
    }

    setIsModalOpen(false)
    setEditingExpense(null)
  }

  // Funktion zum Löschen einer Ausgabe
  const deleteExpense = (id: number) => {
    setExpenses(expenses.filter((expense) => expense.id !== id))
  }

  const handleSaveBudget = (newBudget: number) => {
    setBudget(newBudget)
    setIsBudgetModalOpen(false)
  }

  // Berechne die Summe aller Ausgaben
  const totalExpenses = 850 // Fester Wert für dieses Beispiel

  // Berechne den Prozentsatz des verbrauchten Budgets
  const percentageUsed = Math.min(100, Math.round((totalExpenses / budget) * 100))

  return (
    <PageLayout onAddButtonClick={handleAddButtonClick}>
      {/* Header Area */}
      <div className="page-header-container">
        <PageHeader title="Persönlich" />
        <MonthSelector initialDate={currentDate} onChange={setCurrentDate} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 px-4 pb-6 mt-8 flex flex-col overflow-hidden">
        <div className="bg-white shadow-md rounded-lg p-4 flex-1 flex flex-col overflow-hidden mb-0">
          <BudgetSummaryCard
            title="Monatliche Ausgaben"
            budget={budget}
            expenses={totalExpenses}
            percentageUsed={percentageUsed}
            onBudgetClick={() => setIsBudgetModalOpen(true)}
            onTitleClick={() => console.log("Persönliche Gesamtübersicht anzeigen")}
          />

          <VerbesserteLitenansicht expenses={expenses} onDelete={deleteExpense} onEdit={handleEditExpense} />
        </div>
      </div>

      {/* Ausgaben-Editor-Modal */}
      <ExpenseEditorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        expense={editingExpense}
        onSave={handleSaveExpense}
        availableIcons={availableIcons}
      />

      {/* Budget-Editor-Modal */}
      <BudgetEditorModal
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
        currentBudget={budget}
        onSave={handleSaveBudget}
      />
    </PageLayout>
  )
}

