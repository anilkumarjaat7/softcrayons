"use client";

import { TestimonialCard } from "@/components/testimonial-card";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { Loader } from "@/components/ui/loader";

interface Testimonial {
	id: number;
	studentName: string;
	avatar: string | null;
	rating: number;
	feedback: string;
	isFeatured: boolean;
	createdAt: string;
}

interface ReviewsResponse {
	success: boolean;
	data: Testimonial[];
	stats: {
		averageRating: string;
		totalReviews: number;
	};
	pagination: {
		page: number;
		limit: number;
		totalCount: number;
		totalPages: number;
		hasNextPage: boolean;
		hasPrevPage: boolean;
	};
}

export default function ReviewsPage() {
	const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
	const [loading, setLoading] = useState(true);
	const [loadingMore, setLoadingMore] = useState(false);
	const [stats, setStats] = useState({ averageRating: "0", totalReviews: 0 });
	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);

	const fetchReviews = async (pageNum: number, append: boolean = false) => {
		try {
			if (append) setLoadingMore(true);
			else setLoading(true);

			const response = await fetch(`/api/reviews?page=${pageNum}&limit=9`);
			const data: ReviewsResponse = await response.json();

			if (data.success) {
				if (append) {
					setTestimonials((prev) => [...prev, ...data.data]);
				} else {
					setTestimonials(data.data);
				}
				setStats(data.stats);
				setHasMore(data.pagination.hasNextPage);
			}
		} catch (error) {
			console.error("Failed to fetch reviews:", error);
		} finally {
			setLoading(false);
			setLoadingMore(false);
		}
	};

	useEffect(() => {
		fetchReviews(1);
	}, []);

	const loadMore = () => {
		const nextPage = page + 1;
		setPage(nextPage);
		fetchReviews(nextPage, true);
	};

	if (loading) {
		return (
			<main className="min-h-screen bg-background pt-32 pb-20 px-4 sm:px-6 lg:px-8">
				<div className="max-w-7xl mx-auto">
					<Loader text="reviews" size="lg" />
				</div>
			</main>
		);
	}

	return (
		<main className="min-h-screen bg-background brand-section pt-32 pb-20 px-4 sm:px-6 lg:px-8">
			<div className="max-w-7xl mx-auto">
				<div className="text-center mb-16 brand-panel rounded-md p-6 md:p-10">
					<span className="brand-eyebrow mb-4">Reviews</span>
					<h1 className="text-4xl sm:text-6xl font-black text-foreground mb-4">
						Student{" "}
						<span className="text-gradient">success voices</span>
					</h1>
					<p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-6">
						Hear from our community of learners who have transformed their
						careers with SoftCrayons
					</p>

					<div className="flex items-center justify-center gap-8 mt-8">
						<div className="text-center">
							<div className="flex items-center justify-center gap-1 mb-1">
								<Star className="w-5 h-5 fill-primary text-primary" />
								<span className="text-2xl font-bold">{stats.averageRating}</span>
							</div>
							<p className="text-sm text-muted-foreground">Average Rating</p>
						</div>
						<div className="h-10 w-px bg-border" />
						<div className="text-center">
							<span className="text-2xl font-bold">{stats.totalReviews}</span>
							<p className="text-sm text-muted-foreground">Total Reviews</p>
						</div>
					</div>
				</div>

				{testimonials.length === 0 ? (
					<div className="text-center py-16">
						<p className="text-muted-foreground text-lg">No reviews yet.</p>
					</div>
				) : (
					<>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{testimonials.map((testimonial) => (
								<TestimonialCard
									key={testimonial.id}
									name={testimonial.studentName}
									description="SoftCrayons Alumni"
									testimonial={testimonial.feedback}
									profileImage={
										testimonial.avatar ||
										`https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.studentName)}&background=random`
									}
									rating={testimonial.rating}
								/>
							))}
						</div>

						{hasMore && (
							<div className="text-center mt-12">
								<Button
									variant="outline"
									size="lg"
									onClick={loadMore}
									disabled={loadingMore}
								>
									{loadingMore ? "Loading..." : "Load More Reviews"}
								</Button>
							</div>
						)}
					</>
				)}
			</div>
		</main>
	);
}
