
using WebAssembly.Server.Models;
namespace WebAssembly.Server.Services;

public class ExpenseStore
{
    public static List<ExpenseDto> Expenses { get; } = new()
    {
        new ExpenseDto
        {
            
            Name = "Supermarkt",
            Amount = "42.50",
            Date =new DateTime(2025,04,01),
            Category = "Essen",
           
            isPersonal = true,
            isShared = false,
            isChild = false,
            isRecurring = false
        },
        new ExpenseDto
        {
            
            Name = "Kino",
            Amount = "15.00",
            Date = new DateTime(2025,04,03),
            Category = "Hobbys",
            
            isPersonal = true,
            isShared = false,
            isChild = false,
            isRecurring = false
        }
    };
}