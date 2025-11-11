import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { ArrowLeft, Save, Send } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const postSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  slug: z.string().min(1, "Slug is required").max(200),
  summary: z.string().max(500).optional(),
  content: z.string().min(1, "Content is required"),
  metaTitle: z.string().max(60).optional(),
  metaDescription: z.string().max(160).optional(),
  canonicalUrl: z.string().url().optional().or(z.literal("")),
  featuredImage: z.string().url().optional().or(z.literal("")),
  tags: z.string().optional(),
});

type PostFormData = z.infer<typeof postSchema>;

interface Post {
  id: number;
  title: string;
  slug: string;
  summary?: string;
  content: string;
  status: string;
  metaTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  featuredImage?: string;
  tags: Array<{ id: number; name: string }>;
}

export default function PostEditorPage() {
  const [, params] = useRoute("/blog/edit/:id");
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const postId = params?.id ? parseInt(params.id) : null;
  const [activeTab, setActiveTab] = useState("write");

  const { data: postData, isLoading } = useQuery<{ post: Post }>({
    queryKey: [`/api/blog/posts/${postId}`],
    enabled: !!postId,
  });

  const form = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      slug: "",
      summary: "",
      content: "",
      metaTitle: "",
      metaDescription: "",
      canonicalUrl: "",
      featuredImage: "",
      tags: "",
    },
  });

  useEffect(() => {
    if (postData?.post) {
      const post = postData.post;
      form.reset({
        title: post.title,
        slug: post.slug,
        summary: post.summary || "",
        content: post.content,
        metaTitle: post.metaTitle || "",
        metaDescription: post.metaDescription || "",
        canonicalUrl: post.canonicalUrl || "",
        featuredImage: post.featuredImage || "",
        tags: post.tags.map(t => t.name).join(", "),
      });
    }
  }, [postData, form]);

  const saveMutation = useMutation({
    mutationFn: async (data: PostFormData & { status?: string }) => {
      const payload = {
        ...data,
        tags: data.tags ? data.tags.split(",").map(t => t.trim()).filter(Boolean) : [],
      };

      if (postId) {
        return apiRequest("PUT", `/api/blog/posts/${postId}`, payload);
      } else {
        return apiRequest("POST", "/api/blog/posts", payload);
      }
    },
    onSuccess: (response: any) => {
      toast({
        title: "Success",
        description: postId ? "Post updated successfully" : "Post created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/blog/posts"] });
      if (!postId && response.post?.id) {
        navigate(`/blog/edit/${response.post.id}`);
      }
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save post",
        variant: "destructive",
      });
    },
  });

  const submitMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", `/api/blog/posts/${postId}/submit`, {});
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Post submitted for review",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/blog/posts/${postId}`] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to submit post",
        variant: "destructive",
      });
    },
  });

  const handleSaveDraft = async (data: PostFormData) => {
    await saveMutation.mutateAsync({ ...data, status: "draft" });
  };

  const handleSubmitForReview = async (data: PostFormData) => {
    if (postId) {
      await saveMutation.mutateAsync({ ...data });
      await submitMutation.mutateAsync();
    } else {
      const result = await saveMutation.mutateAsync({ ...data, status: "draft" });
      if (result.post?.id) {
        await apiRequest("POST", `/api/blog/posts/${result.post.id}/submit`, {});
        toast({
          title: "Success",
          description: "Post submitted for review",
        });
      }
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const watchTitle = form.watch("title");
  const watchContent = form.watch("content");

  if (isLoading && postId) {
    return (
      <div className="container mx-auto p-6 max-w-6xl">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-6 flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => navigate("/blog/admin")}
          data-testid="button-back"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
        <h1 className="text-3xl font-bold">
          {postId ? "Edit Post" : "Create New Post"}
        </h1>
      </div>

      <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                {...form.register("title")}
                placeholder="Enter post title"
                data-testid="input-title"
                onBlur={(e) => {
                  if (!form.getValues("slug")) {
                    form.setValue("slug", generateSlug(e.target.value));
                  }
                }}
              />
              {form.formState.errors.title && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.title.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                {...form.register("slug")}
                placeholder="post-url-slug"
                data-testid="input-slug"
              />
              {form.formState.errors.slug && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.slug.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="summary">Summary</Label>
              <Textarea
                id="summary"
                {...form.register("summary")}
                placeholder="Brief summary of the post (optional)"
                rows={3}
                data-testid="input-summary"
              />
            </div>

            <div>
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                {...form.register("tags")}
                placeholder="tag1, tag2, tag3"
                data-testid="input-tags"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Separate tags with commas
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Content</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="write" data-testid="tab-write">Write</TabsTrigger>
                <TabsTrigger value="preview" data-testid="tab-preview">Preview</TabsTrigger>
              </TabsList>
              <TabsContent value="write" className="mt-4">
                <Textarea
                  {...form.register("content")}
                  placeholder="Write your post content in Markdown..."
                  rows={20}
                  className="font-mono"
                  data-testid="input-markdown"
                />
                {form.formState.errors.content && (
                  <p className="text-sm text-destructive mt-1">
                    {form.formState.errors.content.message}
                  </p>
                )}
              </TabsContent>
              <TabsContent value="preview" className="mt-4">
                <div className="prose prose-lg max-w-none border rounded-lg p-6 min-h-[500px]" data-testid="content-preview">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {watchContent || "*No content yet...*"}
                  </ReactMarkdown>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>SEO & Metadata</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="metaTitle">Meta Title</Label>
              <Input
                id="metaTitle"
                {...form.register("metaTitle")}
                placeholder="SEO title (max 60 characters)"
                maxLength={60}
                data-testid="input-meta-title"
              />
              <p className="text-sm text-muted-foreground mt-1">
                {form.watch("metaTitle")?.length || 0}/60 characters
              </p>
            </div>

            <div>
              <Label htmlFor="metaDescription">Meta Description</Label>
              <Textarea
                id="metaDescription"
                {...form.register("metaDescription")}
                placeholder="SEO description (max 160 characters)"
                maxLength={160}
                rows={3}
                data-testid="input-meta-description"
              />
              <p className="text-sm text-muted-foreground mt-1">
                {form.watch("metaDescription")?.length || 0}/160 characters
              </p>
            </div>

            <div>
              <Label htmlFor="featuredImage">Featured Image URL</Label>
              <Input
                id="featuredImage"
                {...form.register("featuredImage")}
                placeholder="https://example.com/image.jpg"
                data-testid="input-featured-image"
              />
            </div>

            <div>
              <Label htmlFor="canonicalUrl">Canonical URL (optional)</Label>
              <Input
                id="canonicalUrl"
                {...form.register("canonicalUrl")}
                placeholder="https://example.com/original-post"
                data-testid="input-canonical-url"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={form.handleSubmit(handleSaveDraft)}
            disabled={saveMutation.isPending}
            data-testid="button-save-draft"
          >
            <Save className="mr-2 h-4 w-4" />
            Save Draft
          </Button>
          <Button
            type="button"
            onClick={form.handleSubmit(handleSubmitForReview)}
            disabled={saveMutation.isPending || submitMutation.isPending}
            data-testid="button-submit-review"
          >
            <Send className="mr-2 h-4 w-4" />
            Submit for Review
          </Button>
        </div>
      </form>
    </div>
  );
}
