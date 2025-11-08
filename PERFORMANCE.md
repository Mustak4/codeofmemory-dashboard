# Performance Optimizations

This document outlines the performance optimizations implemented for CodeOfMemory to achieve excellent Core Web Vitals scores.

## Core Web Vitals Targets

- **LCP (Largest Contentful Paint)**: < 2.5s
- **CLS (Cumulative Layout Shift)**: < 0.1
- **INP (Interaction to Next Paint)**: < 200ms

## Implemented Optimizations

### 1. Image Optimization

- **Lazy Loading**: All non-critical images use `loading="lazy"` attribute
- **Explicit Dimensions**: All images include `width` and `height` attributes to prevent layout shift
- **Async Decoding**: Images use `decoding="async"` for non-blocking rendering
- **Preload Critical Images**: Hero image is preloaded for faster LCP
- **LazyImage Component**: Custom component with Intersection Observer for advanced lazy loading

### 2. Resource Preloading

- **Critical CSS**: Preloaded in `<head>` via `<link rel="preload">`
- **Logo Image**: Preloaded for faster header rendering
- **Hero Image**: Dynamically preloaded via JavaScript for optimal LCP
- **DNS Prefetch**: External resources (fonts) use DNS prefetch

### 3. Build Optimizations

- **Code Splitting**: Vendor and UI libraries split into separate chunks
- **Tree Shaking**: Unused code automatically removed
- **Minification**: Terser minification with console.log removal in production
- **Asset Inlining**: Small assets (< 4kb) inlined to reduce HTTP requests

### 4. Caching Strategy

- **Static Assets**: 1 year cache (`max-age=31536000`) with immutable flag
- **Sitemap**: 1 hour cache with shared cache
- **Robots.txt**: 24 hour cache
- Configured via `vercel.json` for Vercel deployments

### 5. Font Optimization

- **Font Display**: `swap` strategy for non-blocking font loading
- **Text Rendering**: Optimized legibility settings
- **Font Smoothing**: Antialiased rendering for better appearance

### 6. Bundle Optimization

- **Manual Chunking**: React, React DOM, and React Router split into vendor chunk
- **UI Components**: Radix UI components split into separate chunk
- **Dependency Optimization**: Critical dependencies pre-bundled

## Usage

### LazyImage Component

Use the `LazyImage` component for images that should lazy load:

```tsx
import LazyImage from "@/components/LazyImage";

<LazyImage
  src="/image.jpg"
  alt="Description"
  width={800}
  height={600}
  priority={false} // Set to true for above-the-fold images
/>
```

### Blog Post Template

Use the `BlogPost` component for SEO-friendly blog posts:

```tsx
import BlogPost from "@/components/BlogPost";

const post = {
  id: 1,
  title: "Article Title",
  excerpt: "Article excerpt",
  content: "<p>Article content</p>",
  date: "2025-01-20",
  readTime: "5 min read",
  category: "Category",
  slug: "article-slug",
  author: {
    name: "Author Name",
    bio: "Author bio"
  },
  image: "/article-image.jpg",
  tags: ["tag1", "tag2"]
};

<BlogPost post={post} relatedPosts={[relatedPost1, relatedPost2]} />
```

## Monitoring

- Use Lighthouse in Chrome DevTools to measure Core Web Vitals
- Monitor real-world performance via Google Search Console
- Check bundle sizes with `npm run build` and inspect `dist/` folder

## Notes

- Compression (Brotli/Gzip) should be handled by your hosting provider (Vercel, Netlify, etc.)
- For WebP/AVIF conversion, consider using a build-time image optimization tool
- Consider implementing a service worker for offline support and additional caching

