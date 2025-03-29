import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// Formatiert Monat und Jahr auf Deutsch
export function formatMonthYear(date: Date): string {
  const monthNames = [
    "Januar",
    "Februar",
    "März",
    "April",
    "Mai",
    "Juni",
    "Juli",
    "August",
    "September",
    "Oktober",
    "November",
    "Dezember",
  ]
  const month = monthNames[date.getMonth()]
  const year = date.getFullYear()
  return `${month} ${year}`
}

// Konvertiert ein Datum von DD.MM.YYYY zu YYYY-MM-DD
export function convertDateToISO(dateStr: string): string {
  if (dateStr === "Heute") {
    return new Date().toISOString().split("T")[0]
  }
  return dateStr.split(".").reverse().join("-")
}

// Konvertiert ein Datum von YYYY-MM-DD zu DD.MM.YYYY oder "Heute"
export function convertDateToDisplay(dateStr: string): string {
  const today = new Date().toISOString().split("T")[0]
  if (dateStr === today) {
    return "Heute"
  }
  return dateStr.split("-").reverse().join(".")
}

// Extrahiert den numerischen Wert aus einem Währungsbetrag
export function extractAmountValue(amountStr: string): number {
  return Number.parseFloat(amountStr.replace("€", "").replace(",", "."))
}

// Formatiert einen numerischen Wert als Währungsbetrag
export function formatCurrency(amount: number): string {
  return `€${amount.toFixed(2)}`
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

