import React from "react";
import { Star, MapPin, Briefcase, GraduationCap, Code } from "lucide-react";
import Image from "next/image";

interface FacultyData {
  id: number;
  name: string;
  designation: string | null;
  domain: string | null;
  avatar: string | null;
  bio: string | null;
  experience: string | null;
  ProjectsHandled: string | null;
  studentsMentored: string | null;
  ratings: number | null;
  technologies: string[] | null;
  locations: string | null;
  isFeatured: boolean;
}

interface FeaturedFacultyCardProps {
  faculty: FacultyData;
  index: number;
}

export const FeaturedFacultyCard = ({ faculty, index }: FeaturedFacultyCardProps) => {
  const isReversed = index % 2 !== 0;
  const skills = Array.isArray(faculty.technologies) ? faculty.technologies : [];

  return (
    <div className="group relative brand-panel brand-card-hover rounded-md overflow-hidden">
      <div className="absolute top-4 right-4 z-10">
        <span className="bg-secondary text-secondary-foreground text-xs font-bold px-3 py-1 rounded-md flex items-center gap-1.5">
          <Star className="w-3 h-3 fill-current" />
          Featured
        </span>
      </div>

      <div className={`grid md:grid-cols-5 ${isReversed ? "md:grid-flow-dense" : ""}`}>
        <div className={`relative md:col-span-2 min-h-[280px] md:min-h-[380px] bg-muted/30 ${isReversed ? "md:col-start-4" : ""}`}>
          <div 
            className="absolute inset-0 opacity-50"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--primary) / 0.15) 1px, transparent 0)`,
              backgroundSize: "20px 20px",
            }}
          />

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              {faculty.avatar ? (
                <div className="w-36 h-36 md:w-44 md:h-44 rounded-full overflow-hidden shadow-lg border-4 border-background">
                  <Image
                    src={faculty.avatar}
                    alt={faculty.name}
                    width={176}
                    height={176}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-36 h-36 md:w-44 md:h-44 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg">
                  <span className="text-5xl md:text-6xl font-bold text-primary-foreground">
                    {faculty.name.charAt(0)}
                  </span>
                </div>
              )}
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-green-500 text-white text-[10px] font-medium px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                Available
              </div>
            </div>
          </div>
        </div>

        <div className={`md:col-span-3 p-6 md:p-8 ${isReversed ? "md:col-start-1 md:row-start-1" : ""}`}>
          {faculty.domain && (
            <span className="inline-block text-primary text-xs font-semibold tracking-wider uppercase mb-2">
              {faculty.domain}
            </span>
          )}

          <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-1">{faculty.name}</h3>
          {faculty.designation && (
            <p className="text-muted-foreground mb-3">{faculty.designation}</p>
          )}

          {faculty.bio && (
            <p className="text-muted-foreground text-sm mb-6 leading-relaxed line-clamp-3">
              {faculty.bio}
            </p>
          )}

          <div className="grid grid-cols-4 gap-2 mb-6">
            {[
              { icon: Briefcase, value: faculty.experience || "—", label: "Years" },
              { icon: Code, value: faculty.ProjectsHandled || "—", label: "Projects" },
              { icon: GraduationCap, value: faculty.studentsMentored || "—", label: "Students" },
              { icon: Star, value: faculty.ratings?.toFixed(1) || "—", label: "Rating", filled: true },
            ].map((stat, idx) => (
              <div key={idx} className="text-center p-2.5 bg-muted/70 rounded-md">
                <stat.icon className={`w-4 h-4 mx-auto mb-1 text-primary ${stat.filled ? "fill-primary" : ""}`} />
                <div className="text-foreground font-semibold text-sm">{stat.value}</div>
                <div className="text-muted-foreground text-[10px] uppercase">{stat.label}</div>
              </div>
            ))}
          </div>

          {skills.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-6">
              {skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="bg-secondary/10 text-secondary text-xs font-bold px-3 py-1.5 rounded-md"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-border">
            {faculty.locations && (
              <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                <MapPin className="w-3.5 h-3.5 text-primary" />
                {faculty.locations}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
