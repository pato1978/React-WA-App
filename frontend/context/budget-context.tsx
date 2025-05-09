"use client"
import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    type Dispatch,
    type SetStateAction,
} from "react"
import { useMonth } from "@/context/month-context"
import type { Expense } from "@/types"

// 📦 Kontext-Typ: was per useBudget() bereitgestellt wird
type BudgetContextType = {
    budget: number
    setBudget: (b: number) => void
    expenses: Expense[]
    setExpenses: Dispatch<SetStateAction<Expense[]>>
    isLoading: boolean
    refreshExpenses: () => void
}

// 🔧 React-Context erstellen
const BudgetContext = createContext<BudgetContextType | undefined>(undefined)

// ✅ API-Basis-URL aus .env oder Fallback
const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5289"

export function BudgetProvider({ children }: { children: React.ReactNode }) {
    const [budget, setBudget] = useState(0)                         // monatliches Budget
    const [expenses, setExpenses] = useState<Expense[]>([])         // Ausgaben des Monats
    const [isLoadingBudget, setIsLoadingBudget] = useState(false)   // Ladeanzeige für Budget
    const [isLoadingExpenses, setIsLoadingExpenses] = useState(false) // Ladeanzeige für Ausgaben
    const [refreshCounter, setRefreshCounter] = useState(0)         // manuelles Neuladen

    const { currentDate } = useMonth() // 📆 aus globalem Monats-Context

    // 🧠 Ladeanzeige kombiniert
    const isLoading = isLoadingBudget || isLoadingExpenses

    // 📦 Budget laden, wenn Monat wechselt
    useEffect(() => {
        const monthStr = currentDate.toISOString().slice(0, 7) // z. B. "2025-05"
        setIsLoadingBudget(true)

        fetch(`${BASE_URL}/api/budget/personal?month=${monthStr}`)
            .then((r) => r.json())
            .then((value: number) => setBudget(value))
            .catch(() => setBudget(0))
            .finally(() => setIsLoadingBudget(false))
    }, [currentDate])

    // 💰 Ausgaben für den Monat laden (auch bei manuellem Refresh)
    useEffect(() => {
        const iso = currentDate.toISOString()
        setIsLoadingExpenses(true)

        fetch(`${BASE_URL}/api/expenses/personal?month=${iso}`)
            .then((r) => r.json())
            .then((data: Expense[]) => setExpenses(data))
            .catch(() => setExpenses([]))
            .finally(() => setIsLoadingExpenses(false))
    }, [currentDate, refreshCounter])

    // 💾 Budget speichern für den aktuellen Monat
    function saveBudget(newBudget: number) {
        const monthStr = currentDate.toISOString().slice(0, 7)
        setBudget(newBudget)

        fetch(`${BASE_URL}/api/budget/personal`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ month: monthStr, amount: newBudget }),
        }).catch(console.error)
    }

    // 🔁 Manuelles Neuladen der Ausgaben auslösen
    function refreshExpenses() {
        setRefreshCounter((c) => c + 1)
    }

    return (
        <BudgetContext.Provider
            value={{
                budget,
                setBudget: saveBudget, // speichert automatisch beim Setzen
                expenses,
                setExpenses,
                isLoading,
                refreshExpenses,
            }}
        >
            {children}
        </BudgetContext.Provider>
    )
}

// 🔧 Custom Hook zur Nutzung in Komponenten
export function useBudget() {
    const ctx = useContext(BudgetContext)
    if (!ctx) throw new Error("useBudget must be inside BudgetProvider")
    return ctx
}
