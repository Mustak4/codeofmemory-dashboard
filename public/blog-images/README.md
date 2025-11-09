# Blog Post Images

This folder contains images for blog posts.

## How to Add Images

1. Place your image files in this folder (`public/blog-images/`)
2. Supported formats: `.jpg`, `.jpeg`, `.png`, `.webp`, `.svg`
3. Recommended naming: Use the blog post slug as the filename
   - Example: `digital-memorials-modern-grief.jpg`

## How to Reference Images in Blog Posts

In `src/data/blogPosts.ts`, add the `image` property to your blog post:

```typescript
{
  id: 1,
  title: "Your Blog Post Title",
  excerpt: "Your excerpt...",
  content: "...",
  date: "2025-01-15",
  readTime: "5 min read",
  category: "Remembrance",
  slug: "your-blog-post-slug",
  image: "/blog-images/your-blog-post-slug.jpg", // Add this line
  // ... rest of the post
}
```

## Image Paths

- **Local images**: Use `/blog-images/filename.jpg` (starts with `/`)
- **External URLs**: Use full URL like `https://example.com/image.jpg`

## Image Recommendations

- **Hero images**: 1200x630px (for social sharing)
- **Featured images**: 1200x800px or 16:9 aspect ratio
- **File size**: Keep under 500KB for optimal performance
- **Format**: Use WebP for best compression, or JPG for compatibility

