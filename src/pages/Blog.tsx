import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight, BookOpen, TrendingUp, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { getLocalizedBlogPosts } from "@/utils/blogPosts";
import { useLanguage } from "@/contexts/LanguageContext";
import { useMemo, useState } from "react";
import LazyImage from "@/components/LazyImage";

const Blog = () => {
  const { language, t } = useLanguage();
  const blogPosts = useMemo(() => getLocalizedBlogPosts(language), [language]);
  const [filter, setFilter] = useState<string | null>(null);

  const categories = Array.from(new Set(blogPosts.map(p => p.category)));

  return (
    <div className="min-h-screen bg-background">
      <SEO
        page="blog"
        canonical="/blog"
      />
      <Header />

      <main>
        {/* Browse All Posts Section */}
        <section className="pt-24 pb-20 px-6">
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-permanence mb-4">
                {t("blog.browseAllPosts") || "Browse All Posts"}
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                {t("blog.browseSubtitle") || "Keep up to date with our latest insights and advice"}
              </p>
            </div>

            {/* Filter Buttons */}
            <div className="flex justify-center gap-3 mb-12 flex-wrap">
              <Button
                variant={filter === null ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(null)}
                className={`rounded-full px-4 py-2 ${
                  filter === null 
                    ? "bg-permanence text-warmth hover:bg-permanence/90" 
                    : "bg-background hover:bg-muted/50"
                }`}
              >
                <FileText className="w-4 h-4 mr-2" />
                {t("blog.all") || "All"}
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={filter === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter(category)}
                  className={`rounded-full px-4 py-2 ${
                    filter === category 
                      ? "bg-permanence text-warmth hover:bg-permanence/90" 
                      : "bg-background hover:bg-muted/50"
                  }`}
                >
                  {category}
                </Button>
              ))}
            </div>

            {/* Blog Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogPosts
                .filter(post => !filter || post.category === filter)
                .map((post) => (
                  <Card
                    key={post.id}
                    className="overflow-hidden border-border/50 hover:shadow-xl transition-all duration-300 group cursor-pointer bg-card rounded-2xl"
                  >
                    <Link to={`/blog/${post.slug}`} className="block">
                      {/* Image */}
                      <div className="aspect-square bg-gradient-to-br from-muted/50 to-muted/30 overflow-hidden">
                        {post.image ? (
                          <LazyImage
                            src={post.image}
                            alt={post.title}
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
                        {/* Category & Date */}
                        <div className="flex items-center justify-between mb-4">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-memory/10 text-memory text-xs font-medium">
                            <FileText className="w-3 h-3" />
                            {post.category}
                          </span>
                          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Calendar className="w-3 h-3" />
                            {post.date}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="text-xl font-bold text-permanence mb-3 group-hover:text-memory transition-colors line-clamp-2 min-h-[3.5rem]">
                          {post.title}
                        </h3>

                        {/* Excerpt */}
                        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-6 min-h-[4rem]">
                          {post.excerpt}
                        </p>

                        {/* Author & Read More */}
                        <div className="flex items-center justify-between pt-4 border-t border-border/30">
                          <div className="flex items-center gap-2">
                            <img 
                              src="/favicon.png" 
                              alt="CodeOfMemory"
                              className="w-6 h-6 object-contain"
                            />
                            <span className="text-xs text-muted-foreground">
                              {post.author?.name || "CodeOfMemory Team"}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-sm font-medium text-permanence group-hover:text-memory transition-colors">
                            {t("blog.readArticle") || "Read Article"}
                            <ArrowRight className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </Card>
                ))}
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
};

export default Blog;
