"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CldUploadWidget, type CloudinaryUploadWidgetResults } from "next-cloudinary";
import {
  ArrowLeft,
  Save,
  ImagePlus,
  X,
  Loader2,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import BlogEditor from "@/components/dashboard/admin/blog/BlogEditor";

type BlogFormData = {
  title: string;
  slug: string;
  description: string;
  content: string;
  categoryId: string;
  readTime: string;
  tags: string[];
  tableOfContents: string[];
  bannerImage: string;
  thumbnailImage: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string[];
};

type BlogCategory = {
  id: number;
  title: string;
  slug: string;
};

export default function NewBlogPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [keywordInput, setKeywordInput] = useState("");
  const [tocInput, setTocInput] = useState("");
  const [categories, setCategories] = useState<BlogCategory[]>([]);

  const [formData, setFormData] = useState<BlogFormData>({
    title: "",
    slug: "",
    description: "",
    content: "",
    categoryId: "",
    readTime: "",
    tags: [],
    tableOfContents: [],
    bannerImage: "",
    thumbnailImage: "",
    metaTitle: "",
    metaDescription: "",
    metaKeywords: [],
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/admin/blog-categories");
      const data = await response.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
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

  const handleSelectChange = (name: keyof BlogFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleContentChange = (content: string) => {
    setFormData((prev) => ({ ...prev, content }));
  };

  const handleImageUpload = (
    field: "bannerImage" | "thumbnailImage",
    url: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: url }));
  };

  const removeImage = (field: "bannerImage" | "thumbnailImage") => {
    setFormData((prev) => ({ ...prev, [field]: "" }));
  };

  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    if (formData.tags.includes(tagInput.trim())) return;
    setFormData((prev) => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const handleAddToc = () => {
    if (!tocInput.trim()) return;
    if (formData.tableOfContents.includes(tocInput.trim())) return;
    setFormData((prev) => ({
      ...prev,
      tableOfContents: [...prev.tableOfContents, tocInput.trim()],
    }));
    setTocInput("");
  };

  const removeToc = (item: string) => {
    setFormData((prev) => ({
      ...prev,
      tableOfContents: prev.tableOfContents.filter((t) => t !== item),
    }));
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
    setIsSubmitting(true);

    try {
      const submitData = {
        title: formData.title,
        slug: formData.slug,
        description: formData.description,
        content: formData.content,
        categoryId: parseInt(formData.categoryId),
        readTime: parseInt(formData.readTime) || 5,
        tags: formData.tags,
        tableOfContents: formData.tableOfContents,
        bannerImage: formData.bannerImage,
        thumbnailImage: formData.thumbnailImage,
        metaTitle: formData.metaTitle,
        metaDescription: formData.metaDescription,
        metaKeywords: formData.metaKeywords,
      };

      const response = await fetch("/api/counselor/blogs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      if (response.ok) {
        router.push("/dashboard/counselor/blogs");
        router.refresh();
      } else {
        const error = await response.json();
        console.error("Failed to create blog:", error);
        alert(error.error || "Failed to create blog");
      }
    } catch (error) {
      console.error("Error creating blog:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-[98%] mx-auto p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/counselor/blogs">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Create New Blog Post</h1>
            <p className="text-muted-foreground">
              Write and publish a new blog article
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save Post
          </Button>
        </div>
      </div>

      <div className="bg-muted/50 border rounded-lg p-4 text-sm text-muted-foreground">
        <strong>Note:</strong> Your post will be saved as a draft and reviewed by an administrator before publication.
        The publish status and featured settings will be managed by admins.
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Enter blog title"
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
                    placeholder="blog-post-slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Short Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Brief description of your blog post"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>SEO Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="metaTitle">Meta Title</Label>
                  <Input
                    id="metaTitle"
                    name="metaTitle"
                    placeholder="SEO optimized title"
                    value={formData.metaTitle}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="metaDescription">Meta Description</Label>
                  <Textarea
                    id="metaDescription"
                    name="metaDescription"
                    placeholder="Brief description for search results"
                    value={formData.metaDescription}
                    onChange={handleInputChange}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Meta Keywords</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.metaKeywords.map((keyword, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-1 bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm"
                      >
                        {keyword}
                        <button
                          type="button"
                          onClick={() => removeKeyword(keyword)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a keyword..."
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
                      onClick={handleAddKeyword}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Organization</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select
                    value={formData.categoryId}
                    onValueChange={(value) => handleSelectChange("categoryId", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id.toString()}>
                          {cat.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="readTime">Read Time (minutes)</Label>
                  <Input
                    id="readTime"
                    name="readTime"
                    type="number"
                    placeholder="5"
                    value={formData.readTime}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Tags</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.tags.map((tag, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-1 bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a tag..."
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAddTag}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Table of Contents</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.tableOfContents.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-1 bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm"
                      >
                        {item}
                        <button
                          type="button"
                          onClick={() => removeToc(item)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a section heading..."
                      value={tocInput}
                      onChange={(e) => setTocInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddToc();
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAddToc}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Images</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Banner Image</Label>
                  {formData.bannerImage ? (
                    <div className="relative aspect-video overflow-hidden rounded-lg border">
                      <img
                        src={formData.bannerImage}
                        alt="Banner"
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage("bannerImage")}
                        className="absolute right-2 top-2 rounded-full bg-destructive p-1 text-destructive-foreground"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <CldUploadWidget
                      uploadPreset={
                        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ||
                        "blog_unsigned"
                      }
                      options={{
                        folder: "blog-banners",
                        maxFiles: 1,
                        resourceType: "image",
                      }}
                      onSuccess={(result: CloudinaryUploadWidgetResults) => {
                        if (
                          result.info &&
                          typeof result.info === "object" &&
                          "secure_url" in result.info
                        ) {
                          handleImageUpload(
                            "bannerImage",
                            result.info.secure_url as string
                          );
                        }
                        document.body.style.overflow = "";
                        document.body.style.pointerEvents = "";
                      }}
                      onClose={() => {
                        setTimeout(() => {
                          document.body.style.overflow = "";
                          document.body.style.pointerEvents = "";
                        }, 100);
                      }}
                      onError={() => {
                        document.body.style.overflow = "";
                        document.body.style.pointerEvents = "";
                      }}
                    >
                      {({ open }) => (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            open();
                          }}
                          className="flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-muted-foreground/25 text-muted-foreground transition-colors hover:border-muted-foreground/50"
                        >
                          <ImagePlus className="h-8 w-8" />
                          <span className="text-sm">Upload banner image</span>
                        </button>
                      )}
                    </CldUploadWidget>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Thumbnail Image</Label>
                  {formData.thumbnailImage ? (
                    <div className="relative aspect-square w-full max-w-[200px] mx-auto overflow-hidden rounded-lg border">
                      <img
                        src={formData.thumbnailImage}
                        alt="Thumbnail"
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage("thumbnailImage")}
                        className="absolute right-1 top-1 rounded-full bg-destructive p-1 text-destructive-foreground"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <CldUploadWidget
                      uploadPreset={
                        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ||
                        "blog_unsigned"
                      }
                      options={{
                        folder: "blog-thumbnails",
                        maxFiles: 1,
                        resourceType: "image",
                      }}
                      onSuccess={(result: CloudinaryUploadWidgetResults) => {
                        if (
                          result.info &&
                          typeof result.info === "object" &&
                          "secure_url" in result.info
                        ) {
                          handleImageUpload(
                            "thumbnailImage",
                            result.info.secure_url as string
                          );
                        }
                        document.body.style.overflow = "";
                        document.body.style.pointerEvents = "";
                      }}
                      onClose={() => {
                        setTimeout(() => {
                          document.body.style.overflow = "";
                          document.body.style.pointerEvents = "";
                        }, 100);
                      }}
                      onError={() => {
                        document.body.style.overflow = "";
                        document.body.style.pointerEvents = "";
                      }}
                    >
                      {({ open }) => (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            open();
                          }}
                          className="flex aspect-square w-full max-w-[200px] mx-auto flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-muted-foreground/25 text-muted-foreground transition-colors hover:border-muted-foreground/50"
                        >
                          <ImagePlus className="h-6 w-6" />
                          <span className="text-xs">Thumbnail</span>
                        </button>
                      )}
                    </CldUploadWidget>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card className="min-h-[500px]">
          <CardHeader>
            <CardTitle>Content</CardTitle>
          </CardHeader>
          <CardContent>
            <BlogEditor
              content={formData.content}
              onChange={handleContentChange}
              placeholder="Start writing your amazing blog post..."
            />
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
