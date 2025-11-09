import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowLeft, ArrowRight, Twitter, Facebook, Linkedin, Copy, Check, BookOpen, Heart } from "lucide-react";
import LazyImage from "@/components/LazyImage";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";

export interface BlogPostData {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  readTime: string;
  category: string;
  slug: string;
  author?: {
    name: string;
    bio?: string;
  };
  image?: string;
  tags?: string[];
}

interface BlogPostProps {
  post: BlogPostData;
  relatedPosts?: BlogPostData[];
}

const BlogPost = ({ post, relatedPosts = [] }: BlogPostProps) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [readingProgress, setReadingProgress] = useState(0);
  const [copied, setCopied] = useState(false);
  const [headings, setHeadings] = useState<{ id: string; text: string; level: number }[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);
  const articleRef = useRef<HTMLElement>(null);

  // Extract headings from content for table of contents
  useEffect(() => {
    if (contentRef.current) {
      const headingElements = contentRef.current.querySelectorAll('h2, h3');
      const extractedHeadings: { id: string; text: string; level: number }[] = [];
      
      headingElements.forEach((heading, index) => {
        const text = heading.textContent || '';
        const id = `heading-${index}`;
        heading.id = id;
        extractedHeadings.push({
          id,
          text,
          level: heading.tagName === 'H2' ? 2 : 3
        });
      });
      
      setHeadings(extractedHeadings);
    }
  }, [post.content]);

  // Reading progress calculation
  useEffect(() => {
    const handleScroll = () => {
      if (!articleRef.current) return;
      
      const articleTop = articleRef.current.offsetTop;
      const articleHeight = articleRef.current.offsetHeight;
      const windowHeight = window.innerHeight;
      const scrollTop = window.scrollY;
      
      // Calculate how much of the article has been scrolled past
      const articleBottom = articleTop + articleHeight;
      const viewportTop = scrollTop;
      const viewportBottom = scrollTop + windowHeight;
      
      // If article hasn't entered viewport yet
      if (viewportBottom < articleTop) {
        setReadingProgress(0);
        return;
      }
      
      // If article has been completely scrolled past
      if (viewportTop > articleBottom) {
        setReadingProgress(100);
        return;
      }
      
      // Calculate progress based on how much has been scrolled
      const scrolled = Math.max(0, viewportTop - articleTop);
      const progress = Math.min(100, (scrolled / articleHeight) * 100);
      setReadingProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Share functions
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareTitle = post.title;
  const shareText = post.excerpt;

  const handleShare = async (platform: string) => {
    const url = encodeURIComponent(currentUrl);
    const title = encodeURIComponent(shareTitle);
    const text = encodeURIComponent(shareText);

    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${url}&text=${title}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
        break;
      case 'copy':
        try {
          await navigator.clipboard.writeText(currentUrl);
          setCopied(true);
          toast({
            title: "Link copied!",
            description: "The article link has been copied to your clipboard.",
          });
          setTimeout(() => setCopied(false), 2000);
        } catch (err) {
          toast({
            title: "Failed to copy",
            description: "Please copy the link manually.",
            variant: "destructive",
          });
        }
        break;
    }
  };

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };
  
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.image || "https://codeofmemory.com/logo.png",
    datePublished: post.date,
    dateModified: post.date,
    author: {
      "@type": "Person",
      name: post.author?.name || "CodeOfMemory Team",
      ...(post.author?.bio && { description: post.author.bio }),
    },
    publisher: {
      "@type": "Organization",
      name: "CodeOfMemory",
      logo: {
        "@type": "ImageObject",
        url: "https://codeofmemory.com/logo.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://codeofmemory.com/blog/${post.slug}`,
    },
    ...(post.tags && {
      keywords: post.tags.join(", "),
    }),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://codeofmemory.com/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: "https://codeofmemory.com/blog",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: `https://codeofmemory.com/blog/${post.slug}`,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        page="blog"
        title={`${post.title} – CodeOfMemory Blog`}
        description={post.excerpt}
        ogTitle={post.title}
        ogDescription={post.excerpt}
        ogImage={post.image || "/logo.png"}
        canonical={`/blog/${post.slug}`}
        structuredData={[articleSchema, breadcrumbSchema]}
      />
      <Header />

      {/* Reading Progress Bar */}
      <div className="fixed top-[100px] left-0 right-0 h-1 bg-muted/20 z-40 no-print">
        <div
          className="h-full bg-gradient-to-r from-earth to-memory transition-all duration-150"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      <main className="pt-8 pb-20">
        {/* Back To Blog Link */}
        <div className="max-w-4xl mx-auto px-6 mb-8">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            {t("blog.backToBlog")}
          </Link>
        </div>

        {/* Main Content Card */}
        <article ref={articleRef} className="max-w-4xl mx-auto px-6">
          <Card className="bg-card shadow-lg border-border/50 rounded-2xl p-8 md:p-12 md:px-12">
            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-permanence mb-6 leading-tight">
              {post.title}
            </h1>

            {/* Subtitle/Excerpt */}
            <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
              {post.excerpt}
            </p>

            {/* Author & Metadata */}
            <div className="flex items-center gap-3 mb-8 pb-8 border-b border-border/50 text-sm text-muted-foreground">
              <img 
                src="/favicon.png" 
                alt="CodeOfMemory"
                className="w-8 h-8 object-contain"
              />
              <span className="text-foreground">
                {t("blog.by")} {post.author?.name || "CodeOfMemory Team"}
              </span>
              <span className="text-muted-foreground">•</span>
              <time dateTime={post.date} className="text-muted-foreground">
                {post.date}
              </time>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground">
                {post.readTime}
              </span>
            </div>

            {/* Hero Image */}
            {post.image && (
              <div className="mb-12 flex justify-center">
                <div className="w-full max-w-3xl">
                  <LazyImage
                    src={post.image}
                    alt={post.title}
                    className="w-full h-auto rounded-lg max-h-[500px] object-cover"
                    priority
                  />
                </div>
              </div>
            )}

            {/* Share Section */}
            <div className="mb-12 pb-12 border-b border-border/50">
              <h3 className="text-center text-lg font-medium text-foreground mb-6 flex items-center justify-center gap-2">
                <Heart className="w-5 h-5 text-memory fill-memory" />
                {t("blog.lovedArticle") || "Loved this article? Share it!"}
              </h3>
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleShare('twitter')}
                  className="rounded-full w-10 h-10 p-0 hover:bg-[#1DA1F2]/10 hover:border-[#1DA1F2]"
                  aria-label="Share on Twitter"
                >
                  <Twitter className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleShare('facebook')}
                  className="rounded-full w-10 h-10 p-0 hover:bg-[#1877F2]/10 hover:border-[#1877F2]"
                  aria-label="Share on Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleShare('linkedin')}
                  className="rounded-full w-10 h-10 p-0 hover:bg-[#0A66C2]/10 hover:border-[#0A66C2]"
                  aria-label="Share on LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleShare('copy')}
                  className="rounded-full hover:bg-memory/10 hover:border-memory"
                  aria-label="Copy link"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      {t("blog.copied") || "Copied!"}
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      {t("blog.copyLink") || "Copy Link"}
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Content */}
            <div 
              ref={contentRef}
              className="prose prose-lg max-w-none 
                prose-headings:font-bold prose-headings:text-permanence prose-headings:font-normal prose-headings:scroll-mt-24
                prose-p:text-foreground prose-p:leading-[1.8] prose-p:text-base prose-p:my-6
                prose-a:text-memory prose-a:no-underline hover:prose-a:underline prose-a:font-medium prose-a:transition-colors
                prose-strong:text-permanence prose-strong:font-semibold
                prose-ul:my-6 prose-ol:my-6 prose-li:my-2 prose-li:leading-relaxed
                prose-h2:mt-12 prose-h2:mb-6 prose-h2:text-2xl prose-h2:leading-tight prose-h2:font-bold
                prose-h3:mt-8 prose-h3:mb-4 prose-h3:text-xl prose-h3:leading-tight prose-h3:font-bold prose-h3:text-permanence
                prose-blockquote:border-l-4 prose-blockquote:border-memory prose-blockquote:pl-6 prose-blockquote:my-8 prose-blockquote:italic prose-blockquote:text-muted-foreground prose-blockquote:bg-muted/30 prose-blockquote:py-4 prose-blockquote:rounded-r-md
                prose-hr:my-12 prose-hr:border-border/30
                [&>div>p]:text-[15px] [&>div>p]:leading-[1.8]
                [&>div>h2]:text-2xl [&>div>h2]:font-bold [&>div>h2]:mt-12 [&>div>h2]:mb-6
                [&>div>h3]:text-xl [&>div>h3]:font-bold [&>div>h3]:mt-8 [&>div>h3]:mb-4"
            >
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </div>

          </Card>
        </article>

        {/* Related Posts Section */}
        {relatedPosts.length > 0 && (
          <section className="mt-20 px-6">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-bold text-permanence mb-4">
                  {t("blog.youllLoveThese") || "You'll Love These Other Posts"}
                </h2>
                <p className="text-lg text-muted-foreground">
                  {t("blog.moreInsights") || "More insightful and engaging articles to guide your journey"}
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {relatedPosts.map((relatedPost) => (
                  <Card
                    key={relatedPost.id}
                    className="overflow-hidden border-border/50 hover:shadow-xl transition-all duration-300 group cursor-pointer bg-card"
                  >
                    <Link to={`/blog/${relatedPost.slug}`} className="block">
                      {/* Image */}
                      <div className="aspect-video bg-gradient-to-br from-muted/50 to-muted/30 overflow-hidden">
                        {relatedPost.image ? (
                          <LazyImage
                            src={relatedPost.image}
                            alt={relatedPost.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <BookOpen className="w-16 h-16 text-memory/20" />
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {relatedPost.date}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-permanence mb-2 group-hover:text-memory transition-colors line-clamp-2">
                          {relatedPost.title}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-4">
                          {relatedPost.excerpt}
                        </p>
                        <div className="flex items-center gap-2 text-sm font-medium text-memory">
                          {t("blog.readMore") || "Read More"}
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </Link>
                  </Card>
                ))}
              </div>

              {/* View All Button */}
              <div className="text-center mt-12">
                <Button
                  variant="outline"
                  size="lg"
                  asChild
                  className="border-border/50 hover:bg-muted/50"
                >
                  <Link to="/blog" className="flex items-center gap-2">
                    {t("blog.viewAllPosts") || "View All Blog Posts"}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default BlogPost;

