import { NextRequest, NextResponse } from 'next/server'
import { cosmic } from '@/lib/cosmic'
import { Product, hasStatus } from '@/types'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('q') || ''
  const collection = searchParams.get('collection') || ''
  const minPrice = searchParams.get('minPrice') || ''
  const maxPrice = searchParams.get('maxPrice') || ''
  const inStock = searchParams.get('inStock') || ''

  try {
    // Build the query object
    const queryObject: Record<string, unknown> = { type: 'products' }
    
    // Add collection filter if provided
    if (collection) {
      queryObject['metadata.collection'] = collection
    }

    const response = await cosmic.objects
      .find(queryObject)
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)

    let products = response.objects as Product[]

    // Filter by search query (name and description)
    if (query) {
      const lowerQuery = query.toLowerCase()
      products = products.filter((product) => {
        const name = product.metadata.name?.toLowerCase() || ''
        const description = product.metadata.description?.toLowerCase() || ''
        return name.includes(lowerQuery) || description.includes(lowerQuery)
      })
    }

    // Filter by price range
    if (minPrice) {
      const min = parseFloat(minPrice)
      if (!isNaN(min)) {
        products = products.filter((product) => product.metadata.price >= min)
      }
    }

    if (maxPrice) {
      const max = parseFloat(maxPrice)
      if (!isNaN(max)) {
        products = products.filter((product) => product.metadata.price <= max)
      }
    }

    // Filter by stock status
    if (inStock === 'true') {
      products = products.filter((product) => product.metadata.in_stock === true)
    }

    return NextResponse.json({
      products,
      total: products.length,
      query,
    })
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return NextResponse.json({
        products: [],
        total: 0,
        query,
      })
    }
    return NextResponse.json(
      { error: 'Failed to search products' },
      { status: 500 }
    )
  }
}