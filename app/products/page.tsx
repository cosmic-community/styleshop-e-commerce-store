import { Metadata } from 'next'
import { getProducts, getCollections } from '@/lib/cosmic'
import ProductCard from '@/components/ProductCard'
import CollectionFilter from '@/components/CollectionFilter'

export const metadata: Metadata = {
  title: 'All Products - StyleShop',
  description: 'Browse our complete collection of premium products.',
}

export default async function ProductsPage() {
  const [products, collections] = await Promise.all([
    getProducts(),
    getCollections()
  ])

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <section className="bg-primary text-white py-16">
        <div className="max-w-7xl mx-auto container-padding">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">All Products</h1>
          <p className="text-lg text-neutral-300 max-w-2xl">
            Explore our complete catalog of premium products, from everyday essentials to statement pieces.
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="section-padding bg-neutral-50">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar - Collections Filter */}
            <aside className="lg:w-64 flex-shrink-0">
              <CollectionFilter collections={collections} />
            </aside>

            {/* Products */}
            <div className="flex-1">
              {products.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-neutral-600 text-lg">No products found.</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-8">
                    <p className="text-neutral-600">
                      Showing <span className="font-semibold text-primary">{products.length}</span> products
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {products.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}