namespace WebAssembly.Server.Models;

public class ExpenseDto
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string Name { get; set; } = "";
    public string Amount { get; set; } = ""; // z. B. "€42.50"// wdadawdadwdadwd
    public DateTime Date { get; set; } 
    public string Category { get; set; } = "";
    
    public bool isPersonal { get; set; }
    public bool isChild { get; set; }
    public bool isShared { get; set; }
    public bool isRecurring { get; set; }
}