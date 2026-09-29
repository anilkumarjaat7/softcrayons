"use client";
import { ArrowRight, ArrowLeft, Clock, BarChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { SectionLoader } from '@/components/ui/loader';
import { SectionHeader } from '@/components/public-ui';

interface Course {
    id: number;
    title: string;
    slug: string;
    description: string | null;
    thumbnailImage: string | null;
    bannerImage: string | null;
    duration: string | null;
    difficulty: string;
    fees: number | null;
    discount: number | null;
    isFeatured: boolean;
    category: {
        id: number;
        title: string;
        slug: string;
    };
}

export function CoursesSection() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(false);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await fetch('/api/courses?limit=12&featured=true');
                const data = await response.json();
                if (data.success) {
                    setCourses(data.data);
                }
            } catch (error) {
                console.error('Failed to fetch courses:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    const totalSlides = Math.ceil(courses.length / 3) || 1;

    const nextSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % totalSlides);
    }, [totalSlides]);

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
    };

    const getLevelColor = (level: string) => {
        switch (level) {
            case 'BEGINNER':
                return 'bg-green-500/15 text-green-600 dark:text-green-400';
            case 'INTERMEDIATE':
                return 'bg-yellow-500/15 text-yellow-600 dark:text-yellow-400';
            case 'ADVANCED':
                return 'bg-red-500/15 text-red-600 dark:text-red-400';
            default:
                return 'bg-primary/15 text-primary';
        }
    };

    const formatDifficulty = (difficulty: string) => {
        return difficulty.charAt(0) + difficulty.slice(1).toLowerCase();
    };

    useEffect(() => {
        if (!isAutoPlaying || totalSlides <= 1) return;

        const interval = setInterval(() => {
            nextSlide();
        }, 4000);

        return () => clearInterval(interval);
    }, [isAutoPlaying, nextSlide, totalSlides]);

    if (loading) {
        return (
            <section id="courses" className="py-24">
                <div className="container">
                    <SectionLoader text="courses" />
                </div>
            </section>
        );
    }

    if (courses.length === 0) {
        return null;
    }

    return (
        <section id="courses" className="py-24 brand-section">
            <div className="container">
                <SectionHeader
                    eyebrow="Top programs"
                    title={<>Industry-ready <span className="text-gradient">curriculum</span></>}
                    description={
                        <>
                        Hands-on courses designed by industry experts to get you job-ready in
                        weeks, not years.
                        </>
                    }
                />

                {courses.length > 0 && (
                <div
                    className="relative"
                    onMouseEnter={() => setIsAutoPlaying(false)}
                    onMouseLeave={() => setIsAutoPlaying(true)}
                >
                    <div className="overflow-hidden px-2 sm:px-3 lg:px-4 py-3">
                        <div
                            className="flex transition-transform duration-500 ease-in-out"
                            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                        >
                            {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                                <div
                                    key={slideIndex}
                                    className="w-full flex-shrink-0 grid sm:grid-cols-2 lg:grid-cols-3 gap-6 px-1 sm:px-2"
                                >
                                    {courses
                                        .slice(slideIndex * 3, slideIndex * 3 + 3)
                                        .map((course) => (
                                            <div
                                                key={course.id}
                                                className="brand-panel brand-card-hover overflow-hidden rounded-md flex flex-col h-full"
                                            >
                                                <div className="relative aspect-[4/3] overflow-hidden flex-shrink-0">
                                                    <img
                                                        src={course.thumbnailImage || course.bannerImage || 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&auto=format&fit=crop&q=80'}
                                                        alt={course.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>

                                                <div className="p-6 flex flex-col flex-grow">
                                                    <div className="flex items-center justify-between text-sm mb-3">
                                                        <span className="flex items-center gap-1.5 text-muted-foreground">
                                                            <Clock className="w-4 h-4" />
                                                            {course.duration || 'Self-paced'}
                                                        </span>
                                                        <span className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full ${getLevelColor(course.difficulty)}`}>
                                                            <BarChart className="w-3 h-3" />
                                                            {formatDifficulty(course.difficulty)}
                                                        </span>
                                                    </div>

                                                    <h3 className="text-xl font-bold mb-3 line-clamp-2">
                                                        {course.title}
                                                    </h3>

                                                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2 flex-grow">
                                                        {course.description}
                                                    </p>

                                                    <Link href={`/courses/${course.slug}`}>
                                                        <Button className="w-full group/btn">
                                                        View Course
                                                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                                    </Button>
                                                    </Link>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            ))}
                        </div>
                    </div>

                    {totalSlides > 1 && (
                    <div className="flex items-center justify-center gap-4 mt-10">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={prevSlide}
                            className="rounded-md"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Button>

                        <div className="flex items-center gap-2">
                            {Array.from({ length: totalSlides }).map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentIndex(index)}
                                    className={`h-2 rounded-full transition-all duration-300 ${
                                        index === currentIndex
                                            ? 'w-8 bg-primary'
                                            : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
                                    }`}
                                />
                            ))}
                        </div>

                        <Button
                            variant="outline"
                            size="icon"
                            onClick={nextSlide}
                            className="rounded-md"
                        >
                            <ArrowRight className="w-5 h-5" />
                        </Button>
                    </div>
                    )}
                </div>
                )}

                <div className="text-center mt-12">
                    <Link href="/courses">
                        <Button variant="outline" size="lg">
                            View All Courses
                            <ArrowRight className="w-4 h-4" />
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
