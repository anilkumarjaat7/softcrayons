"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Loader2, ArrowLeft } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { CldUploadWidget } from "next-cloudinary";
import { KeywordInput } from "./KeywordInput";

export function CategoryForm({ initialData = null }: { initialData?: any }) {
  const router = useRouter();
  const isEditing = !!initialData;
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    description: initialData?.description || "",
    position: initialData?.position?.toString() || "0",
    // isPublic & isFeatured only editable when editing an existing entry
    isPublic: initialData?.isPublic ?? false,
    isFeatured: initialData?.isFeatured ?? false,
    logo: initialData?.logo || "",
    metaTitle: initialData?.metaTitle || "",
    metaDescription: initialData?.metaDescription || "",
    // Normalise to string[] regardless of whether it came as JSON array or raw array
    metaKeywords: Array.isArray(initialData?.metaKeywords)
      ? initialData.metaKeywords
      : initialData?.metaKeywords
      ? JSON.parse(initialData.metaKeywords)
      : [] as string[],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        position: parseInt(formData.position) || 0,
        metaKeywords: formData.metaKeywords.length > 0 ? formData.metaKeywords : undefined,
      };

      const url = isEditing
        ? `/api/admin/tutorial-categories/${initialData.id}`
        : "/api/admin/tutorial-categories";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Category saved successfully");
        router.push("/dashboard/admin/tutorials/categories");
        router.refresh();
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to save category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-24 p-4">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <h2 className="text-2xl font-bold">{isEditing ? "Edit Category" : "Create Category"}</h2>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* ── Left: Core + SEO ── */}
        <div className="col-span-1 md:col-span-2 space-y-6">
          <Card>
            <CardHeader><CardTitle>Core Information</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Title *</Label>
                <Input
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="React, Node.js..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Slug *</Label>
                  <Input
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="react-tutorial"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Position *</Label>
                  <Input
                    required
                    type="number"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>SEO Meta</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Meta Title</Label>
                <Input
                  value={formData.metaTitle}
                  onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Meta Description</Label>
                <Textarea
                  value={formData.metaDescription}
                  onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Meta Keywords</Label>
                <KeywordInput
                  value={formData.metaKeywords}
                  onChange={(kw) => setFormData({ ...formData, metaKeywords: kw })}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── Right: Settings ── */}
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Settings</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {/* isPublic & isFeatured are only shown when editing – new entries default to false */}
              {isEditing && (
                <>
                  <div className="flex items-center justify-between">
                    <Label>Publish Status</Label>
                    <Switch
                      checked={formData.isPublic}
                      onCheckedChange={(c) => setFormData({ ...formData, isPublic: c })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Featured</Label>
                    <Switch
                      checked={formData.isFeatured}
                      onCheckedChange={(c) => setFormData({ ...formData, isFeatured: c })}
                    />
                  </div>
                </>
              )}

              <div className="space-y-2 pt-2">
                <Label>Logo / Icon URL</Label>
                <div className="flex gap-2">
                  <Input
                    value={formData.logo}
                    onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                    placeholder="https://..."
                  />
                  <CldUploadWidget
                    uploadPreset="blogs_unsigned"
                    onSuccess={(res: any) => setFormData({ ...formData, logo: res.info.secure_url })}
                  >
                    {({ open }) => (
                      <Button type="button" variant="outline" onClick={() => open()}>
                        Upload
                      </Button>
                    )}
                  </CldUploadWidget>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Category
          </Button>
        </div>
      </form>
    </div>
  );
}