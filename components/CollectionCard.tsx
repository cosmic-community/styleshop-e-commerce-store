import Link from 'next/link'
import { Collection } from '@/types'

interface CollectionCardProps {
  collection: Collection
}

export default function CollectionCard({ collection }: CollectionCardProps) {
  return (
    <Link 
      href={`/collections/${collection.slug}`} 
      className="group relative block h-72 md:h-96 rounded-2xl overflow-hidden"
    >
      {/* Background Image */}
      {collection.metadata.collection_image ? (
        <img
          src={`${collection.metadata.collection_image.imgix_url}?w=1200&h=800&fit=crop&auto=format,compress`}
          alt={collection.metadata.name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          width={600}
          height={400}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary-light" />
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
        <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 group-hover:text-accent transition-colors">
          {collection.metadata.name}
        </h3>
        {collection.metadata.description && (
          <p className="text-white/80 line-clamp-2 mb-4 max-w-md">
            {collection.metadata.description}
          </p>
        )}
        <span className="inline-flex items-center gap-2 text-accent font-medium group-hover:gap-4 transition-all">
          Shop Collection
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </span>
      </div>
    </Link>
  )
}