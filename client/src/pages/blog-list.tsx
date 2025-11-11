import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { SEOHead } from "@/components/seo-head";

interface Post {
  id: number;
  title: string;
  slug: string;
  summary?: string;
  publishedAt: string;
  author: {
    username: string;
  };
}

export default function BlogListPage() {
  const { data, isLoading } = useQuery<{ posts: Post[] }>({
    queryKey: ['/api/blog/posts'],
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Blog</h1>
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2 mt-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <SEOHead
        title="Blog | MILLERGROUP Intelligence"
        description="Expert insights on private investigations, security consulting, and professional surveillance techniques. Stay informed with our industry knowledge."
        type="website"
      />
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Blog</h1>
        <Link href="/blog/login">
          <a className="text-primary hover:underline" data-testid="link-login">Login</a>
        </Link>
      </div>

      {!data?.posts || data.posts.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">No blog posts yet. Check back soon!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {data.posts.map((post) => (
            <Card key={post.id} className="hover-elevate" data-testid={`card-post-${post.id}`}>
              <CardHeader>
                <Link href={`/blog/post/${post.slug}`}>
                  <a>
                    <CardTitle className="text-2xl hover:text-primary transition-colors">
                      {post.title}
                    </CardTitle>
                  </a>
                </Link>
                <CardDescription>
                  <span data-testid={`text-author-${post.id}`}>By {post.author.username}</span>
                  {post.publishedAt && (
                    <span className="mx-2">•</span>
                  )}
                  {post.publishedAt && (
                    <span data-testid={`text-date-${post.id}`}>
                      {format(new Date(post.publishedAt), 'MMMM d, yyyy')}
                    </span>
                  )}
                </CardDescription>
              </CardHeader>
              {post.summary && (
                <CardContent>
                  <p className="text-muted-foreground">{post.summary}</p>
                  <Link href={`/blog/post/${post.slug}`}>
                    <a className="text-primary hover:underline mt-2 inline-block" data-testid={`link-read-more-${post.id}`}>
                      Read more →
                    </a>
                  </Link>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
