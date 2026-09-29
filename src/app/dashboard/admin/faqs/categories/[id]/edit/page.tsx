"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

type CategoryFormData = {
  title: string;
  slug: string;
  description: string;
  isPublic: boolean;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string[];
};

export default function EditFaqCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [keywordInput, setKeywordInput] = useState("");
  const [formData, setFormData] = useState<CategoryFormData>({
    title: "",
    slug: "",
    description: "",
    isPublic: false,
    metaTitle: "",
    metaDescription: "",
    metaKeywords: [],
  });

  useEffect(() => {
    fetchCategory();
  }, [id]);

  const fetchCategory = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/admin/faq-categories/${id}`);
      const data = await response.json();

      if (data.success) {
        const category = data.data;
        setFormData({
          title: category.title || "",
          slug: category.slug || "",
          description: category.description || "",
          isPublic: category.isPublic || false,
          metaTitle: category.metaTitle || "",
          metaDescription: category.metaDescription || "",
          metaKeywords: category.metaKeywords || [],
        });
      } else {
        alert("Failed to load category");
        router.push("/dashboard/admin/faqs/categories");
      }
    } catch (error) {
      console.error("Error fetching category:", error);
      router.push("/dashboard/admin/faqs/categories");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, isPublic: checked }));
  };

  const handleAddKeyword = () => {
    if (!keywordInput.trim()) return;
    if (formData.metaKeywords.includes(keywordInput.trim())) return;
    setFormData((prev) => ({
      ...prev,
      metaKeywords: [...prev.metaKeywords, keywordInput.trim()],
    }));
    setKeywordInput("");
  };

  const removeKeyword = (keyword: string) => {
    setFormData((prev) => ({
      ...prev,
      metaKeywords: prev.metaKeywords.filter((k) => k !== keyword),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert("Title is required");
      return;
    }

    if (!formData.slug.trim()) {
      alert("Slug is required");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/admin/faq-categories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        router.push("/dashboard/admin/faqs/categories");
      } else {
        alert(data.error || "Failed to update category");
      }
    } catch (error) {
      console.error("Error updating category:", error);
      alert("An error occurred while updating the category");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto p-4 space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-20 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/admin/faqs/categories">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Edit FAQ Category</h1>
          <p className="text-muted-foreground">
            Update the category details
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Update the basic details for the category
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Enter category title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  name="slug"
                  placeholder="category-slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Enter category description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label>Public</Label>
                <p className="text-sm text-muted-foreground">
                  Make this category visible to the public
                </p>
              </div>
              <Switch
                checked={formData.isPublic}
                onCheckedChange={handleSwitchChange}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>SEO Settings</CardTitle>
            <CardDescription>
              Optimize for search engines
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="metaTitle">Meta Title</Label>
              <Input
                id="metaTitle"
                name="metaTitle"
                placeholder="SEO title for the category"
                value={formData.metaTitle}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="metaDescription">Meta Description</Label>
              <Textarea
                id="metaDescription"
                name="metaDescription"
                placeholder="SEO description for the category"
                value={formData.metaDescription}
                onChange={handleInputChange}
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label>Meta Keywords</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a keyword"
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddKeyword();
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleAddKeyword}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {formData.metaKeywords.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.metaKeywords.map((keyword) => (
                    <Badge
                      key={keyword}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {keyword}
                      <button
                        type="button"
                        onClick={() => removeKeyword(keyword)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" asChild>
            <Link href="/dashboard/admin/faqs/categories">Cancel</Link>
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Update Category
          </Button>
        </div>
      </form>
    </div>
  );
}
