"use client"

import { useState } from "react"
import {
  ShoppingCart,
  Utensils,
  HomeIcon as HouseIcon,
  Wifi,
  Smartphone,
  Car,
  Gift,
  Briefcase,
  Users,
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

export default function SharedPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [expenses, setExpenses] = useState<Expense[]>([
    {
      id: 1,
      name: "Miete",
      amount: "€850.00",
      date: "01.03.2025",
      category: "Wohnen",
      icon: HouseIcon,
      isPersonal: false,
      isChild: false,
      isRecurring: true,
    },
    {
      id: 2,
      name: "Strom",
      amount: "€75.30",
      date: "05.03.2025",
      category: "Nebenkosten",
      icon: Wifi,
      isPersonal: false,
      isChild: false,
      isRecurring: true,
    },
    {
      id: 3,
      name: "Internet",
      amount: "€39.99",
      date: "08.03.2025",
      category: "Kommunikation",
      icon: Wifi,
      isPersonal: false,
      isChild: false,
      isRecurring: true,
    },
    {
      id: 4,
      name: "Handyvertrag",
      amount: "€29.99",
      date: "10.03.2025",
      category: "Kommunikation",
      icon: Smartphone,
      isPersonal: false,
      isChild: false,
      isRecurring: true,
    },
    {
      id: 5,
      name: "Großeinkauf",
      amount: "€120.45",
      date: "12.03.2025",
      category: "Lebensmittel",
      icon: ShoppingCart,
      isPersonal: false,
      isChild: false,
      isRecurring: false,
    },
    {
      id: 6,
      name: "Versicherung",
      amount: "€85.00",
      date: "15.03.2025",
      category: "Versicherung",
      icon: Briefcase,
      isPersonal: false,
      isChild: false,
      isRecurring: true,
    },
    {
      id: 7,
      name: "Restaurantbesuch",
      amount: "€68.50",
      date: "18.03.2025",
      category: "Essen",
      icon: Utensils,
      isPersonal: false,
      isChild: false,
      isRecurring: false,
    },
    {
      id: 8,
      name: "Tankstelle",
      amount: "€70.20",
      date: "20.03.2025",
      category: "Transport",
      icon: Car,
      isPersonal: false,
      isChild: false,
      isRecurring: false,
    },
    {
      id: 9,
      name: "Geschenk",
      amount: "€45.00",
      date: "Heute",
      category: "Sonstiges",
      icon: Gift,
      isPersonal: false,
      isChild: false,
      isRecurring: false,
    },
  ])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)
  const [selectedIcon, setSelectedIcon] = useState<any>(null)
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false)
  const [budget, setBudget] = useState(1500)

  // Verfügbare Icons für den Icon-Selektor
  const availableIcons: IconOption[] = [
    { icon: ShoppingCart, name: "Einkaufen", defaultLabel: "Einkaufen" },
    { icon: Utensils, name: "Restaurant", defaultLabel: "Restaurant" },
    { icon: HouseIcon, name: "Wohnen", defaultLabel: "Wohnen" },
    { icon: Wifi, name: "Internet", defaultLabel: "Internet" },
    { icon: Smartphone, name: "Handy", defaultLabel: "Handy" },
    { icon: Car, name: "Auto", defaultLabel: "Auto" },
    { icon: Gift, name: "Geschenk", defaultLabel: "Geschenk" },
    { icon: Briefcase, name: "Versicherung", defaultLabel: "Versicherung" },
    { icon: Users, name: "Gemeinsam", defaultLabel: "Gemeinsam" },
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
      isPersonal: false,
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
  const totalExpenses = expenses.reduce((sum, expense) => {
    return sum + extractAmountValue(expense.amount)
  }, 0)

  // Berechne den Prozentsatz des verbrauchten Budgets
  const percentageUsed = Math.min(100, Math.round((totalExpenses / budget) * 100))

  return (
    <PageLayout onAddButtonClick={handleAddButtonClick}>
      {/* Header Area */}
      <div className="page-header-container">
        <PageHeader title="Gemeinsam" />
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
            onTitleClick={() => console.log("Gemeinsame Gesamtübersicht anzeigen")}
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

