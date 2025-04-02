using Microsoft.AspNetCore.Mvc;
using System.Linq;
using WebAssembly.Server.Models;
using WebAssembly.Server.Services;

namespace WebAssembly.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ExpensesController : ControllerBase
    {
        // 📥 GET: /api/expenses/personaldawdw
        [HttpGet("personal")]
        public IActionResult GetPersonalExpenses()
        {
            var personal = ExpenseStore.Expenses
                .Where(e => e.isPersonal && !e.isChild && !e.isShared)
                .OrderByDescending(e => e.Date)
                .ToList();

            return Ok(personal);
        }

        // 📥 GET: /api/expenses/shared
        [HttpGet("shared")]
        public IActionResult GetSharedExpenses()
        {
            var shared = ExpenseStore.Expenses
                .Where(e => e.isShared)
                .OrderByDescending(e => e.Date)
                .ToList();

            return Ok(shared);
        }

        // 📥 GET: /api/expenses/child
        [HttpGet("child")]
        public IActionResult GetChildExpenses()
        {
            var child = ExpenseStore.Expenses
                .Where(e => e.isChild)
                .OrderByDescending(e => e.Date)
                .ToList();

            return Ok(child);
        }

        // 💾 POST: /api/expenses
        [HttpPost]
        public IActionResult SaveExpense([FromBody] ExpenseDto newExpense)
        {
            if (string.IsNullOrWhiteSpace(newExpense.Id))
            {
                // Neue Ausgabe → ID generieren
                newExpense.Id = Guid.NewGuid().ToString();
                ExpenseStore.Expenses.Add(newExpense);
            }
            else
            {
                // Bestehende Ausgabe aktualisieren (nach ID suchen)
                var existing = ExpenseStore.Expenses.FirstOrDefault(e => e.Id == newExpense.Id);
                if (existing != null)
                {
                    // Eigenschaften aktualisieren
                    ExpenseStore.Expenses.Remove(existing);
                    ExpenseStore.Expenses.Add(newExpense);
                }
                else
                {
                    // Wenn nicht gefunden, einfach hinzufügen
                    ExpenseStore.Expenses.Add(newExpense);
                }
            }

            return Ok(newExpense);
        }

        // 🗑️ DELETE: /api/expenses/{id}
        [HttpDelete("{id}")]
        public IActionResult DeleteExpense(string id)
        {
            var expense = ExpenseStore.Expenses.FirstOrDefault(e => e.Id == id);
            if (expense == null)
                return NotFound();

            ExpenseStore.Expenses.Remove(expense);
            return NoContent();
        }
    }
}
