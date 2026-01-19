'use client'

import { useState, useEffect, useCallback } from 'react'
import { Collection, Product } from '@/types'
import ProductCard from './ProductCard'

interface SearchPageClientProps {
  collections: Collection[]
}

interface SearchFilters {
  collection: string
  minPrice: string
  maxPrice: string
  inStock: boolean
  sortBy: string
}

interface SearchResponse {
  products: Product[]
  total: number
  query: string
}

export default function SearchPageClient({ collections }: SearchPageClientProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [filters, setFilters] = useState<SearchFilters>({
    collection: '',
    minPrice: '',
    maxPrice: '',
    inStock: false,
    sortBy: 'relevance',
  })

  const searchProducts = useCallback(async (searchQuery: string, searchFilters: SearchFilters) => {
    setIsLoading(true)
    setHasSearched(true)
    try {
      const params = new URLSearchParams()
      if (searchQuery) params.set('q', searchQuery)
      if (searchFilters.collection) params.set('collection', searchFilters.collection)
      if (searchFilters.minPrice) params.set('minPrice', searchFilters.minPrice)
      if (searchFilters.maxPrice) params.set('maxPrice', searchFilters.maxPrice)
      if (searchFilters.inStock) params.set('inStock', 'true')

      const response = await fetch(`/api/search?${params.toString()}`)
      const data: SearchResponse = await response.json()
      
      let sortedProducts = [...data.products]
      
      // Apply sorting
      switch (searchFilters.sortBy) {
        case 'price-asc':
          sortedProducts.sort((a, b) => a.metadata.price - b.metadata.price)
          break
        case 'price-desc':
          sortedProducts.sort((a, b) => b.metadata.price - a.metadata.price)
          break
        case 'name-asc':
          sortedProducts.sort((a, b) => a.metadata.name.localeCompare(b.metadata.name))
          break
        case 'name-desc':
          sortedProducts.sort((a, b) => b.metadata.name.localeCompare(a.metadata.name))
          break
        default:
          // Keep original order (relevance)
          break
      }
      
      setResults(sortedProducts)
    } catch (error) {
      console.error('Search error:', error)
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Debounce effect for search
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (query || filters.collection) {
        searchProducts(query, filters)
      }
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [query, filters, searchProducts])

  const handleFilterChange = (key: keyof SearchFilters, value: string | boolean) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({
      collection: '',
      minPrice: '',
      maxPrice: '',
      inStock: false,
      sortBy: 'relevance',
    })
    setQuery('')
    setResults([])
    setHasSearched(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    searchProducts(query, filters)
  }

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <section className="bg-primary text-white py-16">
        <div className="max-w-7xl mx-auto container-padding">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Search Products</h1>
          <p className="text-lg text-neutral-300 max-w-2xl">
            Find exactly what you&apos;re looking for with our advanced search and filtering options.
          </p>
        </div>
      </section>

      {/* Search Section */}
      <section className="section-padding bg-neutral-50">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar - Filters */}
            <aside className="lg:w-72 flex-shrink-0">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-100 sticky top-24">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-primary">Filters</h3>
                  <button
                    onClick={clearFilters}
                    className="text-sm text-accent hover:text-accent-dark transition-colors"
                  >
                    Clear All
                  </button>
                </div>

                {/* Collection Filter */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Collection</label>
                  <select
                    value={filters.collection}
                    onChange={(e) => handleFilterChange('collection', e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none text-sm"
                  >
                    <option value="">All Collections</option>
                    {collections.map((collection) => (
                      <option key={collection.id} value={collection.id}>
                        {collection.metadata.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Price Range</label>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-sm">$</span>
                      <input
                        type="number"
                        placeholder="Min"
                        value={filters.minPrice}
                        onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                        className="w-full pl-7 pr-3 py-2 text-sm border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none"
                      />
                    </div>
                    <span className="text-neutral-400">-</span>
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-sm">$</span>
                      <input
                        type="number"
                        placeholder="Max"
                        value={filters.maxPrice}
                        onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                        className="w-full pl-7 pr-3 py-2 text-sm border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* In Stock */}
                <div className="mb-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.inStock}
                      onChange={(e) => handleFilterChange('inStock', e.target.checked)}
                      className="w-4 h-4 text-accent border-neutral-300 rounded focus:ring-accent"
                    />
                    <span className="text-sm text-neutral-700">In Stock Only</span>
                  </label>
                </div>

                {/* Sort By */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Sort By</label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none text-sm"
                  >
                    <option value="relevance">Relevance</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="name-asc">Name: A to Z</option>
                    <option value="name-desc">Name: Z to A</option>
                  </select>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1">
              {/* Search Bar */}
              <form onSubmit={handleSubmit} className="mb-8">
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
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search products by name or description..."
                    className="w-full pl-12 pr-32 py-4 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-accent focus:border-accent outline-none text-lg shadow-sm"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-accent text-white px-6 py-2 rounded-lg font-medium hover:bg-accent-dark transition-colors"
                  >
                    Search
                  </button>
                </div>
              </form>

              {/* Results Header */}
              {hasSearched && (
                <div className="flex items-center justify-between mb-6">
                  <p className="text-neutral-600">
                    {isLoading ? (
                      'Searching...'
                    ) : (
                      <>
                        Found <span className="font-semibold text-primary">{results.length}</span> product{results.length !== 1 ? 's' : ''}
                        {query && (
                          <span className="text-neutral-500">
                            {' '}for &quot;<span className="text-primary">{query}</span>&quot;
                          </span>
                        )}
                      </>
                    )}
                  </p>
                </div>
              )}

              {/* Results */}
              {isLoading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="inline-block w-10 h-10 border-4 border-neutral-200 border-t-accent rounded-full animate-spin" />
                </div>
              ) : results.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {results.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : hasSearched ? (
                <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-neutral-100">
                  <svg className="w-16 h-16 text-neutral-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-xl font-semibold text-primary mb-2">No products found</h3>
                  <p className="text-neutral-500 mb-6">Try adjusting your search terms or filters</p>
                  <button
                    onClick={clearFilters}
                    className="btn-accent"
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-neutral-100">
                  <svg className="w-16 h-16 text-neutral-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <h3 className="text-xl font-semibold text-primary mb-2">Ready to search</h3>
                  <p className="text-neutral-500">Enter a search term or select filters to find products</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}