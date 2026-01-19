import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CosmicBadge from '@/components/CosmicBadge'

const inter = Inter({ subsets: ['latin'] })

// Changed: Added random emoji favicon
const emojis = ['🛍️', '👗', '👠', '💎', '✨', '🎀', '👜', '🧥', '👔', '💅']
const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)]

export const metadata: Metadata = {
  title: 'StyleShop - Premium Fashion & Lifestyle',
  description: 'Discover curated collections of premium fashion, accessories, and lifestyle products.',
  icons: {
    icon: `data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>${randomEmoji}</text></svg>`,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const bucketSlug = process.env.COSMIC_BUCKET_SLUG as string

  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <CosmicBadge bucketSlug={bucketSlug} />
        <script src="/dashboard-console-capture.js" defer />
      </body>
    </html>
  )
}