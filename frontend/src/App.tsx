import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import BookList from './BookList';
import CartPage from './pages/CartPage';
import AdminBooks from './pages/AdminBooks';

function BookStoreRoutes() {
  const navigate = useNavigate();

  return (
    <Routes>
      <Route
        path="/"
        element={<BookList onGoToCart={() => navigate('/cart')} />}
      />
      <Route
        path="/cart"
        element={<CartPage onContinueShopping={() => navigate('/')} />}
      />
      <Route path="/adminbooks" element={<AdminBooks />} />
    </Routes>
  );
}

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <BookStoreRoutes />
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
