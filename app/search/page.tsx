import { Metadata } from 'next'
import { getCollections } from '@/lib/cosmic'
import SearchPageClient from '@/components/SearchPageClient'

export const metadata: Metadata = {
  title: 'Search Products - StyleShop',
  description: 'Search our complete collection of premium products.',
}

export default async function SearchPage() {
  const collections = await getCollections()

  return <SearchPageClient collections={collections} />
}