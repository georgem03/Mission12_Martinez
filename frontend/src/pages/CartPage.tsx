import { useCart } from '../context/CartContext';

interface CartPageProps {
onContinueShopping: () => void;
}

function CartPage({ onContinueShopping }: CartPageProps) {
const { cartItems, removeFromCart, updateQuantity, totalPrice, clearCart } =
useCart();

return (
<div className="container py-4">
    {/* Breadcrumb — Bootstrap component not covered in videos */}
    <nav aria-label="breadcrumb" className="mb-3">
    <ol className="breadcrumb">
        <li className="breadcrumb-item">
        <button
            className="btn btn-link p-0 text-decoration-none"
            onClick={onContinueShopping}
        >
            Bookstore
        </button>
        </li>
        <li className="breadcrumb-item active" aria-current="page">
        Shopping Cart
        </li>
    </ol>
    </nav>

    <div className="row">
    <div className="col-12">
        <h2 className="mb-4">
        <i className="bi bi-cart3 me-2"></i>Your Shopping Cart
        </h2>
    </div>
    </div>

    {cartItems.length === 0 ? (
    <div className="row">
        <div className="col-12 text-center py-5">
        {/* Bootstrap Alert — styled empty state */}
        <div className="alert alert-info d-inline-block px-5 py-4" role="alert">
            <i className="bi bi-cart-x fs-1 d-block mb-3"></i>
            <h4>Your cart is empty</h4>
            <p className="mb-3">Browse our collection and add some books!</p>
            <button
            className="btn btn-primary"
            onClick={onContinueShopping}
            >
            Browse Books
            </button>
        </div>
        </div>
    </div>
    ) : (
    <div className="row g-4">
        {/* Cart Items */}
        <div className="col-lg-8">
        <div className="card shadow-sm">
            <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
            <span className="fw-semibold">Cart Items ({cartItems.length})</span>
            <button
                className="btn btn-sm btn-outline-light"
                onClick={clearCart}
            >
                Clear All
            </button>
            </div>
            <div className="card-body p-0">
            <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                    <tr>
                    <th>Book</th>
                    <th className="text-center">Price</th>
                    <th className="text-center">Qty</th>
                    <th className="text-center">Subtotal</th>
                    <th></th>
                    </tr>
                </thead>
                <tbody>
                    {cartItems.map((item) => (
                    <tr key={item.book.bookId}>
                        <td>
                        <div className="fw-semibold">{item.book.title}</div>
                        <div className="text-muted small">
                            {item.book.author}
                        </div>
                        <span className="badge bg-secondary mt-1">
                            {item.book.category}
                        </span>
                        </td>
                        <td className="text-center">
                        ${Number(item.book.price).toFixed(2)}
                        </td>
                        <td className="text-center" style={{ width: '130px' }}>
                        <div className="input-group input-group-sm justify-content-center">
                            <button
                            className="btn btn-outline-secondary"
                            onClick={() =>
                                updateQuantity(
                                item.book.bookId,
                                item.quantity - 1
                                )
                            }
                            >
                            −
                            </button>
                            <input
                            type="number"
                            className="form-control text-center"
                            style={{ maxWidth: '50px' }}
                            value={item.quantity}
                            min={1}
                            onChange={(e) =>
                                updateQuantity(
                                item.book.bookId,
                                parseInt(e.target.value) || 1
                                )
                            }
                            />
                            <button
                            className="btn btn-outline-secondary"
                            onClick={() =>
                                updateQuantity(
                                item.book.bookId,
                                item.quantity + 1
                                )
                            }
                            >
                            +
                            </button>
                        </div>
                        </td>
                        <td className="text-center fw-semibold">
                        $
                        {(item.book.price * item.quantity).toFixed(2)}
                        </td>
                        <td className="text-center">
                        <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => removeFromCart(item.book.bookId)}
                            title="Remove"
                        >
                            ✕
                        </button>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
            </div>
        </div>

        <div className="mt-3">
            <button
            className="btn btn-outline-primary"
            onClick={onContinueShopping}
            >
            ← Continue Shopping
            </button>
        </div>
        </div>

        {/* Order Summary */}
        <div className="col-lg-4">
        <div className="card shadow-sm">
            <div className="card-header bg-dark text-white">
            <span className="fw-semibold">Order Summary</span>
            </div>
            <div className="card-body">
            {cartItems.map((item) => (
                <div
                key={item.book.bookId}
                className="d-flex justify-content-between mb-2 small"
                >
                <span className="text-truncate me-2">
                    {item.book.title}{' '}
                    <span className="text-muted">×{item.quantity}</span>
                </span>
                <span className="fw-semibold text-nowrap">
                    ${(item.book.price * item.quantity).toFixed(2)}
                </span>
                </div>
            ))}
            <hr />
            <div className="d-flex justify-content-between fs-5 fw-bold">
                <span>Total</span>
                <span className="text-success">${totalPrice.toFixed(2)}</span>
            </div>
            <div className="d-grid mt-3">
                <button className="btn btn-success btn-lg">
                Proceed to Checkout
                </button>
            </div>
            </div>
        </div>
        </div>
    </div>
    )}
</div>
);
}

export default CartPage;