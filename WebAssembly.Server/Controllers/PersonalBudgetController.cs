using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebAssembly.Server.Data;
using WebAssembly.Server.Models;

namespace WebAssembly.Server.Controllers;

[ApiController]
[Route("api/budget/personal")]
public class PersonalBudgetController : ControllerBase
{
    private readonly AppDbContext _db;

    public PersonalBudgetController(AppDbContext db)
    {
        _db = db;
    }

    // 🔁 GET: /api/budget/personal?month=2025-05
    [HttpGet]
    public async Task<IActionResult> Get([FromQuery] string month)
    {
        if (string.IsNullOrWhiteSpace(month))
            return BadRequest("Month is required");

        var entry = await _db.Budgets
            .FirstOrDefaultAsync(b => b.Month == month);

        // Wenn kein Eintrag existiert, einfach 0 zurückgeben
        return Ok(entry?.Amount ?? 0);
    }

    // 💾 PUT: /api/budget/personal
    [HttpPut]
    public async Task<IActionResult> Put([FromBody] BudgetEntry input)
    {
        if (string.IsNullOrWhiteSpace(input.Month))
            return BadRequest("Month is required");

        var existing = await _db.Budgets
            .FirstOrDefaultAsync(b => b.Month == input.Month);

        if (existing != null)
        {
            existing.Amount = input.Amount;
        }
        else
        {
            input.Id = Guid.NewGuid(); // falls noch nicht gesetzt
            _db.Budgets.Add(input);
        }

        await _db.SaveChangesAsync();
        return NoContent(); // 204 = erfolgreich, kein Inhalt zurück
    }
}