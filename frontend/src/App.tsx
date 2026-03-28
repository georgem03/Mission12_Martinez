import { useState } from 'react';
import { CartProvider } from './context/CartContext';
import BookList from './BookList';
import CartPage from './pages/CartPage';

type Page = 'books' | 'cart';

function App() {
const [currentPage, setCurrentPage] = useState<Page>('books');

return (
  <CartProvider>
    {currentPage === 'books' ? (
      <BookList onGoToCart={() => setCurrentPage('cart')} />
    ) : (
      <CartPage onContinueShopping={() => setCurrentPage('books')} />
    )}
  </CartProvider>
);
}

export default App;
 