import { useParams, Navigate, useLocation } from "react-router-dom";
import { useEffect, useMemo } from "react";
import BlogPost from "@/components/BlogPost";
import { getLocalizedBlogPost, getRelatedPosts } from "@/utils/blogPosts";
import { useLanguage } from "@/contexts/LanguageContext";

const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const { language } = useLanguage();
  
  useEffect(() => {
    console.log("BlogPostPage - slug:", slug, "pathname:", location.pathname, "language:", language);
  }, [slug, location.pathname, language]);
  
  const post = useMemo(() => slug ? getLocalizedBlogPost(slug, language) : null, [slug, language]);
  const relatedPosts = useMemo(() => slug ? getRelatedPosts(slug, 2, language) : [], [slug, language]);
  
  if (!slug) {
    console.error("BlogPostPage - No slug found in URL");
    return <Navigate to="/blog" replace />;
  }

  if (!post) {
    console.error("BlogPostPage - Post not found for slug:", slug);
    console.log("Available slugs:", ["digital-memorials-modern-grief", "living-memorial-pre-planning", "qr-codes-memorials-guide", "families-keeping-memories-alive", "writing-meaningful-biography", "memorial-design-trends", "why-qr-memorial-plaques-change-remembrance", "how-to-create-digital-memorial-page", "best-materials-for-outdoor-qr-plaques"]);
    return <Navigate to="/blog" replace />;
  }

  return <BlogPost post={post} relatedPosts={relatedPosts} />;
};

export default BlogPostPage;

