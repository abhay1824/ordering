import { createContext, useEffect, useMemo, useState } from "react";

const CART_STORAGE_KEY = "restaurant_cart";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (product) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.product === product._id);
      if (existing) {
        return prev.map((item) =>
          item.product === product._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }

      return [
        ...prev,
        {
          product: product._id,
          name: product.name,
          price: product.price,
          quantity: 1,
        },
      ];
    });
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((item) => item.product !== productId));
      return;
    }

    setItems((prev) =>
      prev.map((item) => (item.product === productId ? { ...item, quantity } : item))
    );
  };

  const removeItem = (productId) => {
    setItems((prev) => prev.filter((item) => item.product !== productId));
  };

  const clearCart = () => setItems([]);

  const totalPrice = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  const value = {
    items,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    totalPrice,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export { CartContext };
