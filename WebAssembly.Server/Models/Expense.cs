namespace WebAssembly.Server.Models;

public class Expense
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string Name { get; set; } = "";
    public string Amount { get; set; } = ""; // z. B. "€42.50"// wdadawdadwdadwdr6turhdawgit commit -m "Testcommit für Hook"
    public DateTime Date { get; set; } 
    public string MonthKey { get; set; } = "";
    public string YearKey { get; set; } = "";
    public string Category { get; set; } = "";
    
    public bool isPersonal { get; set; }
    public bool isChild { get; set; }
    public bool isShared { get; set; }
    public bool isRecurring { get; set; }
    public bool isBalanced { get; set; }
}