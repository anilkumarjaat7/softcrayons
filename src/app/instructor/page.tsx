"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Upload, Mail, Phone, User, Calendar, FileText, Users, Award, Loader2, CheckCircle, X } from "lucide-react";
import { CldUploadWidget, type CloudinaryUploadWidgetResults } from "next-cloudinary";
import { useToast } from "@/hooks/use-toast";

export default function InstructorPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    resume: "",
    resumeName: "",
    availability: "",
    message: "",
  });

  const handleResumeUpload = (url: string, fileName: string) => {
    setFormData((prev) => ({ ...prev, resume: url, resumeName: fileName }));
  };

  const removeResume = () => {
    setFormData((prev) => ({ ...prev, resume: "", resumeName: "" }));
  };

  const getAvailableDate = (availability: string): Date | null => {
    const now = new Date();
    switch (availability) {
      case "immediate":
        return now;
      case "1-week":
        return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      case "2-weeks":
        return new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
      case "1-month":
        return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      case "flexible":
        return null;
      default:
        return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/faculty-enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          resume: formData.resume,
          availableDate: getAvailableDate(formData.availability),
          message: formData.message,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setIsSuccess(true);
        toast({
          title: "Application Submitted!",
          description: data.message,
        });
        setFormData({
          name: "",
          email: "",
          phone: "",
          resume: "",
          resumeName: "",
          availability: "",
          message: "",
        });
      } else {
        toast({
          title: "Error",
          description: data.error,
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen brand-section pt-20 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
        </div>
        
        <div className="container py-16 relative z-10">
          <div className="max-w-xl mx-auto text-center">
            <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold mb-4">
              Application Received
            </h1>
            <p className="text-muted-foreground mb-8">
              Thank you for showing interest in teaching with us.  
              Our HR team will review your profile and contact you shortly.  
              You are one step closer to shaping future developers.
            </p>
            <Button onClick={() => setIsSuccess(false)}>
              Submit Another Application
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen brand-section pt-20 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      </div>
      
      <div className="container py-16 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <span className="brand-eyebrow mb-6">
              Teach - Mentor - Inspire
            </span>

            <h1 className="text-4xl sm:text-5xl font-black mb-6">
              Become an <span className="text-gradient">Instructor</span>
              <br />
              Build Future Developers
            </h1>

            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Agar aapke paas real industry experience hai aur aap knowledge share karna chahte hain,
              toh aap sirf padhayenge nahi - aap careers banaenge.  
              <br /><br />
              Hum passionate developers aur professionals ko invite karte hain
              jo next generation ko guide karna chahte hain.
              <br /><br />
              <strong>Flexible timing - Respectful environment - Growth opportunities</strong>
            </p>

            <div className="space-y-4">

              <div className="flex items-center gap-4 text-muted-foreground">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <span>Teach thousands of motivated learners</span>
              </div>

              <div className="flex items-center gap-4 text-muted-foreground">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Award className="w-5 h-5 text-primary" />
                </div>
                <span>Attractive compensation & recognition</span>
              </div>

              <div className="flex items-center gap-4 text-muted-foreground">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <span>Flexible schedule - Full-time / Part-time / Weekend</span>
              </div>

            </div>
          </div>

          <div className="relative">
            <div className="brand-panel rounded-md p-6 md:p-8">
              <h2 className="text-2xl font-bold mb-2">
                Apply as Instructor
              </h2>

              <p className="text-sm text-muted-foreground mb-6">
                Share your experience, inspire students & grow with us
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Your Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Enter your name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-11 pr-4 py-3 rounded-md bg-card border border-border focus:border-primary focus:ring-0 outline-none transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Email (for communication)
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-11 pr-4 py-3 rounded-md bg-card border border-border focus:border-primary focus:ring-0 outline-none transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Phone Number (HR callback)
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="tel"
                      placeholder="Enter your phone number"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-11 pr-4 py-3 rounded-md bg-card border border-border focus:border-primary focus:ring-0 outline-none transition-all"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Upload Resume / CV / Portfolio
                  </label>
                  {formData.resume ? (
                    <div className="flex items-center gap-3 w-full px-4 py-3 rounded-md bg-card border border-border">
                      <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-green-500" />
                      </div>
                      <div className="flex-1">
                        <span className="text-foreground truncate block">{formData.resumeName || "Resume uploaded"}</span>
                        <p className="text-xs text-green-600">Document uploaded successfully</p>
                      </div>
                      <button
                        type="button"
                        onClick={removeResume}
                        className="p-1.5 hover:bg-muted rounded-full transition-colors"
                      >
                        <X className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </div>
                  ) : (
                    <CldUploadWidget
                      uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "blog_unsigned"}
                      options={{
                        folder: "faculty-resumes",
                        maxFiles: 1,
                        resourceType: "raw",
                        clientAllowedFormats: ["pdf", "doc", "docx"],
                        maxFileSize: 5000000,
                      }}
                      onSuccess={(result: CloudinaryUploadWidgetResults) => {
                        if (result.info && typeof result.info === "object" && "secure_url" in result.info) {
                          const fileName = (result.info as { original_filename?: string; format?: string }).original_filename || "Resume";
                          const format = (result.info as { format?: string }).format || "";
                          handleResumeUpload(
                            result.info.secure_url as string,
                            `${fileName}.${format}`
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
                          className="flex items-center gap-3 w-full px-4 py-3 rounded-md bg-card border border-dashed border-border hover:border-primary cursor-pointer transition-all"
                          disabled={isSubmitting}
                        >
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Upload className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1 text-left">
                            <span className="text-muted-foreground">Upload Resume or Portfolio</span>
                            <p className="text-xs text-muted-foreground">PDF, DOC, DOCX - Max 5MB</p>
                          </div>
                          <FileText className="w-5 h-5 text-muted-foreground" />
                        </button>
                      )}
                    </CldUploadWidget>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    When can you start teaching?
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <select
                      value={formData.availability}
                      onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                      className="w-full pl-11 pr-4 py-3 rounded-md bg-card border border-border focus:border-primary focus:ring-0 outline-none transition-all appearance-none cursor-pointer"
                      required
                      disabled={isSubmitting}
                    >
                      <option value="">Select availability</option>
                      <option value="immediate">Immediately</option>
                      <option value="1-week">Within 1 Week</option>
                      <option value="2-weeks">Within 2 Weeks</option>
                      <option value="1-month">Within 1 Month</option>
                      <option value="flexible">Flexible / Discuss Later</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Why do you want to teach with us?
                  </label>
                  <textarea
                    placeholder="Your experience, tech stack, teaching style, LinkedIn/GitHub, or anything you want us to know..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 rounded-md bg-card border border-border focus:border-primary focus:ring-0 outline-none transition-all resize-none"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <Button type="submit" className="w-full group" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Apply & Join Our Instructor Team
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
