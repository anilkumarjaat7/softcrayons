import { Card, CardContent } from "@/components/ui/card";
import { Award } from "lucide-react";
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

interface FacultyCardProps {
  faculty: FacultyData;
}

export function FacultyCard({ faculty }: FacultyCardProps) {
  const skills = Array.isArray(faculty.technologies) ? faculty.technologies : [];

  return (
    <Card className="group brand-card-hover h-full">
      <CardContent className="p-6 flex flex-col items-center">
        <div className="mb-4">
          <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-border group-hover:border-primary/30 transition-colors duration-300">
            {faculty.avatar ? (
              <Image
                src={faculty.avatar}
                alt={faculty.name}
                fill
                className="object-cover object-top"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                <span className="text-3xl font-bold text-primary-foreground">
                  {faculty.name.charAt(0)}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="text-center w-full">
          <h3 className="text-xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors duration-300">
            {faculty.name}
          </h3>
          {faculty.designation && (
            <p className="text-muted-foreground font-medium mb-4">{faculty.designation}</p>
          )}
          
          {skills.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mb-5">
              {skills.slice(0, 3).map((skill, index) => (
                <span 
                  key={index} 
              className="px-2.5 py-1 rounded-md bg-secondary/10 text-secondary text-xs font-bold border border-secondary/15"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}

          {faculty.experience && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-primary/10 text-primary text-sm font-bold border border-primary/10">
              <Award className="w-4 h-4" />
              {faculty.experience} Exp.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
