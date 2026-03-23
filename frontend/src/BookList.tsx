import { useEffect, useState } from "react";
import type { Book } from "./types/Book";

function BookList() {
    const [books, setBooks] = useState<Book[]>([]);
    const [pageSize, setPageSize] = useState(5);
    const [pageNum, setPageNum] = useState(1);
    const [totalBooks, setTotalBooks] = useState(0);
    const [sort, setSort] = useState("title_asc");

    useEffect(() => {
    fetch(`https://localhost:5000/Books?pageSize=${pageSize}&pageNum=${pageNum}&sort=${sort}`)
        .then(res => {
        if (!res.ok) {
            throw new Error(`Request failed: ${res.status}`);
        }
        return res.json();
        })
        .then(data => {
        setBooks(data.books ?? data.Books ?? []);
        setTotalBooks(data.totalNumBooks ?? data.TotalNumBooks ?? 0);
        })
        .catch(err => {
        console.error("Failed to load books", err);
        setBooks([]);
        setTotalBooks(0);
        });
    }, [pageSize, pageNum, sort]);

    return (
    <div className="container">
        <h2>Book List</h2>
        <p>Total books: {totalBooks}</p>

        {books.map(b => (
        <div className="card mb-3" key={b.bookId}>
            <div className="card-body">
            <h5>{b.title}</h5>
            <p><strong>Book ID:</strong> {b.bookId}</p>
            <p><strong>Author:</strong> {b.author}</p>
            <p><strong>Publisher:</strong> {b.publisher}</p>
            <p><strong>ISBN:</strong> {b.isbn}</p>
            <p><strong>Classification:</strong> {b.classification}</p>
            <p><strong>Category:</strong> {b.category}</p>
            <p><strong>Page Count:</strong> {b.pageCount}</p>
            <p><strong>Price:</strong> ${Number(b.price).toFixed(2)}</p>
            </div>
        </div>
        ))}

        {/* Pagination */}
        <button onClick={() => setPageNum(pageNum - 1)} disabled={pageNum === 1}>
        Previous
        </button>

        <button onClick={() => setPageNum(pageNum + 1)}>
        Next
        </button>

        {/* Page Size */}
        <select
        value={pageSize}
        onChange={(e) => {
            setPageSize(Number(e.target.value));
            setPageNum(1);
        }}
        >
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="20">20</option>
        </select>

        {/* Sorting */}
        <select
        value={sort}
        onChange={(e) => {
            setSort(e.target.value);
            setPageNum(1);
        }}
        >
        <option value="title_asc">Title (A-Z)</option>
        <option value="title_desc">Title (Z-A)</option>
        </select>
    </div>
    );
    }

export default BookList;