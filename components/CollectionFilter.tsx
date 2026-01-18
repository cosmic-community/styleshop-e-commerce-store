import Link from 'next/link'
import { Collection } from '@/types'

interface CollectionFilterProps {
  collections: Collection[]
}

export default function CollectionFilter({ collections }: CollectionFilterProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-100 sticky top-24">
      <h3 className="font-semibold text-primary mb-4">Collections</h3>
      <ul className="space-y-2">
        <li>
          <Link
            href="/products"
            className="block px-3 py-2 rounded-lg text-neutral-600 hover:bg-neutral-100 hover:text-primary transition-colors font-medium"
          >
            All Products
          </Link>
        </li>
        {collections.map((collection) => (
          <li key={collection.id}>
            <Link
              href={`/collections/${collection.slug}`}
              className="block px-3 py-2 rounded-lg text-neutral-600 hover:bg-neutral-100 hover:text-primary transition-colors"
            >
              {collection.metadata.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}