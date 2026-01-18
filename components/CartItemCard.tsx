'use client'

import Link from 'next/link'
import { useCart } from '@/contexts/CartContext'
import { CartItem } from '@/types'

interface CartItemCardProps {
  item: CartItem
}

export default function CartItemCard({ item }: CartItemCardProps) {
  const { updateQuantity, removeFromCart, setIsCartOpen } = useCart()
  const { product, quantity } = item

  return (
    <div className="flex gap-4 p-4 bg-neutral-50 rounded-lg">
      {/* Product Image */}
      <Link
        href={`/products/${product.slug}`}
        onClick={() => setIsCartOpen(false)}
        className="flex-shrink-0 w-20 h-20 bg-neutral-200 rounded-lg overflow-hidden"
      >
        {product.metadata.product_image ? (
          <img
            src={`${product.metadata.product_image.imgix_url}?w=160&h=160&fit=crop&auto=format,compress`}
            alt={product.metadata.name}
            className="w-full h-full object-cover"
            width={80}
            height={80}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </Link>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <Link
          href={`/products/${product.slug}`}
          onClick={() => setIsCartOpen(false)}
          className="font-medium text-primary hover:text-accent transition-colors line-clamp-1"
        >
          {product.metadata.name}
        </Link>
        <p className="text-accent font-semibold mt-1">
          ${product.metadata.price.toFixed(2)}
        </p>

        {/* Quantity Controls */}
        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={() => updateQuantity(product.id, quantity - 1)}
            className="w-7 h-7 flex items-center justify-center bg-neutral-200 rounded hover:bg-neutral-300 transition-colors text-sm"
            aria-label="Decrease quantity"
          >
            -
          </button>
          <span className="w-8 text-center font-medium">{quantity}</span>
          <button
            onClick={() => updateQuantity(product.id, quantity + 1)}
            className="w-7 h-7 flex items-center justify-center bg-neutral-200 rounded hover:bg-neutral-300 transition-colors text-sm"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      </div>

      {/* Remove Button */}
      <button
        onClick={() => removeFromCart(product.id)}
        className="flex-shrink-0 p-1 text-neutral-400 hover:text-red-500 transition-colors"
        aria-label="Remove item"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  )
}