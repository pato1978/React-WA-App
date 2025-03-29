"use client"

import { useState } from "react"
import {
  Shirt,
  GraduationCap,
  Utensils,
  Gamepad2,
  Palette,
  Stethoscope,
  Bed,
  Car,
  Cake,
  Users,
  Wallet,
  HelpCircle,
} from "lucide-react"
import { PageLayout } from "@/components/layout/page-layout"
import { PageHeader } from "@/components/layout/page-header"
import { MonthSelector } from "@/components/layout/month-selector"
import { BudgetSummaryCard } from "@/components/dashboard/budget-summary-card"
import ExpenseEditorModal from "@/components/modals/expense-editor-modal"
import BudgetEditorModal from "@/components/modals/budget-editor-modal"
import type { Expense, IconOption } from "@/types"
import { convertDateToISO, convertDateToDisplay, extractAmountValue } from "@/lib/utils"
import { VerbesserteLitenansicht } from "@/components/dashboard/verbesserte-listenansicht"

export default function ChildPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [expenses, setExpenses] = useState<Expense[]>([
    {
      id: 1,
      name: "Kinderkleidung",
      amount: "€45.99",
      date: "02.03.2025",
      category: "Kleidung",
      icon: Shirt,
      isPersonal: false,
      isChild: true,
      isRecurring: false,
    },
    {
      id: 2,
      name: "Schulmaterial",
      amount: "€32.50",
      date: "05.03.2025",
      category: "Schule",
      icon: GraduationCap,
      isPersonal: false,
      isChild: true,
      isRecurring: false,
    },
    {
      id: 3,
      name: "Mittagessen",
      amount: "€25.00",
      date: "08.03.2025",
      category: "Essen",
      icon: Utensils,
      isPersonal: false,
      isChild: true,
      isRecurring: true,
    },
    {
      id: 4,
      name: "Malkurs",
      amount: "€18.50",
      date: "10.03.2025",
      category: "Hobbys",
      icon: Palette,
      isPersonal: false,
      isChild: true,
      isRecurring: false,
    },
    {
      id: 5,
      name: "Nintendo Switch",
      amount: "€29.99",
      date: "12.03.2025",
      category: "Spielzeug",
      icon: Gamepad2,
      isPersonal: false,
      isChild: true,
      isRecurring: false,
    },
    {
      id: 6,
      name: "Kinderarzt",
      amount: "€10.00",
      date: "15.03.2025",
      category: "Gesundheit",
      icon: Stethoscope,
      isPersonal: false,
      isChild: true,
      isRecurring: false,
    },
    {
      id: 7,
      name: "Kinderbett",
      amount: "€199.99",
      date: "18.03.2025",
      category: "Kinderzimmer",
      icon: Bed,
      isPersonal: false,
      isChild: true,
      isRecurring: false,
    },
    {
      id: 8,
      name: "Busticket",
      amount: "€15.00",
      date: "20.03.2025",
      category: "Transport",
      icon: Car,
      isPersonal: false,
      isChild: true,
      isRecurring: true,
    },
    {
      id: 9,
      name: "Geburtstagsfeier",
      amount: "€85.00",
      date: "Heute",
      category: "Geburtstage",
      icon: Cake,
      isPersonal: false,
      isChild: true,
      isRecurring: false,
    },
    {
      id: 10,
      name: "Kita-Gebühren",
      amount: "€120.00",
      date: "01.03.2025",
      category: "Betreuung",
      icon: Users,
      isPersonal: false,
      isChild: true,
      isRecurring: true,
    },
    {
      id: 11,
      name: "Sparkonto",
      amount: "€50.00",
      date: "03.03.2025",
      category: "Finanzen",
      icon: Wallet,
      isPersonal: false,
      isChild: true,
      isRecurring: true,
    },
    {
      id: 12,
      name: "Diverses",
      amount: "€22.50",
      date: "22.03.2025",
      category: "Sonstiges",
      icon: HelpCircle,
      isPersonal: false,
      isChild: true,
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
    { icon: Shirt, name: "Kleidung", defaultLabel: "Kleidung" },
    { icon: GraduationCap, name: "Schule", defaultLabel: "Schule" },
    { icon: Utensils, name: "Essen", defaultLabel: "Essen" },
    { icon: Palette, name: "Hobbys", defaultLabel: "Hobbys" },
    { icon: Gamepad2, name: "Spielzeug", defaultLabel: "Spielzeug" },
    { icon: Stethoscope, name: "Gesundheit", defaultLabel: "Gesundheit" },
    { icon: Bed, name: "Kinderzimmer", defaultLabel: "Kinderzimmer" },
    { icon: Car, name: "Transport", defaultLabel: "Transport" },
    { icon: Cake, name: "Geburtstage", defaultLabel: "Geburtstage" },
    { icon: Users, name: "Betreuung", defaultLabel: "Betreuung" },
    { icon: Wallet, name: "Finanzen", defaultLabel: "Finanzen" },
    { icon: HelpCircle, name: "Sonstiges", defaultLabel: "Sonstiges" },
  ]

  // Öffne Modal für neue Ausgabe
  const handleAddButtonClick = () => {
    setEditingExpense({
      id: null,
      name: "",
      amount: "",
      date: new Date().toISOString().split("T")[0],
      category: "",
      icon: Shirt,
      isPersonal: false,
      isChild: true,
      isRecurring: false,
    })
    setSelectedIcon(Shirt)
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
  const totalExpenses = expenses.reduce((sum, expense) => {
    return sum + extractAmountValue(expense.amount)
  }, 0)

  // Berechne den Prozentsatz des verbrauchten Budgets
  const percentageUsed = Math.min(100, Math.round((totalExpenses / budget) * 100))

  return (
    <PageLayout onAddButtonClick={handleAddButtonClick}>
      {/* Header Area */}
      <div className="page-header-container">
        <PageHeader title="Kind" />
        <MonthSelector initialDate={currentDate} onChange={setCurrentDate} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 px-4 pb-6 mt-8 flex flex-col overflow-hidden">
        <div className="bg-white shadow-md rounded-lg p-4 flex-1 flex flex-col overflow-hidden mb-0">
          <BudgetSummaryCard
            title="Jährliche Ausgaben"
            budget={budget}
            expenses={totalExpenses}
            percentageUsed={percentageUsed}
            onBudgetClick={() => setIsBudgetModalOpen(true)}
            onTitleClick={() => console.log("Kind Gesamtübersicht anzeigen")}
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
        title="Jährliches Budget bearbeiten"
      />
    </PageLayout>
  )
}

