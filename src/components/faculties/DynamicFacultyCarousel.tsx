"use client";

import { useState, useEffect } from "react";
import { FacultyCarousel } from "./FacultyCarousel";
import { SectionLoader } from "@/components/ui/loader";

interface ApiFaculty {
  id: number;
  name: string;
  designation: string;
  domain: string | null;
  avatar: string | null;
  experience: string | null;
}

export function DynamicFacultyCarousel() {
  const [faculties, setFaculties] = useState<
    { name: string; role: string; experience: string; image: string }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFaculties = async () => {
      try {
        const response = await fetch("/api/faculties?limit=10");
        const data = await response.json();
        if (data.success && data.data.length > 0) {
          setFaculties(
            data.data.map((f: ApiFaculty) => ({
              name: f.name,
              role: f.designation,
              experience: f.experience ? `${f.experience} Exp` : "Expert",
              image:
                f.avatar ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(f.name)}&background=random&size=300`,
            }))
          );
        }
      } catch (error) {
        console.error("Failed to fetch faculties:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFaculties();
  }, []);

  if (loading) {
    return <SectionLoader text="faculties" />;
  }

  if (faculties.length === 0) {
    return (
      <p className="text-center text-muted-foreground">
        No faculties available at the moment.
      </p>
    );
  }

  return <FacultyCarousel faculties={faculties} />;
}
