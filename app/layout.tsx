import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CosmicBadge from '@/components/CosmicBadge'
import { CartProvider } from '@/contexts/CartContext'

export const metadata: Metadata = {
  title: 'StyleShop - Modern E-Commerce Store',
  description: 'Discover curated collections of premium products. Shop the latest styles in fashion, accessories, and more.',
  keywords: ['e-commerce', 'fashion', 'shopping', 'style', 'accessories'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const bucketSlug = process.env.COSMIC_BUCKET_SLUG as string

  return (
    <html lang="en">
      <head>
        <script src="/dashboard-console-capture.js" />
      </head>
      <body className="min-h-screen flex flex-col">
        <CartProvider>
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
          <CosmicBadge bucketSlug={bucketSlug} />
        </CartProvider>
      </body>
    </html>
  )
}