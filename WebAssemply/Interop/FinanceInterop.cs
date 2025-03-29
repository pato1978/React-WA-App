using Microsoft.JSInterop;

namespace WebAssemply.Interop
{
    public class FinanceInterop
    {
        [JSInvokable("GetFinancialData")]
        public static object GetFinancialData()
        {
            return new
            {
                personalBudget = new { spent = 850, total = 1200, percentage = 70 },
                sharedBudget = new { spent = 620, total = 1500, percentage = 41 },
                childBudget = new { spent = 360, total = 1200, percentage = 30 }
            };
        }
    }
}