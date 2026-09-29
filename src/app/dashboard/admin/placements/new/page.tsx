"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CldUploadWidget, type CloudinaryUploadWidgetResults } from "next-cloudinary";
import { ArrowLeft, Loader2, ImagePlus, X } from "lucide-react";
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

type PlacementFormData = {
  studentName: string;
  courseName: string;
  avatar: string;
  dialogue: string;
  companyName: string;
  packageOffered: string;
  position: string;
};

export default function NewPlacementPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<PlacementFormData>({
    studentName: "",
    courseName: "",
    avatar: "",
    dialogue: "",
    companyName: "",
    packageOffered: "",
    position: "",
  });

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

    if (!formData.studentName.trim()) {
      alert("Student name is required");
      return;
    }

    if (!formData.courseName.trim()) {
      alert("Course name is required");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin/placements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        router.push("/dashboard/admin/placements");
      } else {
        alert(data.error || "Failed to create placement");
      }
    } catch (error) {
      console.error("Error creating placement:", error);
      alert("An error occurred while creating the placement");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/admin/placements">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">New Placement</h1>
          <p className="text-muted-foreground">
            Add a new student placement record
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Student Information</CardTitle>
                <CardDescription>
                  Enter the student details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="studentName">Student Name *</Label>
                    <Input
                      id="studentName"
                      name="studentName"
                      placeholder="Enter student name"
                      value={formData.studentName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="courseName">Course Name *</Label>
                    <Input
                      id="courseName"
                      name="courseName"
                      placeholder="Enter course name"
                      value={formData.courseName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dialogue">Student Testimonial</Label>
                  <Textarea
                    id="dialogue"
                    name="dialogue"
                    placeholder="Enter student's success story or testimonial"
                    value={formData.dialogue}
                    onChange={handleInputChange}
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Placement Details</CardTitle>
                <CardDescription>
                  Enter the job placement information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input
                      id="companyName"
                      name="companyName"
                      placeholder="Enter company name"
                      value={formData.companyName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="position">Position</Label>
                    <Input
                      id="position"
                      name="position"
                      placeholder="e.g., Software Engineer"
                      value={formData.position}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="packageOffered">Package Offered</Label>
                  <Input
                    id="packageOffered"
                    name="packageOffered"
                    placeholder="e.g., 12 LPA"
                    value={formData.packageOffered}
                    onChange={handleInputChange}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Student Photo</CardTitle>
                <CardDescription>
                  Upload the student's photo
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col items-center gap-4">
                  {formData.avatar ? (
                    <div className="relative">
                      <Avatar className="h-32 w-32">
                        <AvatarImage src={formData.avatar} alt={formData.studentName || "Student"} />
                        <AvatarFallback className="text-2xl">
                          {formData.studentName ? getInitials(formData.studentName) : "ST"}
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
                        folder: "placement-avatars",
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
                    Upload a square photo of the student
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" asChild>
            <Link href="/dashboard/admin/placements">Cancel</Link>
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Placement
          </Button>
        </div>
      </form>
    </div>
  );
}
