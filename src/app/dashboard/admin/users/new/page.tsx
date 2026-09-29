"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { CldUploadWidget, type CloudinaryUploadWidgetResults } from "next-cloudinary";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { authClient } from "@/lib/auth-client";
import { ArrowLeft, Save, Loader2, ImagePlus, X } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { type UserRole } from "@/components/dashboard/users";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ROLES: { label: string; value: UserRole }[] = [
  { label: "Admin", value: "ADMIN" },
  { label: "Student", value: "STUDENT" },
  { label: "Instructor", value: "INSTRUCTOR" },
  { label: "Counselor", value: "COUNSELOR" },
  { label: "HR", value: "HR" },
  { label: "Content Writer", value: "CONTENT_WRITER" },
  { label: "Agent", value: "AGENT" },
];

export default function NewUserPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "STUDENT" as UserRole,
    image: "",
  });

  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const { data, error } = await authClient.admin.createUser({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        role: formData.role as unknown as "user" | "admin",
        data: {
          phone: formData.phone || undefined,
          image: formData.image || undefined,
        },
      });

      if (error) {
        toast.error(error.message || "Failed to create user");
        return;
      }

      if (data) {
        toast.success("User created successfully");
        router.push("/dashboard/admin/users");
      }
    } catch {
      toast.error("Failed to create user");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/admin/users">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Create New User</h1>
          <p className="text-sm text-muted-foreground">
            Add a new user to the platform
          </p>
        </div>
      </div>

      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-6 space-y-6">
            <div className="space-y-2">
              <Label>Profile Image</Label>
              <div className="flex items-center gap-4">
                {formData.image ? (
                  <div className="relative">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={formData.image} alt="Profile" />
                      <AvatarFallback className="bg-primary/10 text-primary text-xl">
                        {formData.name ? formData.name.slice(0, 2).toUpperCase() : "U"}
                      </AvatarFallback>
                    </Avatar>
                    <button
                      type="button"
                      onClick={() => handleChange("image", "")}
                      className="absolute -right-1 -top-1 rounded-full bg-destructive p-1 text-destructive-foreground"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <CldUploadWidget
                    uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "blog_unsigned"}
                    options={{
                      folder: "user-avatars",
                      maxFiles: 1,
                      resourceType: "image",
                      cropping: true,
                      croppingAspectRatio: 1,
                    }}
                    onSuccess={(result: CloudinaryUploadWidgetResults) => {
                      if (result.info && typeof result.info === "object" && "secure_url" in result.info) {
                        handleChange("image", result.info.secure_url as string);
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
                        className="flex h-20 w-20 flex-col items-center justify-center gap-1 rounded-full border-2 border-dashed border-muted-foreground/25 text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
                      >
                        <ImagePlus className="h-6 w-6" />
                      </button>
                    )}
                  </CldUploadWidget>
                )}
                <div className="text-sm text-muted-foreground">
                  <p>Upload a profile picture</p>
                  <p className="text-xs">Recommended: Square image, at least 200x200px</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">
                Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                placeholder="Enter user's full name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">
                Email <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter email address"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter phone number (optional)"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">
                Role <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.role}
                onValueChange={(value) => handleChange("role", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {ROLES.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">
                Password <span className="text-destructive">*</span>
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password (min 8 characters)"
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                className={errors.password ? "border-destructive" : ""}
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">
                Confirm Password <span className="text-destructive">*</span>
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={(e) => handleChange("confirmPassword", e.target.value)}
                className={errors.confirmPassword ? "border-destructive" : ""}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-destructive">{errors.confirmPassword}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button type="submit" disabled={isSubmitting} className="gap-2">
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Create User
                </>
              )}
            </Button>
            <Link href="/dashboard/admin/users">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
