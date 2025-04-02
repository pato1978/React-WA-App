// lib/expense-actions.ts
import { Expense } from "@/types"
import { HelpCircle } from "lucide-react"
import { iconMap } from "@/lib/icon-map" // falls ausgelagert
import { convertDateToDisplay } from "@/lib/utils"

export async function saveExpense(
    expense: Expense,
    selectedIcon: any,
    setExpenses: React.Dispatch<React.SetStateAction<Expense[]>>
): Promise<void> {
    if (!expense) return

    //const formattedDate = convertDateToDisplay(expense.date)
    const determinedIcon = iconMap[expense.category] || selectedIcon || HelpCircle

    const updatedExpense = {
        ...expense,
        date: expense.date,
        icon: determinedIcon,
    }

    try {
        const { icon, ...expenseToSend } = updatedExpense

        const response = await fetch("http://localhost:5289/api/expenses", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(expenseToSend),
        })

        if (!response.ok) {
            const errorText = await response.text()
            console.error("Fehler vom Server:", errorText)
            throw new Error("Fehler beim Speichern")
        }

        const savedExpense = await response.json()

        setExpenses((prev) => {
            const exists = prev.some((e) => e.id === savedExpense.id)
            if (exists) {
                return prev.map((e) => (e.id === savedExpense.id ? savedExpense : e))
            } else {
                return [savedExpense, ...prev]
            }
        })
    } catch (error) {
        console.error("Fehler beim Speichern:", error)
    }
}
