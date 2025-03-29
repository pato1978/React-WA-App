
using Microsoft.AspNetCore.Mvc;
namespace WebAssembly.Server.Controllers;

public class FinaceCalculatorHelper
{
    private int CalculatePercentage(int spent, int total)
    {
        if (total == 0) return 0;
        return (int)((double)spent / total * 100);
    }
}

[ApiController]
    [Route("api/[controller]")]
    public class FinancialDataController : ControllerBase
    {
        private readonly FinaceCalculatorHelper _finaceCalculatorHelper = new FinaceCalculatorHelper();

        [HttpGet]
        public IActionResult Get()
        {   
            var personalSpent = 850;
            var personalTotal = 1200;
            var personalPercentage = _finaceCalculatorHelper.CalculatePercentage(personalSpent, personalTotal);
            
            var sharedSpent = 620;  
            var sharedTotal = 1500;
            var sharedPercentage = _finaceCalculatorHelper.CalculatePercentage(sharedSpent, sharedTotal);
            
            var childSpent = 360;
            var childTotal = 1200;
            var childPercentage = _finaceCalculatorHelper.CalculatePercentage(childSpent, childTotal);

            var data = new
            {
                personalBudget = new { spent = personalSpent, total = personalTotal, percentage = personalPercentage },
                sharedBudget = new { spent = sharedSpent, total = sharedTotal, percentage = sharedPercentage },
                childBudget = new { spent = childSpent, total = childTotal, percentage = childPercentage }
            };
            

            return Ok(data);
        }
    }
