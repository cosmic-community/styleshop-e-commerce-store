import Link from 'next/link'
import { Review } from '@/types'
import StarRating from './StarRating'

interface ReviewCardProps {
  review: Review
  showProduct?: boolean
}

export default function ReviewCard({ review, showProduct = true }: ReviewCardProps) {
  const rating = parseInt(review.metadata.rating.key)

  // Changed: Safely access product data with null checks
  const product = review.metadata.product
  const productName = product?.metadata?.name
  const productSlug = product?.slug
  const productImage = product?.metadata?.product_image
  const productPrice = product?.metadata?.price

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-100">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h4 className="font-semibold text-primary">{review.metadata.customer_name}</h4>
          <StarRating rating={rating} size="sm" />
        </div>
        <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
          <span className="text-accent font-bold text-lg">
            {review.metadata.customer_name.charAt(0).toUpperCase()}
          </span>
        </div>
      </div>

      {/* Comment */}
      {review.metadata.comment && (
        <p className="text-neutral-600 mb-4 line-clamp-4">
          &quot;{review.metadata.comment}&quot;
        </p>
      )}

      {/* Product Link - Changed: Added comprehensive null checks */}
      {showProduct && productSlug && productName && (
        <Link 
          href={`/products/${productSlug}`}
          className="flex items-center gap-3 pt-4 border-t border-neutral-100 group"
        >
          {productImage && (
            <div className="w-12 h-12 rounded-lg overflow-hidden bg-neutral-100 flex-shrink-0">
              <img
                src={`${productImage.imgix_url}?w=100&h=100&fit=crop&auto=format,compress`}
                alt={productName}
                className="w-full h-full object-cover"
                width={48}
                height={48}
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-primary group-hover:text-accent transition-colors truncate">
              {productName}
            </p>
            {productPrice !== undefined && (
              <p className="text-sm text-neutral-500">
                ${productPrice.toFixed(2)}
              </p>
            )}
          </div>
        </Link>
      )}
    </div>
  )
}