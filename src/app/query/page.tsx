"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageCircle, Mail, Phone, User, BookOpen, Loader2, CheckCircle } from "lucide-react";
import CourseSearch from "@/components/CourseSearch";
import { useToast } from "@/hooks/use-toast";

export default function QueryPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
      <QueryPageContent />
    </Suspense>
  );
}

function QueryPageContent() {
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [initialCourseLoaded, setInitialCourseLoaded] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    courseId: null as number | null,
    courseName: "",
    message: "",
  });

  useEffect(() => {
    if (initialCourseLoaded) return;
    const idParam = searchParams.get("id");

    if (idParam) {
      const courseId = parseInt(idParam);
      if (!isNaN(courseId)) {
        setFormData((prev) => ({ ...prev, courseId }));
        setInitialCourseLoaded(true);
      }
    } else {

      const fetchFirstCourse = async () => {
        try {
          const response = await fetch("/api/courses?limit=1");
          const data = await response.json();
          if (data.success && data.data.length > 0) {
            const first = data.data[0];
            setFormData((prev) => ({ ...prev, courseId: first.id, courseName: first.title }));
          }
        } catch (error) {
          console.error("Failed to fetch first course:", error);
        }
      };
      fetchFirstCourse();
      setInitialCourseLoaded(true);
    }
  }, [searchParams, initialCourseLoaded]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email.trim() || "test@softcrayons.in",
          phone: formData.phone,
          courseId: formData.courseId,
          message: formData.message || undefined,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setIsSuccess(true);
        toast({
          title: "Query Submitted!",
          description: data.message,
        });
        setFormData({
          name: "",
          email: "",
          phone: "",
          courseId: null,
          courseName: "",
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
              Thank You!
            </h1>
            <p className="text-muted-foreground mb-8">
              Hamari counselling team jaldi hi aapse contact karegi.  
              Tab tak relax kijiye, aapne apni tech journey ka first step le liya hai 
            </p>
            <Button onClick={() => setIsSuccess(false)}>
              Talk Again
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
              Start Your Tech Journey
            </span>

            <h1 className="text-4xl sm:text-5xl font-black mb-6">
              Confused About <span className="text-gradient">Courses?</span>
              <br />
              Let&apos;s Talk & Guide You
            </h1>

            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Ready to apply, curious about our courses, asking about fees, or
              just looking for career advice? Simply fill out this quick form.
              Our expert team will get in touch personally to help you find the
              perfect path!
              <br />
              <br />
              <strong>No Spam. No Pressure. Sirf Genuine Guidance.</strong>
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-4 text-muted-foreground">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-primary" />
                </div>
                <span>Quick response within 24 hours</span>
              </div>

              <div className="flex items-center gap-4 text-muted-foreground">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-primary" />
                </div>
                <span>Expert guidance on course & career selection</span>
              </div>

              <div className="flex items-center gap-4 text-muted-foreground">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <span>Direct call support from our counsellor</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="brand-panel rounded-md p-6 md:p-8">
              <h2 className="text-2xl font-bold mb-6">
                Fill Details & We&apos;ll Call You Back in
                <span className="text-gradient"> 24 Hours</span>
              </h2>

              <p className="text-sm text-muted-foreground mb-4">
                Admission, Doubt, Fees, Course Selection, single form for all
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
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full pl-11 pr-4 py-3 rounded-md bg-card border border-border focus:border-primary focus:ring-0 outline-none transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Email (optional)
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full pl-11 pr-4 py-3 rounded-md bg-card border border-border focus:border-primary focus:ring-0 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Phone Number (for callback)
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="tel"
                      placeholder="Enter your phone number"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full pl-11 pr-4 py-3 rounded-md bg-card border border-border focus:border-primary focus:ring-0 outline-none transition-all"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Which Course Interests You?
                  </label>
                  <CourseSearch
                    value={formData.courseId}
                    onChange={(courseId, courseName) =>
                      setFormData({ ...formData, courseId, courseName })
                    }
                    placeholder="Search and select a course"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Your Doubt / Admission Query / Message
                  </label>
                  <textarea
                    placeholder="Example: fees, duration, placement, demo class, beginner hoon kya join kar sakta hoon?"
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    rows={4}
                    className="w-full px-4 py-3 rounded-md bg-card border border-border focus:border-primary focus:ring-0 outline-none transition-all resize-none"
                    disabled={isSubmitting}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full group"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit & Get Free Guidance
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
