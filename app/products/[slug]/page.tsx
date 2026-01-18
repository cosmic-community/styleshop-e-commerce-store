// app/products/[slug]/page.tsx
import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getProduct, getProducts, getReviewsByProduct } from '@/lib/cosmic'
import StarRating from '@/components/StarRating'
import ReviewCard from '@/components/ReviewCard'
import ProductCard from '@/components/ProductCard'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await getProduct(slug)
  
  if (!product) {
    return {
      title: 'Product Not Found - StyleShop',
    }
  }

  return {
    title: `${product.metadata.name} - StyleShop`,
    description: product.metadata.description?.slice(0, 160) || `Shop ${product.metadata.name} at StyleShop`,
  }
}

export async function generateStaticParams() {
  const products = await getProducts()
  return products.map((product) => ({
    slug: product.slug,
  }))
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const product = await getProduct(slug)

  if (!product) {
    notFound()
  }

  const reviews = await getReviewsByProduct(product.id)
  const allProducts = await getProducts()
  const relatedProducts = allProducts
    .filter(p => p.id !== product.id)
    .slice(0, 3)

  const averageRating = reviews.length > 0
    ? reviews.reduce((acc, r) => acc + parseInt(r.metadata.rating.key), 0) / reviews.length
    : 0

  return (
    <div className="animate-fade-in">
      {/* Breadcrumb */}
      <div className="bg-neutral-100 py-4">
        <div className="max-w-7xl mx-auto container-padding">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-neutral-500 hover:text-primary transition-colors">
              Home
            </Link>
            <span className="text-neutral-400">/</span>
            <Link href="/products" className="text-neutral-500 hover:text-primary transition-colors">
              Products
            </Link>
            <span className="text-neutral-400">/</span>
            <span className="text-primary font-medium">{product.metadata.name}</span>
          </nav>
        </div>
      </div>

      {/* Product Details */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Image */}
            <div className="relative aspect-square bg-neutral-100 rounded-2xl overflow-hidden">
              {product.metadata.product_image ? (
                <img
                  src={`${product.metadata.product_image.imgix_url}?w=1200&h=1200&fit=crop&auto=format,compress`}
                  alt={product.metadata.name}
                  className="w-full h-full object-cover"
                  width={600}
                  height={600}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg className="w-24 h-24 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
              {!product.metadata.in_stock && (
                <div className="absolute top-4 left-4 bg-neutral-900/80 text-white px-4 py-2 rounded-lg text-sm font-medium">
                  Out of Stock
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              {/* Collection Badge */}
              {product.metadata.collection && (
                <Link
                  href={`/collections/${product.metadata.collection.slug}`}
                  className="inline-flex items-center gap-2 text-sm text-accent font-medium mb-4 hover:underline"
                >
                  <span className="w-2 h-2 bg-accent rounded-full" />
                  {product.metadata.collection.metadata.name}
                </Link>
              )}

              <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">
                {product.metadata.name}
              </h1>

              {/* Rating */}
              {reviews.length > 0 && (
                <div className="flex items-center gap-3 mb-6">
                  <StarRating rating={Math.round(averageRating)} />
                  <span className="text-neutral-500">
                    ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
                  </span>
                </div>
              )}

              {/* Price */}
              <div className="mb-6">
                <span className="text-4xl font-bold text-primary">
                  ${product.metadata.price.toFixed(2)}
                </span>
              </div>

              {/* Stock Status */}
              <div className="mb-6">
                {product.metadata.in_stock ? (
                  <span className="inline-flex items-center gap-2 text-green-600 font-medium">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    In Stock
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2 text-red-500 font-medium">
                    <span className="w-2 h-2 bg-red-500 rounded-full" />
                    Out of Stock
                  </span>
                )}
              </div>

              {/* Description */}
              {product.metadata.description && (
                <div className="prose prose-neutral max-w-none mb-8">
                  <div 
                    dangerouslySetInnerHTML={{ 
                      __html: product.metadata.description
                        .replace(/## /g, '<h3 class="text-xl font-semibold text-primary mt-6 mb-3">')
                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        .replace(/- /g, '<li class="ml-4">')
                        .replace(/\n/g, '</li>')
                    }} 
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 mt-auto pt-6 border-t border-neutral-200">
                <button 
                  className={`flex-1 btn-accent ${!product.metadata.in_stock ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={!product.metadata.in_stock}
                >
                  Add to Cart
                </button>
                <button className="btn-outline">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      {reviews.length > 0 && (
        <section className="section-padding bg-neutral-50">
          <div className="max-w-7xl mx-auto container-padding">
            <h2 className="text-2xl md:text-3xl font-bold text-primary mb-8">
              Customer Reviews ({reviews.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} showProduct={false} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="section-padding bg-white">
          <div className="max-w-7xl mx-auto container-padding">
            <h2 className="text-2xl md:text-3xl font-bold text-primary mb-8">
              You May Also Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}