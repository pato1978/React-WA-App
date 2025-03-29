import type { Expense } from "@/types"
import { ExpenseItem } from "@/components/dashboard/expense-item"

interface VerbesserteLitenansichtProps {
  expenses: Expense[]
  onDelete: (id: number) => void
  onEdit: (expense: Expense) => void
}

export function VerbesserteLitenansicht({ expenses, onDelete, onEdit }: VerbesserteLitenansichtProps) {
  return (
    <div className="border-t pt-4 mt-4 flex-1 flex flex-col overflow-hidden">
      <div className="expenses-scroll-area rounded-lg p-4 flex-1 [&>div]:mb-[0.125rem]">
        {expenses.map((item) => (
          <ExpenseItem key={item.id} item={item} onDelete={onDelete} onEdit={onEdit} />
        ))}
      </div>
    </div>
  )
}

