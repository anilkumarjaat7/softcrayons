"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CldUploadWidget, type CloudinaryUploadWidgetResults } from "next-cloudinary";
import { ArrowLeft, Loader2, ImagePlus, X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

type FacultyFormData = {
  name: string;
  designation: string;
  domain: string;
  avatar: string;
  bio: string;
  experience: string;
  ProjectsHandled: string;
  studentsMentored: string;
  ratings: string;
  technologies: string[];
  locations: string;
};

export default function EditFacultyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [techInput, setTechInput] = useState("");

  const [formData, setFormData] = useState<FacultyFormData>({
    name: "",
    designation: "",
    domain: "",
    avatar: "",
    bio: "",
    experience: "",
    ProjectsHandled: "",
    studentsMentored: "",
    ratings: "",
    technologies: [],
    locations: "",
  });

  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        const response = await fetch(`/api/admin/faculties/${id}`);
        const data = await response.json();

        if (data.success) {
          const faculty = data.data;
          setFormData({
            name: faculty.name || "",
            designation: faculty.designation || "",
            domain: faculty.domain || "",
            avatar: faculty.avatar || "",
            bio: faculty.bio || "",
            experience: faculty.experience || "",
            ProjectsHandled: faculty.ProjectsHandled || "",
            studentsMentored: faculty.studentsMentored || "",
            ratings: faculty.ratings?.toString() || "",
            technologies: faculty.technologies || [],
            locations: faculty.locations || "",
          });
        } else {
          alert("Faculty not found");
          router.push("/dashboard/admin/faculties");
        }
      } catch (error) {
        console.error("Failed to fetch faculty:", error);
        alert("Failed to load faculty data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFaculty();
  }, [id, router]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (url: string) => {
    setFormData((prev) => ({ ...prev, avatar: url }));
  };

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, avatar: "" }));
  };

  const addTechnology = () => {
    if (techInput.trim() && !formData.technologies.includes(techInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        technologies: [...prev.technologies, techInput.trim()],
      }));
      setTechInput("");
    }
  };

  const removeTechnology = (tech: string) => {
    setFormData((prev) => ({
      ...prev,
      technologies: prev.technologies.filter((t) => t !== tech),
    }));
  };

  const handleTechKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTechnology();
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Name is required");
      return;
    }

    if (!formData.designation.trim()) {
      alert("Designation is required");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        ...formData,
        ratings: formData.ratings ? parseFloat(formData.ratings) : null,
      };

      const response = await fetch(`/api/admin/faculties/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        router.push("/dashboard/admin/faculties");
      } else {
        alert(data.error || "Failed to update faculty");
      }
    } catch (error) {
      console.error("Error updating faculty:", error);
      alert("An error occurred while updating the faculty");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/admin/faculties">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Edit Faculty</h1>
          <p className="text-muted-foreground">
            Update faculty member details
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Update the faculty member&apos;s basic details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Enter faculty name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="designation">Designation *</Label>
                    <Input
                      id="designation"
                      name="designation"
                      placeholder="e.g. Senior Software Engineer"
                      value={formData.designation}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="domain">Domain</Label>
                    <Input
                      id="domain"
                      name="domain"
                      placeholder="e.g. Full Stack Development"
                      value={formData.domain}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="locations">Location</Label>
                    <Input
                      id="locations"
                      name="locations"
                      placeholder="e.g. Noida, Delhi"
                      value={formData.locations}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    placeholder="Brief biography of the faculty member..."
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Experience & Statistics</CardTitle>
                <CardDescription>
                  Update experience and achievements
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="experience">Experience</Label>
                    <Input
                      id="experience"
                      name="experience"
                      placeholder="e.g. 10+ years"
                      value={formData.experience}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ratings">Rating (0-5)</Label>
                    <Input
                      id="ratings"
                      name="ratings"
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      placeholder="e.g. 4.5"
                      value={formData.ratings}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="ProjectsHandled">Projects Handled</Label>
                    <Input
                      id="ProjectsHandled"
                      name="ProjectsHandled"
                      placeholder="e.g. 50+ projects"
                      value={formData.ProjectsHandled}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="studentsMentored">Students Mentored</Label>
                    <Input
                      id="studentsMentored"
                      name="studentsMentored"
                      placeholder="e.g. 500+ students"
                      value={formData.studentsMentored}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Technologies</CardTitle>
                <CardDescription>
                  Update the technologies this faculty member specializes in
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter technology (e.g. React, Node.js)"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyDown={handleTechKeyDown}
                  />
                  <Button type="button" onClick={addTechnology} variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.technologies.map((tech, idx) => (
                    <Badge key={idx} variant="secondary" className="gap-1 pr-1">
                      {tech}
                      <button
                        type="button"
                        onClick={() => removeTechnology(tech)}
                        className="ml-1 rounded-full p-0.5 hover:bg-muted"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                  {formData.technologies.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      No technologies added yet
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Photo</CardTitle>
                <CardDescription>
                  Update faculty member&apos;s photo
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col items-center gap-4">
                  {formData.avatar ? (
                    <div className="relative">
                      <Avatar className="h-32 w-32">
                        <AvatarImage src={formData.avatar} alt={formData.name || "Faculty"} />
                        <AvatarFallback className="text-2xl">
                          {formData.name ? getInitials(formData.name) : "?"}
                        </AvatarFallback>
                      </Avatar>
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute -right-2 -top-2 rounded-full bg-destructive p-1 text-destructive-foreground shadow-sm"
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
                        folder: "faculty-avatars",
                        maxFiles: 1,
                        resourceType: "image",
                        cropping: true,
                        croppingAspectRatio: 1,
                      }}
                      onSuccess={(result: CloudinaryUploadWidgetResults) => {
                        if (
                          result.info &&
                          typeof result.info === "object" &&
                          "secure_url" in result.info
                        ) {
                          handleImageUpload(result.info.secure_url as string);
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
                          className="flex h-32 w-32 flex-col items-center justify-center gap-2 rounded-full border-2 border-dashed border-muted-foreground/25 text-muted-foreground transition-colors hover:border-muted-foreground/50"
                        >
                          <ImagePlus className="h-8 w-8" />
                          <span className="text-xs">Upload</span>
                        </button>
                      )}
                    </CldUploadWidget>
                  )}
                  <p className="text-sm text-muted-foreground text-center">
                    Upload a square photo of the faculty member
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" asChild>
            <Link href="/dashboard/admin/faculties">Cancel</Link>
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Update Faculty
          </Button>
        </div>
      </form>
    </div>
  );
}
