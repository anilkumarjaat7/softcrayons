"use client";

import { useState, useEffect, use } from "react";
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

type CourseFormData = {
  title: string;
  slug: string;
  description: string;
  about: string;
  categoryId: string;
  fees: string;
  discount: string;
  duration: string;
  difficulty: string;
  topics: string[];
  bannerImage: string;
  thumbnailImage: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string[];
};

type CourseCategory = {
  id: number;
  title: string;
  slug: string;
};

export default function EditCoursePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [topicInput, setTopicInput] = useState("");
  const [keywordInput, setKeywordInput] = useState("");
  const [categories, setCategories] = useState<CourseCategory[]>([]);

  const [formData, setFormData] = useState<CourseFormData>({
    title: "",
    slug: "",
    description: "",
    about: "",
    categoryId: "",
    fees: "",
    discount: "",
    duration: "",
    difficulty: "BEGINNER",
    topics: [],
    bannerImage: "",
    thumbnailImage: "",
    metaTitle: "",
    metaDescription: "",
    metaKeywords: [],
  });

  useEffect(() => {
    fetchCategories();
    fetchCourse();
  }, [id]);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/admin/course-categories");
      const data = await response.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const fetchCourse = async () => {
    try {
      const response = await fetch(`/api/admin/courses/${id}`);
      const data = await response.json();

      if (data.success) {
        const course = data.data;
        setFormData({
          title: course.title || "",
          slug: course.slug || "",
          description: course.description || "",
          about: course.about || "",
          categoryId: course.categoryId?.toString() || "",
          fees: course.fees?.toString() || "",
          discount: course.discount?.toString() || "",
          duration: course.duration || "",
          difficulty: course.difficulty || "BEGINNER",
          topics: course.topics || [],
          bannerImage: course.bannerImage || "",
          thumbnailImage: course.thumbnailImage || "",
          metaTitle: course.metaTitle || "",
          metaDescription: course.metaDescription || "",
          metaKeywords: course.metaKeywords || [],
        });
      }
    } catch (error) {
      console.error("Error fetching course:", error);
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

  const handleSelectChange = (name: keyof CourseFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAboutChange = (about: string) => {
    setFormData((prev) => ({ ...prev, about }));
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

  const handleAddTopic = () => {
    if (!topicInput.trim()) return;
    if (formData.topics.includes(topicInput.trim())) return;
    setFormData((prev) => ({ ...prev, topics: [...prev.topics, topicInput.trim()] }));
    setTopicInput("");
  };

  const removeTopic = (topic: string) => {
    setFormData((prev) => ({
      ...prev,
      topics: prev.topics.filter((t) => t !== topic),
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

    if (!formData.categoryId) {
      alert("Please select a category");
      return;
    }

    setIsSubmitting(true);

    try {
      const submitData = {
        ...formData,
        categoryId: parseInt(formData.categoryId),
        fees: formData.fees ? parseFloat(formData.fees) : null,
        discount: formData.discount ? parseFloat(formData.discount) : null,
      };

      const response = await fetch(`/api/admin/courses/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      if (response.ok) {
        router.push("/dashboard/admin/courses");
        router.refresh();
      } else {
        const error = await response.json();
        console.error("Failed to update course:", error);
        alert(error.error || "Failed to update course");
      }
    } catch (error) {
      console.error("Error updating course:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-[98%] mx-auto p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/admin/courses">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Edit Course</h1>
            <p className="text-muted-foreground">
              Make changes to your course
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
            Save Changes
          </Button>
        </div>
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
                    placeholder="Enter course title"
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
                    placeholder="course-slug"
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
                    placeholder="Brief description of your course"
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
                <CardTitle>Course Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Category *</Label>
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
                  <Label>Difficulty *</Label>
                  <Select
                    value={formData.difficulty}
                    onValueChange={(value) => handleSelectChange("difficulty", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BEGINNER">Beginner</SelectItem>
                      <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                      <SelectItem value="ADVANCED">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fees">Fees (₹)</Label>
                    <Input
                      id="fees"
                      name="fees"
                      type="number"
                      placeholder="0"
                      value={formData.fees}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="discount">Discount (%)</Label>
                    <Input
                      id="discount"
                      name="discount"
                      type="number"
                      placeholder="0"
                      value={formData.discount}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    name="duration"
                    placeholder="e.g., 3 months"
                    value={formData.duration}
                    onChange={handleInputChange}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Topics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.topics.map((topic, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1 bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm"
                    >
                      {topic}
                      <button
                        type="button"
                        onClick={() => removeTopic(topic)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a topic..."
                    value={topicInput}
                    onChange={(e) => setTopicInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddTopic();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddTopic}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
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
                        "course_unsigned"
                      }
                      options={{
                        folder: "course-banners",
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
                        "course_unsigned"
                      }
                      options={{
                        folder: "course-thumbnails",
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
            <CardTitle>About (Detailed)</CardTitle>
          </CardHeader>
          <CardContent>
            <BlogEditor
              content={formData.about}
              onChange={handleAboutChange}
              placeholder="Write detailed information about the course..."
            />
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
