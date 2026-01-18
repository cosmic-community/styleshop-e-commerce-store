'use client'

import { useState } from 'react'
import { useCart } from '@/contexts/CartContext'
import { Product } from '@/types'

interface AddToCartButtonProps {
  product: Product
  className?: string
  showQuantity?: boolean
}

export default function AddToCartButton({ product, className = '', showQuantity = false }: AddToCartButtonProps) {
  const { addToCart } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)

  const handleAddToCart = () => {
    if (!product.metadata.in_stock) return
    
    setIsAdding(true)
    addToCart(product, quantity)
    
    // Reset animation after a short delay
    setTimeout(() => {
      setIsAdding(false)
      if (showQuantity) setQuantity(1)
    }, 500)
  }

  if (!product.metadata.in_stock) {
    return (
      <button
        disabled
        className={`btn-accent opacity-50 cursor-not-allowed ${className}`}
      >
        Out of Stock
      </button>
    )
  }

  return (
    <div className={`flex items-center gap-3 ${showQuantity ? 'flex-wrap' : ''}`}>
      {showQuantity && (
        <div className="flex items-center border border-neutral-200 rounded-lg">
          <button
            onClick={() => setQuantity(q => Math.max(1, q - 1))}
            className="px-3 py-2 text-neutral-600 hover:text-primary transition-colors"
            aria-label="Decrease quantity"
          >
            -
          </button>
          <span className="px-4 py-2 font-medium min-w-[3rem] text-center">{quantity}</span>
          <button
            onClick={() => setQuantity(q => q + 1)}
            className="px-3 py-2 text-neutral-600 hover:text-primary transition-colors"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      )}
      <button
        onClick={handleAddToCart}
        className={`btn-accent flex-1 transition-all duration-300 ${isAdding ? 'scale-95 bg-green-500' : ''} ${className}`}
      >
        {isAdding ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Added!
          </span>
        ) : (
          'Add to Cart'
        )}
      </button>
    </div>
  )
}