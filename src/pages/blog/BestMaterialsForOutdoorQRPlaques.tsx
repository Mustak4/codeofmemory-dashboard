import BlogPost from "@/components/BlogPost";
import { getLocalizedBlogPost, getRelatedPosts } from "@/utils/blogPosts";
import { useLanguage } from "@/contexts/LanguageContext";

const BestMaterialsForOutdoorQRPlaques = () => {
  const { language } = useLanguage();
  const post = getLocalizedBlogPost("best-materials-for-outdoor-qr-plaques", language);
  const relatedPosts = getRelatedPosts("best-materials-for-outdoor-qr-plaques", 2, language);

  if (!post) {
    return <div>Post not found</div>;
  }

  return <BlogPost post={post} relatedPosts={relatedPosts} />;
};

export default BestMaterialsForOutdoorQRPlaques;

