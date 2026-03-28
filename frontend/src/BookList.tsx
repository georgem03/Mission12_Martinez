import { useEffect, useState } from 'react';
import type { Book } from './types/Book';
import { useCart } from './context/CartContext';

interface BookListProps {
onGoToCart: () => void;
}

function BookList({ onGoToCart }: BookListProps) {
const [books, setBooks] = useState<Book[]>([]);
const [pageSize, setPageSize] = useState(5);
const [pageNum, setPageNum] = useState(1);
const [totalBooks, setTotalBooks] = useState(0);
const [sort, setSort] = useState('title_asc');
const [categories, setCategories] = useState<string[]>([]);
const [selectedCategory, setSelectedCategory] = useState('');
const [toastMessage, setToastMessage] = useState('');
const [showToast, setShowToast] = useState(false);
const [showOffcanvas, setShowOffcanvas] = useState(false);

const { cartItems, addToCart, removeFromCart, updateQuantity, totalItems, totalPrice } =
useCart();

const totalPages = Math.ceil(totalBooks / pageSize);

// Fetch categories once on mount
useEffect(() => {
fetch('https://localhost:5000/Books/categories')
    .then((res) => res.json())
    .then((data) => setCategories(data))
    .catch((err) => console.error('Failed to load categories', err));
}, []);

// Fetch books whenever filters change
useEffect(() => {
const categoryParam = selectedCategory
    ? `&category=${encodeURIComponent(selectedCategory)}`
    : '';
fetch(
    `https://localhost:5000/Books?pageSize=${pageSize}&pageNum=${pageNum}&sort=${sort}${categoryParam}`
)
    .then((res) => {
    if (!res.ok) throw new Error(`Request failed: ${res.status}`);
    return res.json();
    })
    .then((data) => {
    setBooks(data.books ?? data.Books ?? []);
    setTotalBooks(data.totalNumBooks ?? data.TotalNumBooks ?? 0);
    })
    .catch((err) => {
    console.error('Failed to load books', err);
    setBooks([]);
    setTotalBooks(0);
    });
}, [pageSize, pageNum, sort, selectedCategory]);

const handleCategoryChange = (cat: string) => {
setSelectedCategory(cat);
setPageNum(1);
};

const handleAddToCart = (book: Book) => {
addToCart(book);
setToastMessage(`"${book.title}" added to cart!`);
setShowToast(true);
setTimeout(() => setShowToast(false), 3000);
};

return (
<>
    {/* Navbar */}
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4 shadow">
    <div className="container-fluid px-4">
        <span className="navbar-brand fw-bold fs-4">📚 Bookstore</span>
        <button
        className="btn btn-outline-light position-relative"
        onClick={() => setShowOffcanvas(true)}
        >
        🛒 Cart
        {totalItems > 0 && (
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
            {totalItems}
            </span>
        )}
        </button>
    </div>
    </nav>

    <div className="container-fluid px-4">
    <div className="row g-4">
        {/* Sidebar: Categories */}
        <div className="col-lg-2 col-md-3">
        <div className="card shadow-sm sticky-top" style={{ top: '1rem' }}>
            <div className="card-header bg-dark text-white fw-semibold">
            Filter by Category
            </div>
            <div className="list-group list-group-flush">
            <button
                className={`list-group-item list-group-item-action ${selectedCategory === '' ? 'active' : ''}`}
                onClick={() => handleCategoryChange('')}
            >
                All Categories
            </button>
            {categories.map((cat) => (
                <button
                key={cat}
                className={`list-group-item list-group-item-action ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => handleCategoryChange(cat)}
                >
                {cat}
                </button>
            ))}
            </div>
        </div>
        </div>

        {/* Main Content */}
        <div className="col-lg-7 col-md-6">
        {/* Controls row */}
        <div className="row align-items-center mb-3 g-2">
            <div className="col-auto">
            <span className="text-muted small">
                Showing{' '}
                <strong>
                {Math.min((pageNum - 1) * pageSize + 1, totalBooks)}–
                {Math.min(pageNum * pageSize, totalBooks)}
                </strong>{' '}
                of <strong>{totalBooks}</strong> books
                {selectedCategory && (
                <> in <em>{selectedCategory}</em></>
                )}
            </span>
            </div>
            <div className="col-auto ms-auto">
            <select
                className="form-select form-select-sm"
                value={sort}
                onChange={(e) => {
                setSort(e.target.value);
                setPageNum(1);
                }}
            >
                <option value="title_asc">Title (A–Z)</option>
                <option value="title_desc">Title (Z–A)</option>
            </select>
            </div>
            <div className="col-auto">
            <select
                className="form-select form-select-sm"
                value={pageSize}
                onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPageNum(1);
                }}
            >
                <option value="5">5 per page</option>
                <option value="10">10 per page</option>
                <option value="20">20 per page</option>
            </select>
            </div>
        </div>

        {/* Book Cards */}
        {books.map((b) => (
            <div className="card mb-3 shadow-sm" key={b.bookId}>
            <div className="card-body">
                <div className="row align-items-center g-3">
                <div className="col">
                    <h5 className="card-title mb-1">{b.title}</h5>
                    <p className="text-muted small mb-1">by {b.author}</p>
                    <div className="d-flex flex-wrap gap-1 mb-2">
                    <span className="badge bg-secondary">{b.category}</span>
                    <span className="badge bg-light text-dark border">
                        {b.classification}
                    </span>
                    </div>
                    <div className="row g-2 small text-muted">
                    <div className="col-auto">
                        <strong>Publisher:</strong> {b.publisher}
                    </div>
                    <div className="col-auto">
                        <strong>ISBN:</strong> {b.isbn}
                    </div>
                    <div className="col-auto">
                        <strong>Pages:</strong> {b.pageCount}
                    </div>
                    </div>
                </div>
                <div className="col-auto text-end">
                    <div className="fs-5 fw-bold text-success mb-2">
                    ${Number(b.price).toFixed(2)}
                    </div>
                    <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleAddToCart(b)}
                    >
                    Add to Cart
                    </button>
                </div>
                </div>
            </div>
            </div>
        ))}

        {/* Pagination */}
        <nav aria-label="Book pagination" className="mt-3">
            <ul className="pagination justify-content-center flex-wrap">
            <li className={`page-item ${pageNum === 1 ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => setPageNum(1)}>«</button>
            </li>
            <li className={`page-item ${pageNum === 1 ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => setPageNum((p) => p - 1)}>
                ‹ Prev
                </button>
            </li>
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                const start = Math.max(1, pageNum - 3);
                const page = start + i;
                if (page > totalPages) return null;
                return (
                <li key={page} className={`page-item ${pageNum === page ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => setPageNum(page)}>
                    {page}
                    </button>
                </li>
                );
            })}
            <li className={`page-item ${pageNum >= totalPages ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => setPageNum((p) => p + 1)}>
                Next ›
                </button>
            </li>
            <li className={`page-item ${pageNum >= totalPages ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => setPageNum(totalPages)}>»</button>
            </li>
            </ul>
        </nav>
        </div>

        {/* Cart Summary Sidebar */}
        <div className="col-lg-3 col-md-3">
        <div className="card shadow-sm sticky-top" style={{ top: '1rem' }}>
            <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
            <span className="fw-semibold">🛒 Cart Summary</span>
            {totalItems > 0 && (
                <span className="badge bg-danger rounded-pill">{totalItems}</span>
            )}
            </div>
            <div className="card-body p-0">
            {cartItems.length === 0 ? (
                <p className="text-muted text-center p-3 mb-0 small">
                Your cart is empty
                </p>
            ) : (
                <>
                <ul className="list-group list-group-flush">
                    {cartItems.map((item) => (
                    <li key={item.book.bookId} className="list-group-item px-3 py-2">
                        <div className="d-flex justify-content-between align-items-start">
                        <div className="small">
                            <div className="fw-semibold lh-sm">{item.book.title}</div>
                            <div className="text-muted">
                            ${Number(item.book.price).toFixed(2)} × {item.quantity}
                            </div>
                        </div>
                        <span className="fw-semibold small text-nowrap ms-2">
                            ${(item.book.price * item.quantity).toFixed(2)}
                        </span>
                        </div>
                    </li>
                    ))}
                </ul>
                <div className="p-3 border-top">
                    <div className="d-flex justify-content-between fw-bold mb-3">
                    <span>Total</span>
                    <span className="text-success">${totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="d-grid gap-2">
                    <button className="btn btn-success btn-sm" onClick={onGoToCart}>
                        View Full Cart
                    </button>
                    </div>
                </div>
                </>
            )}
            </div>
        </div>
        </div>
    </div>
    </div>

    {/* Bootstrap Offcanvas Cart — NEW Bootstrap feature #1 */}
    {/* Backdrop */}
    {showOffcanvas && (
    <div
        className="offcanvas-backdrop fade show"
        onClick={() => setShowOffcanvas(false)}
    />
    )}

    {/* Offcanvas panel */}
    <div
    className={`offcanvas offcanvas-end ${showOffcanvas ? 'show' : ''}`}
    style={{ visibility: showOffcanvas ? 'visible' : 'hidden', width: '400px' }}
    tabIndex={-1}
    id="cartOffcanvas"
    aria-labelledby="cartOffcanvasLabel"
    >
    <div className="offcanvas-header bg-dark text-white">
        <h5 className="offcanvas-title" id="cartOffcanvasLabel">🛒 Shopping Cart</h5>
        <button
        type="button"
        className="btn-close btn-close-white"
        aria-label="Close"
        onClick={() => setShowOffcanvas(false)}
        ></button>
    </div>
    <div className="offcanvas-body p-0">
        {cartItems.length === 0 ? (
        <div className="text-center text-muted p-4">
            <div className="fs-1 mb-2">🛒</div>
            <p>Your cart is empty</p>
        </div>
        ) : (
        <>
            <ul className="list-group list-group-flush">
            {cartItems.map((item) => (
                <li key={item.book.bookId} className="list-group-item">
                <div className="d-flex justify-content-between align-items-start mb-1">
                    <div>
                    <div className="fw-semibold">{item.book.title}</div>
                    <div className="text-muted small">{item.book.author}</div>
                    </div>
                    <button
                    className="btn btn-sm btn-outline-danger ms-2"
                    onClick={() => removeFromCart(item.book.bookId)}
                    >✕</button>
                </div>
                <div className="d-flex align-items-center justify-content-between">
                    <div className="input-group input-group-sm" style={{ width: '110px' }}>
                    <button
                        className="btn btn-outline-secondary"
                        onClick={() => updateQuantity(item.book.bookId, item.quantity - 1)}
                    >−</button>
                    <input
                        type="number"
                        className="form-control text-center"
                        value={item.quantity}
                        min={1}
                        onChange={(e) =>
                        updateQuantity(item.book.bookId, parseInt(e.target.value) || 1)
                        }
                    />
                    <button
                        className="btn btn-outline-secondary"
                        onClick={() => updateQuantity(item.book.bookId, item.quantity + 1)}
                    >+</button>
                    </div>
                    <span className="fw-semibold">
                    ${(item.book.price * item.quantity).toFixed(2)}
                    </span>
                </div>
                </li>
            ))}
            </ul>
            <div className="p-3 border-top">
            <div className="d-flex justify-content-between fw-bold fs-5 mb-3">
                <span>Total</span>
                <span className="text-success">${totalPrice.toFixed(2)}</span>
            </div>
            <div className="d-grid gap-2">
                <button
                className="btn btn-success"
                onClick={() => { setShowOffcanvas(false); onGoToCart(); }}
                >
                View Full Cart
                </button>
            </div>
            </div>
        </>
        )}
    </div>
    </div>

    {/* Bootstrap Toast Notification — NEW Bootstrap feature #2 */}
    <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 1100 }}>
    <div
        className={`toast align-items-center text-white bg-success border-0 ${showToast ? 'show' : ''}`}
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
    >
        <div className="d-flex">
        <div className="toast-body">✓ {toastMessage}</div>
        <button
            type="button"
            className="btn-close btn-close-white me-2 m-auto"
            onClick={() => setShowToast(false)}
            aria-label="Close"
        ></button>
        </div>
    </div>
    </div>
</>
);
}

export default BookList;