using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebAssembly.Server.Data;
using WebAssembly.Server.Models;
using WebAssembly.Server.Services;

namespace WebAssembly.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ExpensesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ExpensesController(AppDbContext context)
        {
            _context = context;
        }

       /* // 📥 GET: /api/expenses/personal
        [HttpGet("personal")]
        public async Task<IActionResult> GetPersonalExpenses()
        {
            var personal = await _context.Expenses
                .Where(e => e.isPersonal && !e.isChild && !e.isShared)
                .OrderByDescending(e => e.Date)
                .ToListAsync();

            return Ok(personal);
        }*/
       
       
       [HttpGet("personal")]
       public async Task<IActionResult> GetPersonalExpenses([FromQuery] string? month)
       {
           if (string.IsNullOrEmpty(month))
               return BadRequest("Monatsparameter fehlt.");

           if (!DateTime.TryParse(month, out var selectedDate))
               return BadRequest("Ungültiges Datumsformat.");

           var personal = await _context.Expenses
               .Where(e =>
                   e.isPersonal &&
                   !e.isChild &&
                   !e.isShared &&
                   e.Date.Month == selectedDate.Month &&
                   e.Date.Year == selectedDate.Year)
               .OrderByDescending(e => e.Date)
               .ToListAsync();

           return Ok(personal);
       }


        // 📥 GET: /api/expenses/shared
        [HttpGet("shared")]
        public async Task<IActionResult> GetSharedExpenses()
        {
            var shared = await _context.Expenses
                .Where(e => e.isShared)
                .OrderByDescending(e => e.Date)
                .ToListAsync();

            return Ok(shared);
        }

        // 📥 GET: /api/expenses/child
        [HttpGet("child")]
        public async Task<IActionResult> GetChildExpenses()
        {
            var child = await _context.Expenses
                .Where(e => e.isChild)
                .OrderByDescending(e => e.Date)
                .ToListAsync();

            return Ok(child);
        }

        // 💾 POST: /api/expenses
        [HttpPost]
        public async Task<IActionResult> SaveExpense([FromBody] ExpenseDto dto)
        {
            // MonthKey und YearKey basierend auf dem Datum setzen
            var monthKey = dto.Date.ToString("yyyy-MM");
            var yearKey = dto.Date.Year.ToString();

            var isNew = string.IsNullOrWhiteSpace(dto.Id);
            var expenseId = isNew ? Guid.NewGuid().ToString() : dto.Id;

            // Neues oder aktualisiertes Objekt erzeugen
            var expense = new Expense
            {
                Id = expenseId,
                Name = dto.Name,
                Amount = dto.Amount,
                Date = dto.Date,
                MonthKey = monthKey,
                YearKey = yearKey,
                Category = dto.Category,
                isPersonal = dto.isPersonal,
                isChild = dto.isChild,
                isShared = dto.isShared,
                isRecurring = dto.isRecurring
            };

            if (!isNew)
            {
                var existing = await _context.Expenses.FirstOrDefaultAsync(e => e.Id == expense.Id);
                if (existing != null)
                {
                    _context.Expenses.Remove(existing);
                }
            }

            await _context.Expenses.AddAsync(expense);
            await _context.SaveChangesAsync();

            return Ok(expense);
        }

        // 🗑️ DELETE: /api/expenses/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteExpense(string id)
        {
            var expense = await _context.Expenses.FirstOrDefaultAsync(e => e.Id == id);
            if (expense == null)
                return NotFound();

            _context.Expenses.Remove(expense);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
