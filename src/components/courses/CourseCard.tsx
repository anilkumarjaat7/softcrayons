import { Clock, BarChart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Course {
    id: number;
    title: string;
    description: string;
    category: string;
    categoryName: string;
    duration: string;
    level: "Beginner" | "Intermediate" | "Advanced";
    tags: string[];
    image: string;
    slug?: string;
}

interface CourseCardProps {
    course: Course;
}

const levelColors = {
    Beginner: "bg-green-500/20 text-green-600 dark:text-green-400 border border-green-500/30",
    Intermediate: "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border border-yellow-500/30",
    Advanced: "bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/30",
};

export function CourseCard({ course }: CourseCardProps) {
    return (
        <div className="group brand-panel brand-card-hover rounded-md overflow-hidden flex flex-col h-full">
            <div className="relative aspect-[4/3] overflow-hidden flex-shrink-0">
                <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover"
                />
            </div>

            <div className="p-5 flex flex-col flex-grow">
                <span className="inline-block px-3 py-1 text-xs font-bold bg-secondary/10 text-secondary rounded-md mb-3 w-fit">
                    {course.categoryName}
                </span>

                <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {course.title}
                </h3>

                <p className="text-muted-foreground text-sm mb-4 line-clamp-2 flex-grow">
                    {course.description}
                </p>

                <div className="flex items-center justify-between text-sm mb-4">
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        {course.duration}
                    </span>
                    <span className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full ${levelColors[course.level]}`}>
                        <BarChart className="w-3 h-3" />
                        {course.level}
                    </span>
                </div>

                {course.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-5">
                    {course.tags.slice(0, 2).map((tag) => (
                        <span
                            key={tag}
                            className="px-2 py-1 rounded-md bg-muted text-xs font-mono font-medium"
                        >
                            {tag}
                        </span>
                    ))}
                    {course.tags.length > 2 && (
                        <span className="px-2 py-1 rounded-md bg-muted text-xs font-mono font-medium">
                            +{course.tags.length - 2}
                        </span>
                    )}
                </div>
                )}

                <Link href={`/courses/${course.slug || course.id}`}>
                    <Button className="w-full group/btn">
                        View Details
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                </Link>
            </div>
        </div>
    );
}
