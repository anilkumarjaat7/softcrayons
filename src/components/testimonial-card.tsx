import Image from "next/image";
import { Star } from "lucide-react";

interface TestimonialCardProps {
  name: string;
  description: string;
  testimonial: string;
  profileImage: string;
  className?: string;
  rating?: number;
}

export function TestimonialCard({
  name,
  description,
  testimonial,
  profileImage,
  className = "",
  rating = 5,
}: TestimonialCardProps) {
  return (
    <div
      className={`brand-panel brand-card-hover rounded-md p-6 flex flex-col justify-between ${className}`}
    >
      <div className="flex gap-1 mb-4">
        {[...Array(rating)].map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-primary text-primary" />
        ))}
      </div>
      <div className="mb-6">
        <p className="text-muted-foreground text-sm leading-relaxed">
          &quot;{testimonial}&quot;
        </p>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
          <Image
            src={profileImage}
            alt={name}
            fill
            className="object-cover"
            unoptimized
          />
        </div>
        <div>
          <h4 className="text-foreground font-bold text-sm">
            {name}
          </h4>
          <p className="text-muted-foreground text-xs">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
