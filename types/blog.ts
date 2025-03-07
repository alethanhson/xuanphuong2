export interface BlogCategory {
  id: string
  name: string
  slug: string
  description?: string
  postCount?: number
}

export interface BlogAuthor {
  id: string
  name: string
  avatar?: string
  bio?: string
  role?: string
}

export interface BlogTag {
  id: string
  name: string
  slug: string
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  featuredImage: string
  categoryId: string
  category?: BlogCategory
  authorId: string
  author?: BlogAuthor
  tags?: BlogTag[]
  publishedAt: string
  updatedAt?: string
  isFeatured?: boolean
  readTime?: number
}

export interface BlogPostsResponse {
  posts: BlogPost[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface BlogFilters {
  categoryId?: string
  categorySlug?: string
  authorId?: string
  tagId?: string
  tagSlug?: string
  search?: string
  featured?: boolean
  page?: number
  limit?: number
  sortBy?: "newest" | "popular"
}

