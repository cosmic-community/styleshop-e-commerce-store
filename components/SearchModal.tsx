'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import { Product } from '@/types'

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

interface SearchFilters {
  collection: string
  minPrice: string
  maxPrice: string
  inStock: boolean
}

interface SearchResponse {
  products: Product[]
  total: number
  query: string
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<SearchFilters>({
    collection: '',
    minPrice: '',
    maxPrice: '',
    inStock: false,
  })
  const inputRef = useRef<HTMLInputElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)

  // Debounced search function
  const searchProducts = useCallback(async (searchQuery: string, searchFilters: SearchFilters) => {
    if (!searchQuery.trim() && !searchFilters.collection) {
      setResults([])
      return
    }

    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (searchQuery) params.set('q', searchQuery)
      if (searchFilters.collection) params.set('collection', searchFilters.collection)
      if (searchFilters.minPrice) params.set('minPrice', searchFilters.minPrice)
      if (searchFilters.maxPrice) params.set('maxPrice', searchFilters.maxPrice)
      if (searchFilters.inStock) params.set('inStock', 'true')

      const response = await fetch(`/api/search?${params.toString()}`)
      const data: SearchResponse = await response.json()
      setResults(data.products)
    } catch (error) {
      console.error('Search error:', error)
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Debounce effect
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      searchProducts(query, filters)
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [query, filters, searchProducts])

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  // Handle click outside
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose()
    }
  }

  const handleFilterChange = (key: keyof SearchFilters, value: string | boolean) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({
      collection: '',
      minPrice: '',
      maxPrice: '',
      inStock: false,
    })
  }

  const handleResultClick = () => {
    onClose()
    setQuery('')
    setResults([])
    clearFilters()
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-start justify-center pt-20"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className="bg-white w-full max-w-2xl mx-4 rounded-2xl shadow-2xl overflow-hidden animate-slide-up"
      >
        {/* Search Input */}
        <div className="p-4 border-b border-neutral-200">
          <div className="relative">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-12 pr-12 py-4 text-lg border-0 focus:ring-0 outline-none placeholder:text-neutral-400"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 bg-neutral-200 rounded-full flex items-center justify-center hover:bg-neutral-300 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Filter Toggle */}
          <div className="flex items-center justify-between mt-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 text-sm text-neutral-600 hover:text-primary transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
            {(filters.collection || filters.minPrice || filters.maxPrice || filters.inStock) && (
              <button
                onClick={clearFilters}
                className="text-sm text-accent hover:text-accent-dark transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="p-4 bg-neutral-50 border-b border-neutral-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Price Range</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none"
                  />
                  <span className="text-neutral-400">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none"
                  />
                </div>
              </div>

              {/* In Stock Only */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Availability</label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.inStock}
                    onChange={(e) => handleFilterChange('inStock', e.target.checked)}
                    className="w-4 h-4 text-accent border-neutral-300 rounded focus:ring-accent"
                  />
                  <span className="text-sm text-neutral-600">In Stock Only</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Search Results */}
        <div className="max-h-[60vh] overflow-y-auto">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="inline-block w-8 h-8 border-4 border-neutral-200 border-t-accent rounded-full animate-spin" />
              <p className="mt-3 text-neutral-500">Searching...</p>
            </div>
          ) : results.length > 0 ? (
            <div className="divide-y divide-neutral-100">
              {results.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  onClick={handleResultClick}
                  className="flex items-center gap-4 p-4 hover:bg-neutral-50 transition-colors"
                >
                  {product.metadata.product_image ? (
                    <img
                      src={`${product.metadata.product_image.imgix_url}?w=160&h=160&fit=crop&auto=format,compress`}
                      alt={product.metadata.name}
                      className="w-16 h-16 rounded-lg object-cover"
                      width={80}
                      height={80}
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-neutral-100 flex items-center justify-center">
                      <svg className="w-8 h-8 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-primary truncate">{product.metadata.name}</h4>
                    <p className="text-sm text-neutral-500">
                      ${product.metadata.price.toFixed(2)}
                      {!product.metadata.in_stock && (
                        <span className="ml-2 text-red-500">Out of Stock</span>
                      )}
                    </p>
                  </div>
                  <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}
            </div>
          ) : query || filters.collection || filters.minPrice || filters.maxPrice || filters.inStock ? (
            <div className="p-8 text-center">
              <svg className="w-12 h-12 text-neutral-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-neutral-500">No products found</p>
              <p className="text-sm text-neutral-400 mt-1">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="p-8 text-center">
              <svg className="w-12 h-12 text-neutral-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p className="text-neutral-500">Start typing to search products</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-neutral-50 border-t border-neutral-200 flex items-center justify-between">
          <span className="text-sm text-neutral-500">
            {results.length > 0 && `${results.length} result${results.length !== 1 ? 's' : ''} found`}
          </span>
          <Link
            href="/search"
            onClick={handleResultClick}
            className="text-sm text-accent hover:text-accent-dark font-medium transition-colors"
          >
            Advanced Search →
          </Link>
        </div>
      </div>
    </div>
  )
}