"use client";

import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FacultyCard } from "./FacultyCardMini";
import Link from "next/link";

interface Faculty {
  name: string;
  role: string;
  experience: string;
  image: string;
}

interface FacultyCarouselProps {
  faculties: Faculty[];
}

export function FacultyCarousel({ faculties }: FacultyCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [totalDots, setTotalDots] = useState(0);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);

      const cardWidth = 280 + 24;
      const visibleCards = Math.floor(clientWidth / cardWidth);
      const totalScrollableCards = faculties.length - visibleCards;
      const currentIndex = Math.round(scrollLeft / cardWidth);
      setActiveIndex(Math.min(currentIndex, totalScrollableCards));
      setTotalDots(Math.max(totalScrollableCards + 1, 1));
    }
  };

  useEffect(() => {
    checkScroll();
    const ref = scrollRef.current;
    if (ref) {
      ref.addEventListener("scroll", checkScroll);
      window.addEventListener("resize", checkScroll);
      return () => {
        ref.removeEventListener("scroll", checkScroll);
        window.removeEventListener("resize", checkScroll);
      };
    }
  }, [faculties.length]);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 304;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const scrollToIndex = (index: number) => {
    if (scrollRef.current) {
      const scrollAmount = index * 304;
      scrollRef.current.scrollTo({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4 px-1"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {faculties.map((faculty, index) => (
          <div key={index} className="flex-shrink-0 w-[280px]">
            <FacultyCard {...faculty} />
          </div>
        ))}
      </div>

      <div className="flex flex-col items-center gap-6 mt-8">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            className={`rounded-full transition-all duration-300 ${
              canScrollLeft
                ? "hover:bg-primary hover:text-white hover:border-primary"
                : "opacity-50 cursor-not-allowed"
            }`}
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>

          <div className="flex items-center gap-2">
            {Array.from({ length: totalDots }).map((_, index) => (
              <button
                key={index}
                onClick={() => scrollToIndex(index)}
                className={`rounded-full transition-all duration-300 ${
                  index === activeIndex
                    ? "w-8 h-2 bg-primary"
                    : "w-2 h-2 bg-muted-foreground/30 hover:bg-primary/50"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          <Button
            variant="outline"
            size="icon"
            className={`rounded-full transition-all duration-300 ${
              canScrollRight
                ? "hover:bg-primary hover:text-white hover:border-primary"
                : "opacity-50 cursor-not-allowed"
            }`}
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>

        <Link href="/faculties">
          <Button
            variant="outline"
            className="hover:bg-primary hover:text-white hover:border-primary transition-all duration-300"
          >
            View All Faculties
          </Button>
        </Link>
      </div>
    </div>
  );
}