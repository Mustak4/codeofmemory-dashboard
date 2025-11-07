import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Calendar, Clock, ArrowRight } from "lucide-react";

const blogPosts = [
  {
    id: 1,
    title: "The Power of Digital Memorials in Modern Grief",
    excerpt: "How technology is changing the way we remember and honor loved ones. Exploring the intersection of tradition and innovation in memorial practices.",
    date: "January 15, 2025",
    readTime: "5 min read",
    category: "Remembrance",
    slug: "digital-memorials-modern-grief",
  },
  {
    id: 2,
    title: "Creating a Living Memorial: Why Pre-Planning Matters",
    excerpt: "The healing power of involving loved ones in creating their own tribute. How families are finding peace through proactive memorial planning.",
    date: "January 8, 2025",
    readTime: "7 min read",
    category: "Planning",
    slug: "living-memorial-pre-planning",
  },
  {
    id: 3,
    title: "QR Codes on Memorials: A Technical and Emotional Guide",
    excerpt: "Understanding how QR technology preserves memories for generations. The practical and emotional benefits of linking physical memorials to digital stories.",
    date: "December 20, 2024",
    readTime: "6 min read",
    category: "Innovation",
    slug: "qr-codes-memorials-guide",
  },
  {
    id: 4,
    title: "How Families Are Keeping Memories Alive Together",
    excerpt: "Real stories from families using collaborative memorial pages. The unexpected joy of gathering digitally to share stories and photos.",
    date: "December 12, 2024",
    readTime: "8 min read",
    category: "Stories",
    slug: "families-keeping-memories-alive",
  },
  {
    id: 5,
    title: "The Art of Writing a Meaningful Biography",
    excerpt: "Gentle guidance for capturing a life in words. Tips and prompts for honoring someone's story with authenticity and love.",
    date: "November 28, 2024",
    readTime: "5 min read",
    category: "Writing",
    slug: "writing-meaningful-biography",
  },
  {
    id: 6,
    title: "Memorial Design Trends: Balancing Tradition and Innovation",
    excerpt: "How modern memorial plaques honor the past while embracing the future. Exploring materials, styles, and technologies that respect tradition.",
    date: "November 15, 2024",
    readTime: "6 min read",
    category: "Design",
    slug: "memorial-design-trends",
  },
];

const Blog = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/10 to-background">
      <Header />

      <main className="container mx-auto px-6 py-16">
        <div className="max-w-3xl mx-auto text-center mb-12 animate-fade-in-slow">
          <h1 className="text-5xl md:text-6xl font-serif mb-6 text-permanence leading-tight">
            Stories & Insights
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Thoughts on remembrance, family, and the art of honoring lives well-lived.
          </p>
        </div>

        {/* Featured Post */}
        <Card className="max-w-5xl mx-auto mb-12 overflow-hidden border-border/50 shadow-lg animate-fade-in bg-card/70 backdrop-blur-sm">
          <div className="md:flex">
            <div className="md:w-2/5 bg-gradient-to-br from-comfort to-earth p-12 flex items-center justify-center">
              <div className="text-center">
                <p className="text-warmth/80 text-sm uppercase tracking-wider mb-2">Featured</p>
                <p className="text-4xl font-serif text-warmth">Latest Post</p>
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
                <a
                  href={`/blog/${blogPosts[0].slug}`}
                  className="flex items-center gap-2 text-earth hover:text-memory transition-colors font-medium"
                >
                  Read Article
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </Card>

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
                <a
                  href={`/blog/${post.slug}`}
                  className="text-earth group-hover:text-memory transition-colors"
                >
                  <ArrowRight className="w-5 h-5" />
                </a>
              </div>
            </Card>
          ))}
        </div>

        {/* Newsletter CTA */}
        <div className="max-w-2xl mx-auto mt-16">
          <Card className="p-10 border-border/50 shadow-lg text-center bg-card/70 backdrop-blur-sm">
            <h2 className="text-3xl font-serif mb-4 text-memory">Stay Connected</h2>
            <p className="text-muted-foreground mb-6">
              Receive thoughtful articles about remembrance, family, and honoring loved ones.
            </p>
            <div className="flex gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-4 py-3 rounded-md border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-earth"
              />
              <button className="px-6 py-3 bg-memory text-warmth hover:bg-memory/90 rounded-md font-medium transition-all duration-300">
                Subscribe
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              No spam, ever. Unsubscribe anytime.
            </p>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Blog;
