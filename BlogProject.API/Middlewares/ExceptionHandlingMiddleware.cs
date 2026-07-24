using System.Net;
using System.Text.Json;

namespace BlogProject.API.Middlewares
{
    // Controller'larda try/catch tekrarını önler — beklenmeyen tüm hatalar burada tek tip JSON'a çevrilir
    public class ExceptionHandlingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionHandlingMiddleware> _logger;

        public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Beklenmeyen hata: {Path}", context.Request.Path);

                context.Response.ContentType = "application/json";
                context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

                var payload = JsonSerializer.Serialize(new
                {
                    message = "Beklenmeyen bir hata oluştu.",
                    detail = context.RequestServices.GetRequiredService<IWebHostEnvironment>().IsDevelopment()
                        ? ex.Message
                        : null
                });

                await context.Response.WriteAsync(payload);
            }
        }
    }
}
