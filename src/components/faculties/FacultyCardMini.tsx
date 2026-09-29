import { Card, CardContent } from "@/components/ui/card";
import { Award } from "lucide-react";
import Image from "next/image";

interface FacultyCardProps {
  name: string;
  role: string;
  experience: string;
  image: string;
}

export function FacultyCard({ name, role, experience, image }: FacultyCardProps) {
  return (
    <Card className="group hover:shadow-[0_8px_30px_rgba(249,115,22,0.15)] transition-all duration-300 border border-border bg-card h-full">
      <CardContent className="p-6">
        <div className="flex justify-center mb-4">
          <div className="relative w-32 h-32 rounded-full overflow-hidden ring-4 ring-primary/10 group-hover:ring-primary/30 transition-all duration-300">
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover object-top"
            />
          </div>
        </div>

        <div className="text-center">
          <h3 className="text-xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors duration-300">
            {name}
          </h3>
          <p className="text-muted-foreground font-medium mb-3">{role}</p>
          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold">
            <Award className="w-3 h-3" />
            {experience}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}