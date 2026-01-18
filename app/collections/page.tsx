import { Metadata } from 'next'
import { getCollections } from '@/lib/cosmic'
import CollectionCard from '@/components/CollectionCard'

export const metadata: Metadata = {
  title: 'Collections - StyleShop',
  description: 'Browse our curated collections of premium products.',
}

export default async function CollectionsPage() {
  const collections = await getCollections()

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <section className="bg-primary text-white py-16">
        <div className="max-w-7xl mx-auto container-padding">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Collections</h1>
          <p className="text-lg text-neutral-300 max-w-2xl">
            Explore our carefully curated collections, each designed to help you find your perfect style.
          </p>
        </div>
      </section>

      {/* Collections Grid */}
      <section className="section-padding bg-neutral-50">
        <div className="max-w-7xl mx-auto container-padding">
          {collections.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-neutral-600 text-lg">No collections found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {collections.map((collection) => (
                <CollectionCard key={collection.id} collection={collection} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}