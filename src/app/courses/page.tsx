"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CourseSidebar } from "@/components/courses/CourseSidebar";
import { CourseCard } from "@/components/courses/CourseCard";
import { Search, X, Loader2 } from "lucide-react";
import Link from "next/link";
import { Loader } from "@/components/ui/loader";

interface Category {
	id: number;
	title: string;
	slug: string;
	description: string | null;
	_count: {
		courses: number;
	};
}

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

interface SearchResult {
	id: number;
	title: string;
	slug: string;
	description: string | null;
	thumbnailImage: string | null;
	bannerImage: string | null;
	duration: string | null;
	difficulty: string;
	category: {
		title: string;
		slug: string;
	};
	type: string;
}

interface CoursesResponse {
	success: boolean;
	data: Course[];
	pagination: {
		page: number;
		limit: number;
		totalCount: number;
		totalPages: number;
		hasNextPage: boolean;
		hasPrevPage: boolean;
	};
}

export default function CoursesPage() {
	const [selectedCategory, setSelectedCategory] = useState("all");
	const [categories, setCategories] = useState<{ id: string; name: string; count: number }[]>([
		{ id: "all", name: "All Courses", count: 0 },
	]);
	const [courses, setCourses] = useState<Course[]>([]);
	const [loading, setLoading] = useState(true);
	const [loadingMore, setLoadingMore] = useState(false);
	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);
	const [totalCount, setTotalCount] = useState(0);
	
	const [searchQuery, setSearchQuery] = useState("");
	const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
	const [isSearching, setIsSearching] = useState(false);
	const [showSearchResults, setShowSearchResults] = useState(false);

	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const response = await fetch("/api/course-categories");
				const data = await response.json();
				if (data.success) {
					const cats = data.data.map((cat: Category) => ({
						id: cat.slug,
						name: cat.title,
						count: cat._count.courses,
					}));
					const totalCount = cats.reduce((sum: number, cat: { count: number }) => sum + cat.count, 0);
					setCategories([{ id: "all", name: "All Courses", count: totalCount }, ...cats]);
				}
			} catch (error) {
				console.error("Failed to fetch categories:", error);
			}
		};
		fetchCategories();
	}, []);

	const performSearch = useCallback(async (query: string) => {
		if (query.trim().length < 2) {
			setSearchResults([]);
			setShowSearchResults(false);
			return;
		}

		setIsSearching(true);
		try {
			const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&type=courses&limit=10`);
			const data = await response.json();
			if (data.success) {
				setSearchResults(data.data.courses);
				setShowSearchResults(true);
			}
		} catch (error) {
			console.error("Search failed:", error);
		} finally {
			setIsSearching(false);
		}
	}, []);

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			if (searchQuery) {
				performSearch(searchQuery);
			} else {
				setSearchResults([]);
				setShowSearchResults(false);
			}
		}, 300);
		return () => clearTimeout(timeoutId);
	}, [searchQuery, performSearch]);

	const fetchCourses = async (pageNum: number, categorySlug: string, append: boolean = false) => {
		try {
			if (append) setLoadingMore(true);
			else setLoading(true);

			const params = new URLSearchParams({
				page: pageNum.toString(),
				limit: "12",
			});
			if (categorySlug !== "all") {
				params.append("categorySlug", categorySlug);
			}

			const response = await fetch(`/api/courses?${params}`);
			const data: CoursesResponse = await response.json();

			if (data.success) {
				if (append) {
					setCourses((prev) => [...prev, ...data.data]);
				} else {
					setCourses(data.data);
				}
				setHasMore(data.pagination.hasNextPage);
				setTotalCount(data.pagination.totalCount);
			}
		} catch (error) {
			console.error("Failed to fetch courses:", error);
		} finally {
			setLoading(false);
			setLoadingMore(false);
		}
	};

	useEffect(() => {
		setPage(1);
		fetchCourses(1, selectedCategory);
	}, [selectedCategory]);

	const loadMore = () => {
		const nextPage = page + 1;
		setPage(nextPage);
		fetchCourses(nextPage, selectedCategory, true);
	};

	const clearSearch = () => {
		setSearchQuery("");
		setSearchResults([]);
		setShowSearchResults(false);
	};

	const formatDifficulty = (difficulty: string): "Beginner" | "Intermediate" | "Advanced" => {
		const formatted = difficulty.charAt(0) + difficulty.slice(1).toLowerCase();
		return formatted as "Beginner" | "Intermediate" | "Advanced";
	};

	const coursesWithCategoryName = courses.map((course) => ({
		id: course.id,
		title: course.title,
		description: course.description || "",
		category: course.category.slug,
		categoryName: course.category.title,
		duration: course.duration || "Self-paced",
		level: formatDifficulty(course.difficulty),
		tags: [],
		image: course.thumbnailImage || course.bannerImage || "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&auto=format&fit=crop&q=80",
		slug: course.slug,
	}));

	if (loading) {
		return (
			<div className="min-h-screen bg-background pt-24 pb-16">
				<div className="container">
					<Loader text="courses" size="lg" />
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-background pt-24 pb-16 brand-section">
			<div className="container">
				<div className="mb-10 brand-panel rounded-md p-6 md:p-8">
					<div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
						<div>
							<h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4">
								Find Your{" "}
								<span className="text-gradient">Perfect Course</span>
							</h1>
							<p className="text-muted-foreground text-lg max-w-2xl">
								Feeling uncertain about which course is right for you? Don’t worry, you don’t have to figure it out alone. Simply explore your interests, and our expert advisors will connect with you to understand your goals, strengths, and ambitions.
							</p>
						</div>

						<div className="relative w-full lg:w-96">
							<Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
							<Input
								type="text"
								placeholder="Search courses..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="pl-12 pr-10 py-6 rounded-md bg-card border-border focus:border-primary"
							/>
							{searchQuery && (
								<button
									onClick={clearSearch}
									className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
								>
									<X className="w-5 h-5" />
								</button>
							)}
							{isSearching && (
								<div className="absolute right-12 top-1/2 -translate-y-1/2">
									<Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
								</div>
							)}

							{showSearchResults && searchResults.length > 0 && (
								<div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-md shadow-lg z-50 max-h-96 overflow-y-auto">
									<div className="p-2">
										<p className="text-xs text-muted-foreground px-3 py-2">
											Found {searchResults.length} course{searchResults.length !== 1 ? 's' : ''}
										</p>
										{searchResults.map((result) => (
											<Link
												key={result.id}
												href={`/courses/${result.slug}`}
												onClick={clearSearch}
												className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
											>
												<div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
														{(result.thumbnailImage || result.bannerImage) && (
															<img
																src={result.thumbnailImage || result.bannerImage!}
															alt={result.title}
															className="w-full h-full object-cover"
														/>
													)}
												</div>
												<div className="flex-1 min-w-0">
													<p className="font-medium text-sm truncate">{result.title}</p>
													<p className="text-xs text-muted-foreground">
														{result.category.title} • {result.duration || 'Self-paced'}
													</p>
												</div>
											</Link>
										))}
									</div>
								</div>
							)}

							{showSearchResults && searchResults.length === 0 && searchQuery.length >= 2 && !isSearching && (
								<div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-md shadow-lg z-50 p-6 text-center">
									<p className="text-muted-foreground">No courses found for &quot;{searchQuery}&quot;</p>
								</div>
							)}
						</div>
					</div>
				</div>

				<div className="flex flex-col lg:flex-row gap-8">
					<CourseSidebar
						categories={categories}
						selectedCategory={selectedCategory}
						onCategoryChange={setSelectedCategory}
					/>

					<main className="flex-1">
						<div className="flex items-center justify-between mb-6">
							<p className="text-muted-foreground">
								Showing{" "}
								<span className="font-semibold text-foreground">
									{totalCount}
								</span>{" "}
								course
								{totalCount !== 1 ? "s" : ""}
							</p>
						</div>

						<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
							{coursesWithCategoryName.map((course) => (
								<CourseCard key={course.id} course={course} />
							))}
						</div>

						{courses.length === 0 && (
							<div className="text-center py-16 brand-panel rounded-md">
								<p className="text-muted-foreground text-lg">
									No courses found in this category.
								</p>
								<Button
									variant="outline"
									className="mt-4"
									onClick={() => setSelectedCategory("all")}
								>
									View All Courses
								</Button>
							</div>
						)}

						{hasMore && courses.length > 0 && (
							<div className="text-center mt-8">
								<Button
									variant="outline"
									size="lg"
									onClick={loadMore}
									disabled={loadingMore}
								>
									{loadingMore ? "Loading..." : "Load More Courses"}
								</Button>
							</div>
						)}
					</main>
				</div>
			</div>
		</div>
	);
}
