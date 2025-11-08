import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Card } from "@/components/ui/card";
import { Calendar, Clock, ArrowLeft } from "lucide-react";
import LazyImage from "@/components/LazyImage";
import { useLanguage } from "@/contexts/LanguageContext";

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
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/10 to-background">
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

      <main className="container mx-auto px-6 py-16">
        {/* Breadcrumb */}
        <nav className="mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-sm text-muted-foreground">
            <li>
              <Link to="/" className="hover:text-memory transition-colors">
                {t("common.home")}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link to="/blog" className="hover:text-memory transition-colors">
                {t("common.blog")}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-foreground">{post.title}</li>
          </ol>
        </nav>

        <article className="max-w-4xl mx-auto">
          {/* Header */}
          <header className="mb-12">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-earth hover:text-memory transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              {t("blog.backToBlog")}
            </Link>

            <div className="mb-4">
              <span className="text-sm text-earth font-medium">{post.category}</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif mb-6 text-permanence leading-tight">
              {post.title}
            </h1>

            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
              <time dateTime={post.date} className="flex items-center gap-1">
                <Calendar className="w-4 h-4" aria-hidden="true" />
                {post.date}
              </time>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" aria-hidden="true" />
                {post.readTime}
              </span>
                    {post.author && (
                      <span className="text-memory">{t("blog.by")} {post.author.name}</span>
                    )}
            </div>

            {post.image && (
              <LazyImage
                src={post.image}
                alt={post.title}
                className="w-full h-auto rounded-lg mb-8"
                priority
              />
            )}
          </header>

          {/* Content */}
          <div className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-permanence prose-headings:font-normal prose-p:text-foreground prose-p:leading-relaxed prose-a:text-earth prose-a:no-underline hover:prose-a:underline prose-strong:text-memory prose-strong:font-medium">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>

          {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="mt-12 pt-8 border-t border-border/50">
                    <h2 className="text-sm font-medium text-memory mb-4">{t("blog.tags")}</h2>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-sm bg-muted/50 text-muted-foreground rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Author Bio */}
                {post.author?.bio && (
                  <Card className="mt-12 p-8 border-border/50 bg-card/50">
                    <h2 className="text-xl font-serif mb-3 text-memory">{t("blog.aboutAuthor")}</h2>
              <p className="text-muted-foreground leading-relaxed">{post.author.bio}</p>
            </Card>
          )}

          {/* Related Posts */}
                {relatedPosts.length > 0 && (
                  <div className="mt-16 pt-12 border-t border-border/50">
                    <h2 className="text-3xl font-serif mb-8 text-permanence">{t("blog.relatedArticles")}</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <Card
                    key={relatedPost.id}
                    className="p-6 border-border/50 hover:shadow-lg transition-all duration-300 bg-card/50"
                  >
                    <Link to={`/blog/${relatedPost.slug}`}>
                      <h3 className="text-xl font-serif mb-3 text-memory hover:text-earth transition-colors">
                        {relatedPost.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {relatedPost.excerpt}
                      </p>
                      <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" aria-hidden="true" />
                        {relatedPost.date}
                      </div>
                    </Link>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </article>
      </main>

      <Footer />
    </div>
  );
};

export default BlogPost;

