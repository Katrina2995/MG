import { useQuery, useMutation } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Plus, Edit, Trash2, CheckCircle, XCircle, Clock } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";

interface Post {
  id: number;
  title: string;
  slug: string;
  status: "DRAFT" | "REVIEW" | "PUBLISHED";
  author: {
    username: string;
  };
  createdAt: string;
  publishedAt?: string;
}

interface User {
  id: number;
  username: string;
  email: string;
  role: "author" | "editor" | "admin";
}

export default function AdminDashboardPage() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: postsData, isLoading: postsLoading } = useQuery<{ posts: Post[] }>({
    queryKey: ["/api/blog/posts", { status: statusFilter === "all" ? undefined : statusFilter }],
  });

  const { data: currentUser } = useQuery<{ user: User }>({
    queryKey: ["/api/auth/me"],
  });

  const deleteMutation = useMutation({
    mutationFn: async (postId: number) => {
      return apiRequest("DELETE", `/api/blog/posts/${postId}`, {});
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Post deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/blog/posts"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete post",
        variant: "destructive",
      });
    },
  });

  const publishMutation = useMutation({
    mutationFn: async (postId: number) => {
      return apiRequest("POST", `/api/blog/posts/${postId}/publish`, {});
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Post published successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/blog/posts"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to publish post",
        variant: "destructive",
      });
    },
  });

  const filteredPosts = postsData?.posts?.filter(post => {
    if (searchQuery) {
      return post.title.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  }) || [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PUBLISHED":
        return <Badge variant="default" className="bg-green-600"><CheckCircle className="w-3 h-3 mr-1" />Published</Badge>;
      case "REVIEW":
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />In Review</Badge>;
      case "DRAFT":
        return <Badge variant="outline"><Edit className="w-3 h-3 mr-1" />Draft</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const canPublish = currentUser?.user?.role === "editor" || currentUser?.user?.role === "admin";

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-4xl font-bold">Blog Dashboard</h1>
          <Link href="/blog/new">
            <Button data-testid="button-new-post">
              <Plus className="mr-2 h-4 w-4" />
              New Post
            </Button>
          </Link>
        </div>
        <p className="text-muted-foreground">
          Manage your blog posts and content
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="input-search"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]" data-testid="select-status">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Posts</SelectItem>
                <SelectItem value="DRAFT">Drafts</SelectItem>
                <SelectItem value="REVIEW">In Review</SelectItem>
                <SelectItem value="PUBLISHED">Published</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Posts</CardTitle>
        </CardHeader>
        <CardContent>
          {postsLoading ? (
            <p className="text-center text-muted-foreground py-8">Loading posts...</p>
          ) : filteredPosts.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No posts found</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPosts.map((post) => (
                  <TableRow key={post.id} data-testid={`row-post-${post.id}`}>
                    <TableCell className="font-medium">
                      <Link href={`/blog/post/${post.slug}`}>
                        <span className="hover:underline cursor-pointer" data-testid={`text-post-title-${post.id}`}>
                          {post.title}
                        </span>
                      </Link>
                    </TableCell>
                    <TableCell data-testid={`text-post-author-${post.id}`}>{post.author.username}</TableCell>
                    <TableCell>{getStatusBadge(post.status)}</TableCell>
                    <TableCell>{format(new Date(post.createdAt), "MMM d, yyyy")}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Link href={`/blog/edit/${post.id}`}>
                          <Button size="sm" variant="outline" data-testid={`button-edit-${post.id}`}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        {canPublish && post.status === "REVIEW" && (
                          <Button
                            size="sm"
                            onClick={() => publishMutation.mutate(post.id)}
                            disabled={publishMutation.isPending}
                            data-testid={`button-publish-${post.id}`}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Publish
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => {
                            if (confirm("Are you sure you want to delete this post?")) {
                              deleteMutation.mutate(post.id);
                            }
                          }}
                          disabled={deleteMutation.isPending}
                          data-testid={`button-delete-${post.id}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
