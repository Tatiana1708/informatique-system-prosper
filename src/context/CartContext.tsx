import React, { createContext, useContext, useEffect, useState } from 'react';
import { CartItem, Produit } from '../types';

interface CartContextType {
  cart: CartItem[];
  addToCart: (produit: Produit, quantite?: number) => void;
  removeFromCart: (produitId: string) => void;
  updateQuantity: (produitId: string, quantite: number) => void;
  clearCart: () => void;
  totalCount: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('isp_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('isp_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  const addToCart = (produit: Produit, quantite: number = 1) => {
    setCart((prev) => {
      const existingIdx = prev.findIndex((item) => item.produit.id === produit.id);
      if (existingIdx > -1) {
        const next = [...prev];
        next[existingIdx].quantite += quantite;
        return next;
      }
      return [...prev, { produit, quantite }];
    });
  };

  const removeFromCart = (produitId: string) => {
    setCart((prev) => prev.filter((item) => item.produit.id !== produitId));
  };

  const updateQuantity = (produitId: string, quantite: number) => {
    if (quantite <= 0) {
      removeFromCart(produitId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.produit.id === produitId ? { ...item, quantite } : item))
    );
  };

  const clearCart = () => setCart([]);

  const totalCount = cart.reduce((sum, item) => sum + item.quantite, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.produit.prix * item.quantite, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalCount,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
