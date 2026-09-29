"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Building2, Mail, Phone, Clock, Users, Award, Calendar, Loader2, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function EnterprisePage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "",
    phone: "",
    email: "",
    duration: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/enterprise-enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: formData.companyName,
          email: formData.email,
          phone: formData.phone,
          duration: formData.duration,
          message: formData.message,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setIsSuccess(true);
        toast({
          title: "Enquiry Submitted!",
          description: data.message,
        });
        setFormData({
          companyName: "",
          phone: "",
          email: "",
          duration: "",
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
              Request Received
            </h1>
            <p className="text-muted-foreground mb-8">
              Thank you for reaching out.  
              Our enterprise training team will contact you shortly with a customized proposal.
            </p>
            <Button onClick={() => setIsSuccess(false)}>
              Submit Another Request
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
              Corporate - Enterprise - Team Training
            </span>

            <h1 className="text-4xl sm:text-5xl font-black mb-6">
              Upskill Your <span className="text-gradient">Team</span>
              <br />
              With Industry-Ready Training
            </h1>

            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Empower your employees with practical, project-based tech training.  
              We design customized programs for startups, SMEs and enterprises
              to improve productivity, technical depth and innovation culture.
              <br /><br />
              From beginner to advanced - we align training with your business goals.
              <br /><br />
              <strong>Online - Offline - Hybrid - Custom Curriculum</strong>
            </p>

            <div className="space-y-4">

              <div className="flex items-center gap-4 text-muted-foreground">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <span>Train small teams to large departments</span>
              </div>

              <div className="flex items-center gap-4 text-muted-foreground">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Award className="w-5 h-5 text-primary" />
                </div>
                <span>Certified trainers with real industry experience</span>
              </div>

              <div className="flex items-center gap-4 text-muted-foreground">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <span>Flexible schedules & dedicated support</span>
              </div>

            </div>
          </div>

          <div className="relative">
            <div className="brand-panel rounded-md p-6 md:p-8">
              <h2 className="text-2xl font-bold mb-2">
                Request Corporate Training
              </h2>

              <p className="text-sm text-muted-foreground mb-6">
                Tell us your requirement - we will design a custom training plan within 24 hours.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Company / Organization Name
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Enter organization name"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      className="w-full pl-11 pr-4 py-3 rounded-md bg-card border border-border focus:border-primary focus:ring-0 outline-none transition-all"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Official Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="email"
                      placeholder="Enter official email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-11 pr-4 py-3 rounded-md bg-card border border-border focus:border-primary focus:ring-0 outline-none transition-all"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Business Contact Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="tel"
                      placeholder="Enter contact number"
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
                    Preferred Training Duration
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <select
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      className="w-full pl-11 pr-4 py-3 rounded-md bg-card border border-border focus:border-primary focus:ring-0 outline-none transition-all appearance-none cursor-pointer"
                      disabled={isSubmitting}
                    >
                      <option value="">Select duration</option>
                      <option value="1 Week">1 Week</option>
                      <option value="2 Weeks">2 Weeks</option>
                      <option value="1 Month">1 Month</option>
                      <option value="2 Months">2 Months</option>
                      <option value="3 Months">3 Months</option>
                      <option value="6 Months">6 Months</option>
                      <option value="Custom">Custom Duration</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Training Requirement Details
                  </label>
                  <textarea
                    placeholder="Number of employees, tech stack, experience level, preferred mode (online/offline), goals..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 rounded-md bg-card border border-border focus:border-primary focus:ring-0 outline-none transition-all resize-none"
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
                      Request Training Proposal
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
