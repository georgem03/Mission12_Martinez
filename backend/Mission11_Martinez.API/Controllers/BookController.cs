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

    [HttpPost("addbook")]
    public IActionResult AddBook([FromBody] Book newBook)
    {
        _bookContext.Books.Add(newBook);
        _bookContext.SaveChanges();
        return Ok(newBook);
    }

    [HttpPut("updatebook/{bookId}")]
    public IActionResult UpdateBook(int bookId, [FromBody] Book updatedBook)
    {
        var existingBook = _bookContext.Books.Find(bookId);
        if (existingBook == null)
            return NotFound();

        existingBook.Title = updatedBook.Title;
        existingBook.Author = updatedBook.Author;
        existingBook.Publisher = updatedBook.Publisher;
        existingBook.ISBN = updatedBook.ISBN;
        existingBook.Classification = updatedBook.Classification;
        existingBook.Category = updatedBook.Category;
        existingBook.PageCount = updatedBook.PageCount;
        existingBook.Price = updatedBook.Price;

        _bookContext.SaveChanges();
        return Ok(existingBook);
    }

    [HttpDelete("deletebook/{bookId}")]
    public IActionResult DeleteBook(int bookId)
    {
        var book = _bookContext.Books.Find(bookId);
        if (book == null)
            return NotFound();

        _bookContext.Books.Remove(book);
        _bookContext.SaveChanges();
        return NoContent();
    }
}
}

