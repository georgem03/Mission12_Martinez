using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Mission11_Martinez.API.Data;

namespace Mission11_Martinez.API.Controllers
{
[Route("Books")]
[ApiController]
public class BookController : ControllerBase
{
    private BookStoreDbContext _bookContext;
    
    public BookController(BookStoreDbContext temp) => _bookContext = temp;
    
    [HttpGet]
    public IActionResult GetBooks(int pageSize = 5, int pageNum = 1, string sort = "title_asc", string? category = null)
    {
        var query = _bookContext.Books.AsQueryable();

        // Category filter
        if (!string.IsNullOrWhiteSpace(category))
        {
            query = query.Where(b => b.Category == category);
        }

        // Sorting
        query = sort.ToLower() switch
        {
            "title_desc" => query.OrderByDescending(b => b.Title),
            _ => query.OrderBy(b => b.Title)
        };

        var totalNumBooks = query.Count();

        var books = query
            .Skip((pageNum - 1) * pageSize)
            .Take(pageSize)
            .ToList();

        return Ok(new
        {
            Books = books,
            TotalNumBooks = totalNumBooks
        });
    }

    [HttpGet("categories")]
    public IActionResult GetCategories()
    {
        var categories = _bookContext.Books
            .Select(b => b.Category)
            .Distinct()
            .OrderBy(c => c)
            .ToList();

        return Ok(categories);
    }
}
}
