import { BlogPostData } from "@/components/BlogPost";
import { blogPostsData } from "@/data/blogPosts";
import { Language } from "@/i18n/config";
import enTranslations from "@/i18n/en.json";
import deTranslations from "@/i18n/de.json";
import svTranslations from "@/i18n/sv.json";
import noTranslations from "@/i18n/no.json";

const translations: Record<Language, typeof enTranslations> = {
  en: enTranslations,
  de: deTranslations,
  sv: svTranslations,
  no: noTranslations,
};

/**
 * Get localized blog post data
 */
export const getLocalizedBlogPost = (slug: string, language: Language): BlogPostData | null => {
  const basePost = blogPostsData.find(post => post.slug === slug);
  if (!basePost) return null;

  const t = translations[language];
  
  // Safely access blog post translations
  const blogPosts = t.blog?.posts;
  if (!blogPosts || typeof blogPosts !== 'object') {
    console.warn(`[getLocalizedBlogPost] No blog posts translations found for language: ${language}`);
    return basePost; // Fallback to base post if translations not available
  }
  
  const postTranslation = (blogPosts as Record<string, any>)[slug];
  
  if (!postTranslation && language !== 'en') {
    console.warn(`[getLocalizedBlogPost] No translation found for slug: ${slug}, language: ${language}`);
  }

  // Get localized title, excerpt, content, and category
  const localizedTitle = postTranslation?.title || basePost.title;
  const localizedExcerpt = postTranslation?.excerpt || basePost.excerpt;
  const localizedContent = postTranslation?.content || basePost.content;
  const categoryKey = postTranslation?.category || basePost.category.toLowerCase().replace(/\s+/g, '');
  
  // Safely access category translations
  const blogCategories = t.blog?.categories;
  const categoryTranslation = blogCategories && typeof blogCategories === 'object' 
    ? (blogCategories as Record<string, string>)[categoryKey] 
    : undefined;
  const localizedCategory = categoryTranslation || basePost.category;

  return {
    ...basePost,
    title: localizedTitle,
    excerpt: localizedExcerpt,
    content: localizedContent,
    category: localizedCategory,
  };
};

/**
 * Get all localized blog posts
 */
export const getLocalizedBlogPosts = (language: Language): BlogPostData[] => {
  return blogPostsData.map(post => {
    const localized = getLocalizedBlogPost(post.slug, language);
    return localized || post;
  });
};

/**
 * Get blog post by slug (uses English as default)
 */
export const getBlogPostBySlug = (slug: string): BlogPostData | undefined => {
  return blogPostsData.find(post => post.slug === slug);
};

/**
 * Get related posts
 */
export const getRelatedPosts = (currentSlug: string, limit: number = 2, language: Language = "en"): BlogPostData[] => {
  const currentPost = blogPostsData.find(post => post.slug === currentSlug);
  if (!currentPost) return [];

  // Get posts with same category or tags
  const related = blogPostsData
    .filter(post => 
      post.slug !== currentSlug && 
      (post.category === currentPost.category || 
       post.tags?.some(tag => currentPost.tags?.includes(tag)))
    )
    .slice(0, limit);

  // Localize related posts
  return related.map(post => {
    const localized = getLocalizedBlogPost(post.slug, language);
    return localized || post;
  });
};

