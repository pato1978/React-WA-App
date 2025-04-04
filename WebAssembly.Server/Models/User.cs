namespace WebAssembly.Server.Models;

public class User
{
    public string Id { get; set; } = new Guid().ToString();
    public string Name { get; set; } = string.Empty;
}