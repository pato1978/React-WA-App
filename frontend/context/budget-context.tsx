import { createContext, useContext, useEffect, useState } from "react"
import { useMonth } from "@/context/month-context"
import type { Expense } from "@/types"

// 📌 Typen für besseren Zugriff
type BudgetContextType = {
    budget: number
    setBudget: (val: number) => void
        expenses: Expense[]
setExpenses: (exps: Expense[]) => void
    totalExpenses: number
percentageUsed: number
isLoading: boolean
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined)

export function BudgetProvider({ children }: { children: React.ReactNode }) {
    const [budget, setBudget] = useState(1200) // 💶 Standardbudget, anpassbar
    const [expenses, setExpenses] = useState<Expense[]>([])
    const [isLoading, setIsLoading] = useState(true)

    const { currentDate } = useMonth() // 🗓️ Monat aus globalem Kontext

    // 📥 API-Daten laden, wenn Monat sich ändert
    useEffect(() => {
        setIsLoading(true)
        const isoDate = currentDate.toISOString()

        fetch(`http://localhost:5289/api/expenses/personal?month=${isoDate}`)
            .then((res) => res.json())
            .then((data) => setExpenses(data))
            .catch((err) => console.error("Fehler beim Laden:", err))
            .finally(() => setIsLoading(false))
    }, [currentDate])

    // 🧮 Ausgaben aufsummieren
    const totalExpenses = expenses.reduce((sum, exp) => {
        const value = parseFloat(exp.amount.replace("€", "").replace(",", "."))
        return sum + (isNaN(value) ? 0 : value)
    }, 0)

    const percentageUsed = Math.min(100, Math.round((totalExpenses / budget) * 100))

    return (
        <BudgetContext.Provider
            value={{
                budget,
                setBudget,
                expenses,
                setExpenses,
                totalExpenses,
                percentageUsed,
                isLoading,
            }}
        >
            {children}
        </BudgetContext.Provider>
    )
}

// 🔧 Custom Hook für Zugriff
export function useBudget() {
    const context = useContext(BudgetContext)
    if (!context) throw new Error("useBudget muss innerhalb eines BudgetProvider verwendet werden")
    return context
}
