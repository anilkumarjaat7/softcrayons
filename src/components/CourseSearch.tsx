"use client";

import { useState, useEffect, useRef } from "react";
import { BookOpen, Search, X, Loader2, ChevronDown } from "lucide-react";

type Course = {
  id: number;
  title: string;
  slug: string;
  thumbnailImage: string | null;
  duration: string | null;
  category: {
    id: number;
    title: string;
    slug: string;
  } | null;
};

type CourseSearchProps = {
  value: number | null;
  onChange: (courseId: number | null, courseName: string) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
};

export default function CourseSearch({
  value,
  onChange,
  placeholder = "Search and select a course",
  required = false,
  className = "",
}: CourseSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        
        const response = await fetch(`/api/courses?${params.toString()}`);
        const data = await response.json();
        
        if (data.success) {
          setCourses(data.data);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchCourses, 300);
    return () => clearTimeout(debounceTimer);
  }, [search]);

  useEffect(() => {
    if (value && !selectedCourse) {
      const fetchCourseDetails = async () => {
        try {
          const response = await fetch(`/api/courses`);
          const data = await response.json();
          if (data.success) {
            const course = data.data.find((c: Course) => c.id === value);
            if (course) {
              setSelectedCourse(course);
              onChange(course.id, course.title);
            }
          }
        } catch (error) {
          console.error("Error fetching course details:", error);
        }
      };
      fetchCourseDetails();
    }
  }, [value, selectedCourse]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (course: Course) => {
    setSelectedCourse(course);
    onChange(course.id, course.title);
    setIsOpen(false);
    setSearch("");
  };

  const handleClear = () => {
    setSelectedCourse(null);
    onChange(null, "");
    setSearch("");
  };

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      <div className="relative">
        <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        
        {selectedCourse ? (
          <div
            onClick={() => setIsOpen(!isOpen)}
            className="w-full pl-11 pr-10 py-3 rounded-md bg-card border border-primary/30 ring-1 ring-primary/15 hover:ring-primary/30 cursor-pointer transition-all flex items-center justify-between"
          >
            <span className="truncate">{selectedCourse.title}</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-full"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        ) : (
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              placeholder={placeholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setIsOpen(true)}
              className="w-full pl-11 pr-10 py-3 rounded-md bg-card border border-primary/30 ring-1 ring-primary/15 focus:ring-primary/30 focus:border-primary outline-none transition-all"
              required={required && !selectedCourse}
            />
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
          </div>
        )}
      </div>

      {required && (
        <input
          type="hidden"
          value={value || ""}
          required={required}
        />
      )}

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-card border border-border rounded-md shadow-lg max-h-64 overflow-hidden">
          {selectedCourse && (
            <div className="p-2 border-b border-border">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-md bg-card border border-primary/30 ring-1 ring-primary/15 focus:ring-primary/30 focus:border-primary outline-none transition-all text-sm"
                  autoFocus
                />
              </div>
            </div>
          )}

          <div className="max-h-52 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : courses.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No courses found</p>
              </div>
            ) : (
              <div className="p-2">
                {courses.map((course) => (
                  <button
                    key={course.id}
                    type="button"
                    onClick={() => handleSelect(course)}
                    className={`w-full text-left px-3 py-2.5 rounded-lg hover:bg-muted transition-colors ${
                      selectedCourse?.id === course.id ? "bg-primary/10" : ""
                    }`}
                  >
                    <div className="font-medium text-sm truncate">{course.title}</div>
                    {course.category && (
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {course.category.title}
                        {course.duration && ` • ${course.duration}`}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
