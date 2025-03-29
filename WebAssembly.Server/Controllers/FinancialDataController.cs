
using Microsoft.AspNetCore.Mvc;
namespace WebAssembly.Server.Controllers;

public class FinancialDataController
{
    [ApiController]
    [Route("api/[controller]")]
    public class FinancialDataController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            var data = new
            {
                personalBudget = new { spent = 850, total = 1200, percentage = 70 },
                sharedBudget = new { spent = 620, total = 1500, percentage = 41 },
                childBudget = new { spent = 360, total = 1200, percentage = 30 }
            };

            return Ok(data);
        }
    }
}