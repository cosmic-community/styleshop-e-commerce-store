import Link from 'next/link'
import { getProducts, getCollections, getReviews } from '@/lib/cosmic'
import ProductCard from '@/components/ProductCard'
import CollectionCard from '@/components/CollectionCard'
import ReviewCard from '@/components/ReviewCard'

export default async function HomePage() {
  const [products, collections, reviews] = await Promise.all([
    getProducts(),
    getCollections(),
    getReviews()
  ])

  const featuredProducts = products.slice(0, 3)
  const featuredReviews = reviews.slice(0, 3)

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative bg-primary text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-light to-primary-dark opacity-90" />
        <div className="relative max-w-7xl mx-auto container-padding section-padding">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Discover Your <span className="text-accent">Style</span>
            </h1>
            <p className="text-lg md:text-xl text-neutral-300 mb-8 leading-relaxed">
              Explore our curated collections of premium products. From everyday essentials to statement pieces, find everything you need to express yourself.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/products" className="btn-accent">
                Shop Now
              </Link>
              <Link href="/collections" className="btn-outline border-white text-white hover:bg-white hover:text-primary">
                View Collections
              </Link>
            </div>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-20 right-10 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-1/4 w-48 h-48 bg-white/5 rounded-full blur-2xl" />
      </section>

      {/* Collections Section */}
      {collections.length > 0 && (
        <section className="section-padding bg-white">
          <div className="max-w-7xl mx-auto container-padding">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
                Shop by Collection
              </h2>
              <p className="text-neutral-600 max-w-2xl mx-auto">
                Browse our carefully curated collections designed to help you find exactly what you&apos;re looking for.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {collections.map((collection) => (
                <CollectionCard key={collection.id} collection={collection} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products Section */}
      {featuredProducts.length > 0 && (
        <section className="section-padding bg-neutral-50">
          <div className="max-w-7xl mx-auto container-padding">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
                  Featured Products
                </h2>
                <p className="text-neutral-600">
                  Handpicked items just for you
                </p>
              </div>
              <Link 
                href="/products" 
                className="btn-primary mt-4 md:mt-0"
              >
                View All Products
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Customer Reviews Section */}
      {featuredReviews.length > 0 && (
        <section className="section-padding bg-white">
          <div className="max-w-7xl mx-auto container-padding">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
                What Our Customers Say
              </h2>
              <p className="text-neutral-600 max-w-2xl mx-auto">
                Real reviews from real customers who love our products
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredReviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-br from-primary to-primary-light text-white">
        <div className="max-w-7xl mx-auto container-padding text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Find Your Perfect Style?
          </h2>
          <p className="text-lg text-neutral-300 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who have discovered their signature look with StyleShop.
          </p>
          <Link href="/products" className="btn-accent inline-flex items-center gap-2">
            Start Shopping
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  )
}