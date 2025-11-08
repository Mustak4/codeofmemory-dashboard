import BlogPost from "@/components/BlogPost";
import { getLocalizedBlogPost, getRelatedPosts } from "@/utils/blogPosts";
import { useLanguage } from "@/contexts/LanguageContext";

const WhyQRMemorialPlaquesChangeRemembrance = () => {
  const { language } = useLanguage();
  const post = getLocalizedBlogPost("why-qr-memorial-plaques-change-remembrance", language);
  const relatedPosts = getRelatedPosts("why-qr-memorial-plaques-change-remembrance", 2, language);

  if (!post) {
    return <div>Post not found</div>;
  }

  return <BlogPost post={post} relatedPosts={relatedPosts} />;
};

export default WhyQRMemorialPlaquesChangeRemembrance;

