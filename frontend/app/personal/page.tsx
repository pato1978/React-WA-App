"use client"
import { saveExpense } from "@/lib/expense-actions"
import { iconMap } from "@/lib/icon-map"
import { useState, useEffect } from "react"
import { availableIcons } from "@/lib/icon-options"
import { HelpCircle } from "lucide-react"
import { PageLayout } from "@/components/layout/page-layout"
import { PageHeader } from "@/components/layout/page-header"
import { MonthSelector } from "@/components/layout/month-selector"
import { BudgetSummaryCard } from "@/components/dashboard/budget-summary-card"
import ExpenseEditorModal from "@/components/modals/expense-editor-modal"
import BudgetEditorModal from "@/components/modals/budget-editor-modal"
import { VerbesserteLitenansicht } from "@/components/dashboard/verbesserte-listenansicht"
import type { Expense, IconOption } from "@/types"
import { convertDateToISO, convertDateToDisplay } from "@/lib/utils"
import { useMonth } from "@/context/month-context" // falls noch nicht da
export default function PersonalPage() {
  const { currentDate, setCurrentDate } = useMonth()
  const [expenses, setExpenses] = useState<Expense[]>([]) // Wird später über die API geladen
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)
  const [selectedIcon, setSelectedIcon] = useState<any>(null)
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false)
  const [budget, setBudget] = useState(1200)
  // Beim Laden der Seite: persönliche Ausgaben vom Blazor-Backend holen.
  useEffect(() => {
    setIsLoading(true)

    fetch(`http://localhost:5289/api/expenses/personal?month=${currentDate.toISOString()}`)
        .then((res) => res.json())
        .then((data) => setExpenses(data))
        .catch((err) => console.error("Fehler beim Laden der Ausgaben:", err))
        .finally(() => setIsLoading(false))
  }, [currentDate]) // ✅ fetch läuft jedes Mal, wenn der Monat sich ändert

 
 

  // Öffnet das Modal für eine neue Ausgabe.
  const handleAddButtonClick = () => {
    setEditingExpense({
      id: "",
      name: "",
      amount: "",
      date: new Date().toISOString().split("T")[0],
      category: "",
      icon: HelpCircle, // Icon wird später automatisch aus der Kategorie abgeleitet.
      isPersonal: true,
      isShared:false,
      isChild: false,
      isRecurring: false,
    })
    // Standardmäßig wird als Fallback HelpCircle gewählt.
    setSelectedIcon(HelpCircle)
    setIsModalOpen(true)
  }

  // Öffnet das Modal, um eine bestehende Ausgabe zu bearbeiten.
  const handleEditExpense = (expense: Expense) => {
    setEditingExpense({
      ...expense,
      date: convertDateToISO(expense.date),
      isChild: expense.isChild || false,
      isRecurring: expense.isRecurring || false,
    })
    // Setzt das aktuell ausgewählte Icon basierend auf der Kategorie.
    setSelectedIcon(iconMap[expense.category] || HelpCircle)
    setIsModalOpen(true)
  }

  // Speichert (oder aktualisiert) eine Ausgabe: sendet Daten per POST an Blazor.
  const handleSaveExpense = (expense: Expense) => {
    saveExpense(expense, selectedIcon, setExpenses)
    setIsModalOpen(false)
    setEditingExpense(null)
  }


  // Löscht eine Ausgabe per DELETE-Anfrage.
  const deleteExpense = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:5289/api/expenses/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Fehler beim Löschen")

      setExpenses(expenses.filter((expense) => expense.id !== id))
    } catch (error) {
      console.error("Fehler beim Löschen:", error)
    }
  }

  // Berechnet die Summe aller Ausgaben.
  const totalExpenses = expenses.reduce((sum, exp) => {
    const value = parseFloat(exp.amount.replace("€", "").replace(",", "."))
    return sum + (isNaN(value) ? 0 : value)
  }, 0)

  // Berechnet den Prozentsatz des genutzten Budgets.
  const percentageUsed = Math.min(100, Math.round((totalExpenses / budget) * 100))

  // Mappt jede Ausgabe so, dass das Icon anhand der Kategorie gesetzt wird.
  // Falls keine passende Kategorie gefunden wird, wird HelpCircle genutzt.
  const mappedExpenses = expenses.map(exp => ({
    ...exp,
    icon: iconMap[exp.category] || HelpCircle,
  }))

  return (
      <PageLayout onAddButtonClick={handleAddButtonClick}>
        {/* Header-Bereich mit Überschrift und Monatsauswahl */}
        <div className="page-header-container">
          <PageHeader title="Persönlich" />
          <MonthSelector initialDate={currentDate} onChange={setCurrentDate} />
        </div>

        {/* Hauptinhalt: Budget-Karte und Ausgabenliste */}
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

            {/* Zeigt entweder die Ladeanzeige oder die Liste der Ausgaben */}
            {isLoading ? (
                <div className="text-center text-sm text-gray-500 py-8">
                  🔄 Lade persönliche Ausgaben...
                </div>
            ) : (
                <VerbesserteLitenansicht
                    expenses={mappedExpenses}
                    onDelete={deleteExpense}
                    onEdit={handleEditExpense}
                />
            )}
          </div>
        </div>

        {/* Modal zum Bearbeiten/Hinzufügen einer Ausgabe */}
        <ExpenseEditorModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            expense={editingExpense}
            onSave={handleSaveExpense}
            availableIcons={availableIcons}
        />

        {/* Modal zur Budget-Einstellung */}
        <BudgetEditorModal
            isOpen={isBudgetModalOpen}
            onClose={() => setIsBudgetModalOpen(false)}
            currentBudget={budget}
            onSave={(newBudget) => {
              setBudget(newBudget)
              setIsBudgetModalOpen(false)
            }}
        />
      </PageLayout>
  )
}
