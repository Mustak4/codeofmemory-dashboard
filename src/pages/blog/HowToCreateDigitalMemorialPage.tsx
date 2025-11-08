import BlogPost from "@/components/BlogPost";
import { getLocalizedBlogPost, getRelatedPosts } from "@/utils/blogPosts";
import { useLanguage } from "@/contexts/LanguageContext";

const HowToCreateDigitalMemorialPage = () => {
  const { language } = useLanguage();
  const post = getLocalizedBlogPost("how-to-create-digital-memorial-page", language);
  const relatedPosts = getRelatedPosts("how-to-create-digital-memorial-page", 2, language);

  if (!post) {
    return <div>Post not found</div>;
  }

  return <BlogPost post={post} relatedPosts={relatedPosts} />;
};

export default HowToCreateDigitalMemorialPage;

