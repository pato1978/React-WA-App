var builder = WebApplication.CreateBuilder(args);

// Füge Controller-Support hinzu
builder.Services.AddControllers();

// Optional aber empfohlen: CORS erlauben für React (Frontend auf Port 3000)
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:3000") // oder dein React-Host
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

app.UseHttpsRedirection();
app.UseCors();             // Wichtig, wenn du CORS erlauben willst
app.UseAuthorization();

app.MapControllers();      // 🔑 das aktiviert alle [ApiController]

app.Run();