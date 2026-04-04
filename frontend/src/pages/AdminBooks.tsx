import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Book } from '../types/Book';

// Note: Ensure react-router-dom is installed via: npm install react-router-dom

const API_BASE = 'https://localhost:5000/Books';

const emptyBook: Omit<Book, 'bookId'> = {
title: '',
author: '',
publisher: '',
isbn: '',
classification: '',
category: '',
pageCount: 0,
price: 0,
};

function AdminBooks() {
const navigate = useNavigate();
const [books, setBooks] = useState<Book[]>([]);
const [totalBooks, setTotalBooks] = useState(0);
const [pageNum, setPageNum] = useState(1);
const pageSize = 10;

// Modal state
const [showModal, setShowModal] = useState(false);
const [editingBook, setEditingBook] = useState<Book | null>(null);
const [formData, setFormData] = useState<Omit<Book, 'bookId'>>(emptyBook);
const [saving, setSaving] = useState(false);
const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

const totalPages = Math.ceil(totalBooks / pageSize);

const fetchBooks = () => {
fetch(`${API_BASE}?pageSize=${pageSize}&pageNum=${pageNum}&sort=title_asc`)
    .then((res) => res.json())
    .then((data) => {
    setBooks(data.books ?? data.Books ?? []);
    setTotalBooks(data.totalNumBooks ?? data.TotalNumBooks ?? 0);
    })
    .catch(console.error);
};

useEffect(() => {
fetchBooks();
}, [pageNum]);

const openAddModal = () => {
setEditingBook(null);
setFormData(emptyBook);
setShowModal(true);
};

const openEditModal = (book: Book) => {
setEditingBook(book);
setFormData({
    title: book.title,
    author: book.author,
    publisher: book.publisher,
    isbn: book.isbn,
    classification: book.classification,
    category: book.category,
    pageCount: book.pageCount,
    price: book.price,
});
setShowModal(true);
};

const handleSave = async () => {
setSaving(true);
try {
    if (editingBook) {
    await fetch(`${API_BASE}/updatebook/${editingBook.bookId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, bookId: editingBook.bookId }),
    });
    } else {
    await fetch(`${API_BASE}/addbook`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, bookId: 0 }),
    });
    }
    setShowModal(false);
    fetchBooks();
} catch (err) {
    console.error(err);
} finally {
    setSaving(false);
}
};

const handleDelete = async (bookId: number) => {
try {
    await fetch(`${API_BASE}/deletebook/${bookId}`, { method: 'DELETE' });
    setDeleteConfirmId(null);
    fetchBooks();
} catch (err) {
    console.error(err);
}
};

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
const { name, value } = e.target;
setFormData((prev) => ({
    ...prev,
    [name]: name === 'pageCount' || name === 'price' ? Number(value) : value,
}));
};

return (
<>
    {/* Navbar */}
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4 shadow">
    <div className="container-fluid px-4">
        <span className="navbar-brand fw-bold fs-4">📚 Bookstore Admin</span>
        <button className="btn btn-outline-light" onClick={() => navigate('/')}>
        ← Back to Store
        </button>
    </div>
    </nav>

    <div className="container-fluid px-4">
    <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="fw-bold mb-0">Manage Books</h2>
        <button className="btn btn-success" onClick={openAddModal}>
        + Add New Book
        </button>
    </div>

    <div className="card shadow-sm">
        <div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
            <thead className="table-dark">
            <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Category</th>
                <th>Publisher</th>
                <th>ISBN</th>
                <th>Pages</th>
                <th>Price</th>
                <th style={{ width: '140px' }}>Actions</th>
            </tr>
            </thead>
            <tbody>
            {books.map((book) => (
                <tr key={book.bookId}>
                <td className="fw-semibold">{book.title}</td>
                <td>{book.author}</td>
                <td>
                    <span className="badge bg-secondary">{book.category}</span>
                </td>
                <td className="text-muted small">{book.publisher}</td>
                <td className="text-muted small">{book.isbn}</td>
                <td>{book.pageCount}</td>
                <td className="text-success fw-semibold">
                    ${Number(book.price).toFixed(2)}
                </td>
                <td>
                    <div className="d-flex gap-2">
                    <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => openEditModal(book)}
                    >
                        Edit
                    </button>
                    <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => setDeleteConfirmId(book.bookId)}
                    >
                        Delete
                    </button>
                    </div>
                </td>
                </tr>
            ))}
            </tbody>
        </table>
        </div>
    </div>

    {/* Pagination */}
    <nav className="mt-3">
        <ul className="pagination justify-content-center">
        <li className={`page-item ${pageNum === 1 ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => setPageNum((p) => p - 1)}>
            ‹ Prev
            </button>
        </li>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <li key={p} className={`page-item ${pageNum === p ? 'active' : ''}`}>
            <button className="page-link" onClick={() => setPageNum(p)}>
                {p}
            </button>
            </li>
        ))}
        <li className={`page-item ${pageNum >= totalPages ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => setPageNum((p) => p + 1)}>
            Next ›
            </button>
        </li>
        </ul>
    </nav>
    </div>

    {/* Add/Edit Modal */}
    {showModal && (
    <>
        <div className="modal-backdrop fade show" onClick={() => setShowModal(false)} />
        <div
        className="modal fade show d-block"
        tabIndex={-1}
        role="dialog"
        >
        <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
            <div className="modal-header bg-dark text-white">
                <h5 className="modal-title">
                {editingBook ? 'Edit Book' : 'Add New Book'}
                </h5>
                <button
                className="btn-close btn-close-white"
                onClick={() => setShowModal(false)}
                />
            </div>
            <div className="modal-body">
                <div className="row g-3">
                {[
                    { label: 'Title', name: 'title', type: 'text' },
                    { label: 'Author', name: 'author', type: 'text' },
                    { label: 'Publisher', name: 'publisher', type: 'text' },
                    { label: 'ISBN', name: 'isbn', type: 'text' },
                    { label: 'Classification', name: 'classification', type: 'text' },
                    { label: 'Category', name: 'category', type: 'text' },
                    { label: 'Page Count', name: 'pageCount', type: 'number' },
                    { label: 'Price ($)', name: 'price', type: 'number' },
                ].map(({ label, name, type }) => (
                    <div className="col-md-6" key={name}>
                    <label className="form-label fw-semibold">{label}</label>
                    <input
                        type={type}
                        className="form-control"
                        name={name}
                        value={(formData as any)[name]}
                        onChange={handleChange}
                        step={name === 'price' ? '0.01' : undefined}
                        min={type === 'number' ? '0' : undefined}
                    />
                    </div>
                ))}
                </div>
            </div>
            <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                Cancel
                </button>
                <button
                className="btn btn-success"
                onClick={handleSave}
                disabled={saving}
                >
                {saving ? 'Saving…' : editingBook ? 'Save Changes' : 'Add Book'}
                </button>
            </div>
            </div>
        </div>
        </div>
    </>
    )}

    {/* Delete Confirmation Modal */}
    {deleteConfirmId !== null && (
    <>
        <div className="modal-backdrop fade show" />
        <div className="modal fade show d-block" tabIndex={-1} role="dialog">
        <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
            <div className="modal-header bg-danger text-white">
                <h5 className="modal-title">Confirm Delete</h5>
                <button
                className="btn-close btn-close-white"
                onClick={() => setDeleteConfirmId(null)}
                />
            </div>
            <div className="modal-body">
                <p>
                Are you sure you want to delete{' '}
                <strong>
                    {books.find((b) => b.bookId === deleteConfirmId)?.title}
                </strong>
                ? This action cannot be undone.
                </p>
            </div>
            <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setDeleteConfirmId(null)}>
                Cancel
                </button>
                <button
                className="btn btn-danger"
                onClick={() => handleDelete(deleteConfirmId)}
                >
                Delete Book
                </button>
            </div>
            </div>
        </div>
        </div>
    </>
    )}
</>
);
}

export default AdminBooks;
