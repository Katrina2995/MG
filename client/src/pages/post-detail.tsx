import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { SEOHead } from "@/components/seo-head";

interface Post {
  id: number;
  title: string;
  slug: string;
  summary?: string;
  htmlContent?: string;
  publishedAt: string;
  canonicalUrl?: string;
  featuredImage?: string;
  author: {
    username: string;
    bio?: string;
  };
  tags: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
}

export default function PostDetailPage() {
  const [, params] = useRoute("/blog/post/:slug");
  const slug = params?.slug;

  const { data, isLoading } = useQuery<{ post: Post }>({
    queryKey: [`/api/blog/posts/slug/${slug}`],
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <Skeleton className="h-10 w-32 mb-6" />
        <Skeleton className="h-12 w-3/4 mb-4" />
        <Skeleton className="h-6 w-1/2 mb-8" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!data?.post) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <Link href="/blog">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Button>
        </Link>
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Post not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const post = data.post;

  const baseUrl = window.location.origin;
  const canonicalUrl = post.canonicalUrl || `${baseUrl}/blog/post/${post.slug}`;
  const metaDescription = post.summary || `${post.title} - Read the full article on MILLERGROUP Intelligence Blog`;

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <SEOHead
        title={`${post.title} | MILLERGROUP Blog`}
        description={metaDescription.substring(0, 160)}
        canonicalUrl={canonicalUrl}
        image={post.featuredImage}
        type="article"
        publishedTime={post.publishedAt}
        author={post.author.username}
        tags={post.tags.map(t => t.name)}
      />
      <Link href="/blog">
        <Button variant="ghost" className="mb-6" data-testid="button-back">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Blog
        </Button>
      </Link>

      <article>
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4" data-testid="text-post-title">{post.title}</h1>
          
          <div className="flex items-center gap-4 text-muted-foreground mb-4">
            <span data-testid="text-post-author">By {post.author.username}</span>
            <span>•</span>
            <span data-testid="text-post-date">
              {format(new Date(post.publishedAt), 'MMMM d, yyyy')}
            </span>
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {post.tags.map((tag) => (
                <Link key={tag.id} href={`/blog/tag/${tag.slug}`}>
                  <Badge variant="secondary" className="cursor-pointer hover-elevate" data-testid={`badge-tag-${tag.id}`}>
                    {tag.name}
                  </Badge>
                </Link>
              ))}
            </div>
          )}
        </header>

        {post.summary && (
          <div className="bg-muted p-6 rounded-lg mb-8">
            <p className="text-lg italic" data-testid="text-post-summary">{post.summary}</p>
          </div>
        )}

        <div 
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: post.htmlContent || '' }}
          data-testid="content-post-body"
        />
      </article>
    </div>
  );
}
