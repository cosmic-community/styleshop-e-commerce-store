// Base Cosmic object interface
export interface CosmicObject {
  id: string;
  slug: string;
  title: string;
  content?: string;
  metadata: Record<string, unknown>;
  type: string;
  created_at?: string;
  modified_at?: string;
}

// File metafield interface
export interface CosmicFile {
  url: string;
  imgix_url: string;
}

// Collection type
export interface Collection extends CosmicObject {
  type: 'collections';
  metadata: {
    name: string;
    description?: string;
    collection_image?: CosmicFile;
  };
}

// Product type
export interface Product extends CosmicObject {
  type: 'products';
  metadata: {
    name: string;
    description?: string;
    price: number;
    product_image?: CosmicFile;
    collection?: Collection;
    in_stock: boolean;
  };
}

// Rating type for select-dropdown
export interface Rating {
  key: string;
  value: string;
}

// Review type
export interface Review extends CosmicObject {
  type: 'reviews';
  metadata: {
    customer_name: string;
    rating: Rating;
    comment?: string;
    product: Product;
  };
}

// API Response types
export interface CosmicResponse<T> {
  objects: T[];
  total: number;
}

export interface CosmicSingleResponse<T> {
  object: T;
}

// Helper function to check error status
export function hasStatus(error: unknown): error is { status: number } {
  return typeof error === 'object' && error !== null && 'status' in error;
}

// Contact form data type
export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

// Contact form response type
export interface ContactFormResponse {
  success: boolean;
  message: string;
}