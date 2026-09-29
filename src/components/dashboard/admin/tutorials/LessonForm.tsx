"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { SearchableSelect } from "./SearchableSelect";
import BlogEditor from "@/components/dashboard/admin/blog/BlogEditor";
import { Loader2, ArrowLeft, Plus, Trash } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { CldUploadWidget } from "next-cloudinary";
import { KeywordInput } from "./KeywordInput";

type LessonFormData = {
  title: string;
  slug: string;
  description: string;
  content: string;
  position: string;
  subtopicId: string;
  isPublic: boolean;
  isFeatured: boolean;
  tableOfContent: { id: string; text: string }[];
  nextLink: string;
  previousLink: string;
  homeLink: string;
  logo: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string[];
};

export function LessonForm({
  initialData = null,
  defaultSubtopicId = "",
}: {
  initialData?: any;
  defaultSubtopicId?: string;
}) {
  const router = useRouter();
  const isEditing = !!initialData;
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<LessonFormData>({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    description: initialData?.description || "",
    content: initialData?.content || "",
    position: initialData?.position?.toString() || "0",
    subtopicId: initialData?.subtopicId?.toString() || defaultSubtopicId || "",
    isPublic: initialData?.isPublic ?? false,
    isFeatured: initialData?.isFeatured ?? false,
    tableOfContent: Array.isArray(initialData?.tableOfContent)
      ? initialData.tableOfContent
      : initialData?.tableOfContent
      ? JSON.parse(initialData.tableOfContent)
      : [],
    nextLink: initialData?.nextLink || "",
    previousLink: initialData?.previousLink || "",
    homeLink: initialData?.homeLink || "",
    logo: initialData?.logo || "",
    metaTitle: initialData?.metaTitle || "",
    metaDescription: initialData?.metaDescription || "",
    metaKeywords: Array.isArray(initialData?.metaKeywords)
      ? initialData.metaKeywords
      : initialData?.metaKeywords
      ? JSON.parse(initialData.metaKeywords)
      : [],
  });

  const [subtopics, setSubtopics] = useState<{ label: string; value: string }[]>([]);

  // Auto-generate slug from title on create
  useEffect(() => {
    if (!isEditing && formData.title && !formData.slug) {
      setFormData((prev) => ({
        ...prev,
        slug: formData.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, ""),
      }));
    }
  }, [formData.title, isEditing, formData.slug]);

  useEffect(() => {
    fetch("/api/admin/tutorial-subtopics?limit=500")
      .then((res) => res.json())
      .then((d) => {
        if (d.success)
          setSubtopics(
            d.data.map((subtopic: any) => ({
              label: subtopic.topic?.title
                ? `${subtopic.title} - ${subtopic.topic.title}${subtopic.topic.category?.title ? ` - ${subtopic.topic.category.title}` : ""}`
                : subtopic.title,
              value: subtopic.id.toString(),
            }))
          );
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.subtopicId) {
      toast.error("Please select a subtopic.");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        ...formData,
        position: parseInt(formData.position) || 0,
        subtopicId: parseInt(formData.subtopicId),
        metaKeywords: formData.metaKeywords.length > 0 ? formData.metaKeywords : undefined,
      };

      const url = isEditing
        ? `/api/admin/tutorial-lessons/${initialData.id}`
        : "/api/admin/tutorial-lessons";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.success) {
        toast.success("Lesson saved successfully");
        router.push("/dashboard/admin/tutorials/lessons");
        router.refresh();
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to save lesson");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-24 p-4">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <h2 className="text-2xl font-bold">{isEditing ? "Edit Lesson" : "Create New Lesson"}</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ── 3-column meta/settings grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Left: Core info */}
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
                    placeholder="Lesson Title"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Slug *</Label>
                    <Input
                      required
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="url-slug"
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
                  <Label>Short Description</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                {/* Hierarchy cascade */}
                <div className="pt-4 border-t space-y-4">
                  <h4 className="font-semibold text-sm text-muted-foreground">Hierarchy Placement</h4>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label>Select Subtopic *</Label>
                      <SearchableSelect
                        items={subtopics}
                        value={formData.subtopicId}
                        onValueChange={(v: string) => setFormData({ ...formData, subtopicId: v })}
                        placeholder="Pick Subtopic..."
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right: Settings + Navigation + SEO */}
          <div className="space-y-6">
            <Card>
              <CardHeader><CardTitle>Settings</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {/* Only show publish/featured toggles when editing */}
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
                    />
                    <CldUploadWidget
                      uploadPreset="blogs_unsigned"
                      onSuccess={(res: any) =>
                        setFormData({ ...formData, logo: res.info.secure_url })
                      }
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

            <Card>
              <CardHeader><CardTitle>Navigation Overrides</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Next Link</Label>
                  <Input
                    value={formData.nextLink}
                    onChange={(e) => setFormData({ ...formData, nextLink: e.target.value })}
                    placeholder="/path/to/next"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Previous Link</Label>
                  <Input
                    value={formData.previousLink}
                    onChange={(e) => setFormData({ ...formData, previousLink: e.target.value })}
                    placeholder="/path/to/prev"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Home Link</Label>
                  <Input
                    value={formData.homeLink}
                    onChange={(e) => setFormData({ ...formData, homeLink: e.target.value })}
                    placeholder="/path/to/home"
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
                    onChange={(e) =>
                      setFormData({ ...formData, metaDescription: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Meta Keywords</Label>
                  <KeywordInput
                    value={formData.metaKeywords}
                    onChange={(kw) => setFormData({ ...formData, metaKeywords: kw })}
                  />
                </div>

                {/* Table of Contents */}
                <div className="space-y-2 pt-2 border-t">
                  <Label>Table of Contents</Label>
                  <div className="space-y-2">
                    {formData.tableOfContent.map((toc, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={toc.id}
                          onChange={(e) => {
                            const newArr = [...formData.tableOfContent];
                            newArr[index].id = e.target.value;
                            setFormData({ ...formData, tableOfContent: newArr });
                          }}
                          placeholder="ID (e.g. intro)"
                          className="w-1/3"
                        />
                        <Input
                          value={toc.text}
                          onChange={(e) => {
                            const newArr = [...formData.tableOfContent];
                            newArr[index].text = e.target.value;
                            setFormData({ ...formData, tableOfContent: newArr });
                          }}
                          placeholder="Label (e.g. Introduction)"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            const newArr = [...formData.tableOfContent];
                            newArr.splice(index, 1);
                            setFormData({ ...formData, tableOfContent: newArr });
                          }}
                        >
                          <Trash className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          tableOfContent: [
                            ...formData.tableOfContent,
                            { id: "", text: "" },
                          ],
                        })
                      }
                    >
                      <Plus className="w-4 h-4 mr-2" /> Add ToC Item
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Lesson
            </Button>
          </div>
        </div>

        {/* ── Full-width editor OUTSIDE the 3-col grid so it spans 100% ── */}
        <Card className="min-h-[500px] w-full">
          <CardHeader><CardTitle>Lesson Body</CardTitle></CardHeader>
          <CardContent className="p-0">
            <BlogEditor
              content={formData.content}
              onChange={(c) => setFormData({ ...formData, content: c })}
            />
          </CardContent>
        </Card>
      </form>
    </div>
  );
}