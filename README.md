# StyleShop E-Commerce Store

![StyleShop E-Commerce Store](https://imgix.cosmicjs.com/d092a9e0-f4c6-11f0-95ed-edd347b9d13a-photo-1441986300917-64674bd600d8-1768779518316.jpg?w=1200&h=300&fit=crop&auto=format,compress)

A beautiful, modern e-commerce storefront built with Next.js 16 and powered by Cosmic CMS. StyleShop showcases products, collections, and customer reviews with an elegant, responsive design.

## Features

- 🛍️ **Product Catalog** - Browse all products with rich details and imagery
- 🗂️ **Collection Pages** - Curated product groupings with dedicated pages
- ⭐ **Customer Reviews** - Star ratings and testimonials on product pages
- 📱 **Fully Responsive** - Beautiful on mobile, tablet, and desktop
- 🏷️ **Stock Status** - Real-time availability indicators
- 🔍 **SEO Optimized** - Server-side rendering with meta tags
- 🎨 **Modern Design** - Clean, minimalist aesthetic with smooth animations

## Clone this Project

Want to create your own version of this project with all the content and structure? Clone this Cosmic bucket and code repository to get started instantly:

[![Clone this Project](https://img.shields.io/badge/Clone%20this%20Project-29abe2?style=for-the-badge&logo=cosmic&logoColor=white)](http://localhost:3040/projects/new?clone_bucket=696d6ebc1695f59af52de028&clone_repository=696d701d1695f59af52de046)

## Prompts

This application was built using the following prompts to generate the content structure and code:

### Content Model Prompt

> "Design a content model for an e-commerce store with products, collections, and customer reviews"

### Code Generation Prompt

> "Based on the content model I created for 'Design a content model for an e-commerce store with products, collections, and customer reviews', now build a complete web application that showcases this content. Include a modern, responsive design with proper navigation, content display, and user-friendly interface."

The app has been tailored to work with your existing Cosmic content structure and includes all the features requested above.

## Technologies

- [Next.js 16](https://nextjs.org/) - React framework with App Router
- [Cosmic](https://www.cosmicjs.com/) - Headless CMS for content management
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- A Cosmic account with the e-commerce content model

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd styleshop-ecommerce
```

2. Install dependencies:
```bash
bun install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Add your Cosmic credentials to `.env.local`:
```
COSMIC_BUCKET_SLUG=your-bucket-slug
COSMIC_READ_KEY=your-read-key
COSMIC_WRITE_KEY=your-write-key
```

5. Run the development server:
```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Cosmic SDK Examples

### Fetching Products
```typescript
import { cosmic } from '@/lib/cosmic'

const { objects: products } = await cosmic.objects
  .find({ type: 'products' })
  .props(['id', 'title', 'slug', 'metadata'])
  .depth(1)
```

### Fetching a Single Product with Reviews
```typescript
const { object: product } = await cosmic.objects
  .findOne({ type: 'products', slug: productSlug })
  .props(['id', 'title', 'slug', 'metadata'])
  .depth(1)
```

### Fetching Collections
```typescript
const { objects: collections } = await cosmic.objects
  .find({ type: 'collections' })
  .props(['id', 'title', 'slug', 'metadata'])
  .depth(1)
```

## Cosmic CMS Integration

This application integrates with the following Cosmic object types:

### Products
- **name** (text) - Product name
- **description** (markdown) - Product details
- **price** (number) - Product price
- **product_image** (file) - Product image
- **collection** (object) - Related collection
- **in_stock** (switch) - Availability status

### Collections
- **name** (text) - Collection name
- **description** (textarea) - Collection description
- **collection_image** (file) - Collection banner image

### Reviews
- **customer_name** (text) - Reviewer name
- **rating** (select-dropdown) - 1-5 star rating
- **comment** (textarea) - Review text
- **product** (object) - Related product

For more information, visit the [Cosmic documentation](https://www.cosmicjs.com/docs).

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables in the Vercel dashboard
4. Deploy!

### Netlify

1. Push your code to GitHub
2. Import the project in Netlify
3. Set build command to `bun run build`
4. Add environment variables
5. Deploy!

## License

MIT License - feel free to use this project for your own e-commerce needs.
<!-- README_END -->