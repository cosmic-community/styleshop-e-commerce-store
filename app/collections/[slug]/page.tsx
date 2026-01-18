// app/collections/[slug]/page.tsx
import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCollection, getCollections, getProductsByCollection } from '@/lib/cosmic'
import ProductCard from '@/components/ProductCard'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const collection = await getCollection(slug)
  
  if (!collection) {
    return {
      title: 'Collection Not Found - StyleShop',
    }
  }

  return {
    title: `${collection.metadata.name} - StyleShop Collections`,
    description: collection.metadata.description || `Shop ${collection.metadata.name} collection at StyleShop`,
  }
}

export async function generateStaticParams() {
  const collections = await getCollections()
  return collections.map((collection) => ({
    slug: collection.slug,
  }))
}

export default async function CollectionPage({ params }: Props) {
  const { slug } = await params
  const collection = await getCollection(slug)

  if (!collection) {
    notFound()
  }

  const products = await getProductsByCollection(collection.id)

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
            <Link href="/collections" className="text-neutral-500 hover:text-primary transition-colors">
              Collections
            </Link>
            <span className="text-neutral-400">/</span>
            <span className="text-primary font-medium">{collection.metadata.name}</span>
          </nav>
        </div>
      </div>

      {/* Collection Header */}
      <section className="relative bg-primary text-white overflow-hidden">
        {collection.metadata.collection_image && (
          <div className="absolute inset-0">
            <img
              src={`${collection.metadata.collection_image.imgix_url}?w=1920&h=800&fit=crop&auto=format,compress`}
              alt={collection.metadata.name}
              className="w-full h-full object-cover opacity-30"
              width={1920}
              height={800}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-primary/70" />
          </div>
        )}
        <div className="relative max-w-7xl mx-auto container-padding py-20">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{collection.metadata.name}</h1>
          {collection.metadata.description && (
            <p className="text-lg text-neutral-300 max-w-2xl">
              {collection.metadata.description}
            </p>
          )}
          <p className="mt-6 text-accent font-medium">
            {products.length} {products.length === 1 ? 'Product' : 'Products'}
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="section-padding bg-neutral-50">
        <div className="max-w-7xl mx-auto container-padding">
          {products.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-neutral-600 text-lg mb-4">No products in this collection yet.</p>
              <Link href="/products" className="btn-primary">
                Browse All Products
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}