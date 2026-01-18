'use client'

import Link from 'next/link'
import { Product } from '@/types'
import { useCart } from '@/contexts/CartContext'

interface ProductCardProps {
  product: Product
  showCollection?: boolean
}

export default function ProductCard({ product, showCollection = true }: ProductCardProps) {
  const { addToCart } = useCart()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (product.metadata.in_stock) {
      addToCart(product)
    }
  }

  return (
    <div className="card group relative">
      <Link href={`/products/${product.slug}`} className="block">
        {/* Image */}
        <div className="relative aspect-square bg-neutral-100 overflow-hidden">
          {product.metadata.product_image ? (
            <img
              src={`${product.metadata.product_image.imgix_url}?w=600&h=600&fit=crop&auto=format,compress`}
              alt={product.metadata.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              width={300}
              height={300}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg className="w-16 h-16 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          
          {/* Stock Badge */}
          {!product.metadata.in_stock && (
            <div className="absolute top-3 left-3 bg-neutral-900/80 text-white px-3 py-1 rounded-full text-xs font-medium">
              Out of Stock
            </div>
          )}

          {/* Quick View Overlay */}
          <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <span className="bg-white text-primary px-4 py-2 rounded-lg font-medium text-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
              View Details
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Collection Badge */}
          {showCollection && product.metadata.collection && (
            <span className="text-xs font-medium text-accent mb-2 block">
              {product.metadata.collection.metadata.name}
            </span>
          )}

          {/* Product Name */}
          <h3 className="text-lg font-semibold text-primary mb-2 line-clamp-2 group-hover:text-accent transition-colors">
            {product.metadata.name}
          </h3>

          {/* Price */}
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-primary">
              ${product.metadata.price.toFixed(2)}
            </span>
            {product.metadata.in_stock && (
              <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                In Stock
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Add to Cart Button */}
      {product.metadata.in_stock && (
        <button
          onClick={handleAddToCart}
          className="absolute bottom-4 right-4 w-10 h-10 bg-accent text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-accent/90 hover:scale-110 shadow-lg"
          aria-label={`Add ${product.metadata.name} to cart`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      )}
    </div>
  )
}