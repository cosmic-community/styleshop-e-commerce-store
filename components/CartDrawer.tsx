'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useCart } from '@/contexts/CartContext'
import CartItemCard from './CartItemCard'

export default function CartDrawer() {
  const { items, isCartOpen, setIsCartOpen, getCartTotal, clearCart } = useCart()

  // Prevent body scroll when cart is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isCartOpen])

  if (!isCartOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-200">
          <h2 className="text-xl font-bold text-primary">Shopping Cart</h2>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 text-neutral-500 hover:text-primary transition-colors"
            aria-label="Close cart"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <svg className="w-16 h-16 text-neutral-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <p className="text-neutral-500 mb-4">Your cart is empty</p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="btn-primary"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map(item => (
                <CartItemCard key={item.product.id} item={item} />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-neutral-200 p-4 space-y-4">
            <div className="flex items-center justify-between text-lg">
              <span className="font-medium text-neutral-600">Subtotal</span>
              <span className="font-bold text-primary">${getCartTotal().toFixed(2)}</span>
            </div>
            <p className="text-sm text-neutral-500">Shipping and taxes calculated at checkout</p>
            <div className="space-y-2">
              <Link
                href="/checkout"
                onClick={() => setIsCartOpen(false)}
                className="btn-accent w-full text-center block"
              >
                Proceed to Checkout
              </Link>
              <button
                onClick={clearCart}
                className="btn-outline w-full text-sm"
              >
                Clear Cart
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}