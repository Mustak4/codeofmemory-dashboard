import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Card } from "@/components/ui/card";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { getLocalizedBlogPosts } from "@/utils/blogPosts";
import { useLanguage } from "@/contexts/LanguageContext";
import { useMemo } from "react";

const Blog = () => {
  const { language, t } = useLanguage();
  const blogPosts = useMemo(() => getLocalizedBlogPosts(language), [language]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/10 to-background">
      <SEO
        page="blog"
        canonical="/blog"
      />
      <Header />

      <main className="container mx-auto px-6 py-16">
        <div className="max-w-3xl mx-auto text-center mb-12 animate-fade-in-slow">
          <h1 className="text-5xl md:text-6xl font-serif mb-6 text-permanence leading-tight">
            {t("blog.title")}
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            {t("blog.subtitle")}
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            {t("blog.learnMoreAbout")} <Link to="/about" className="text-earth hover:text-memory underline">{t("blog.aboutMission")}</Link> {t("common.or")} <Link to="/order" className="text-earth hover:text-memory underline">{t("blog.startTribute")}</Link>.
          </p>
        </div>

        {/* Featured Post */}
        {blogPosts.length > 0 && (
          <Card className="max-w-5xl mx-auto mb-12 overflow-hidden border-border/50 shadow-lg animate-fade-in bg-card/70 backdrop-blur-sm">
            <div className="md:flex">
              <div className="md:w-2/5 bg-gradient-to-br from-comfort to-earth p-12 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-warmth/80 text-sm uppercase tracking-wider mb-2">{t("blog.featured")}</p>
                  <p className="text-4xl font-serif text-warmth">{t("blog.latestPost")}</p>
                </div>
              </div>
              <div className="md:w-3/5 p-8 md:p-10">
                <div className="flex gap-3 mb-4">
                  <span className="text-sm text-earth font-medium">{blogPosts[0].category}</span>
                  <span className="text-sm text-muted-foreground">•</span>
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {blogPosts[0].date}
                  </span>
                </div>
                <h2 className="text-3xl font-serif mb-4 text-memory">{blogPosts[0].title}</h2>
                <p className="text-muted-foreground leading-relaxed mb-6">{blogPosts[0].excerpt}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {blogPosts[0].readTime}
                  </span>
                  <Link
                    to={`/blog/${blogPosts[0].slug}`}
                    className="flex items-center gap-2 text-earth hover:text-memory transition-colors font-medium"
                  >
                    {t("blog.readArticle")}
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Blog Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {blogPosts.slice(1).map((post, index) => (
            <Card
              key={post.id}
              className="p-6 border-border/50 hover:shadow-lg transition-all duration-300 animate-fade-in bg-card/50 backdrop-blur-sm group cursor-pointer"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex gap-2 mb-3">
                <span className="text-sm text-earth font-medium">{post.category}</span>
              </div>
              <h3 className="text-xl font-serif mb-3 text-memory group-hover:text-earth transition-colors">
                {post.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3">
                {post.excerpt}
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-border/50">
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {post.date}
                  </span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {post.readTime}
                  </span>
                </div>
                <Link
                  to={`/blog/${post.slug}`}
                  className="text-earth group-hover:text-memory transition-colors"
                  aria-label={`${t("blog.readArticle")}: ${post.title}`}
                >
                  <ArrowRight className="w-5 h-5" aria-hidden="true" />
                </Link>
              </div>
            </Card>
          ))}
        </div>

        {/* Newsletter CTA */}
        <div className="max-w-2xl mx-auto mt-16">
          <Card className="p-10 border-border/50 shadow-lg text-center bg-card/70 backdrop-blur-sm">
            <h2 className="text-3xl font-serif mb-4 text-memory">{t("blog.stayConnected")}</h2>
            <p className="text-muted-foreground mb-6">
              {t("blog.newsletterText")}
            </p>
            <div className="flex gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-4 py-3 rounded-md border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-earth"
              />
              <button className="px-6 py-3 bg-memory text-warmth hover:bg-memory/90 rounded-md font-medium transition-all duration-300">
                {t("blog.subscribe")}
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              {t("blog.noSpam")}
            </p>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Blog;
