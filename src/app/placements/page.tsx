"use client";
import React, { useState, useEffect } from "react";
import { Trophy, Users, Briefcase, Building2, TrendingUp } from "lucide-react";
import { PlacementCard } from "@/components/placements/PlacementCard";
import { CountUpNumber } from "@/components/CountUpNumber";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";

interface Placement {
	id: number;
	studentName: string;
	avatar: string | null;
	courseName: string;
	dialogue: string | null;
	packageOffered: string | null;
	companyName: string | null;
	position: string | null;
	isFeatured: boolean;
	createdAt: string;
}

interface PlacementsResponse {
	success: boolean;
	data: Placement[];
	stats: {
		totalPlacements: number;
		uniqueCompanies: number;
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

export default function PlacementsPage() {
	const [placements, setPlacements] = useState<Placement[]>([]);
	const [loading, setLoading] = useState(true);
	const [loadingMore, setLoadingMore] = useState(false);
	const [stats, setStats] = useState({ totalPlacements: 0, uniqueCompanies: 0 });
	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);

	const fetchPlacements = async (pageNum: number, append: boolean = false) => {
		try {
			if (append) setLoadingMore(true);
			else setLoading(true);

			const response = await fetch(`/api/placements?page=${pageNum}&limit=12`);
			const data: PlacementsResponse = await response.json();

			if (data.success) {
				if (append) {
					setPlacements((prev) => [...prev, ...data.data]);
				} else {
					setPlacements(data.data);
				}
				setStats(data.stats);
				setHasMore(data.pagination.hasNextPage);
			}
		} catch (error) {
			console.error("Failed to fetch placements:", error);
		} finally {
			setLoading(false);
			setLoadingMore(false);
		}
	};

	useEffect(() => {
		fetchPlacements(1);
	}, []);

	const loadMore = () => {
		const nextPage = page + 1;
		setPage(nextPage);
		fetchPlacements(nextPage, true);
	};

	const featuredPlacements = placements.filter((p) => p.isFeatured);
	const normalPlacements = placements.filter((p) => !p.isFeatured);

	if (loading) {
		return (
			<div className="min-h-screen bg-background pt-24 pb-16">
				<div className="container">
					<Loader text="placements" size="lg" />
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-background pt-24 pb-16 brand-section">
			<div className="container">
				<div className="max-w-3xl mb-12 brand-panel rounded-md p-6 md:p-8">
					<span className="brand-eyebrow mb-4">
						Success Stories
					</span>
					<h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-6">
						Our Students{" "}
						<span className="text-gradient">Placement Records</span>
					</h1>
					<p className="text-muted-foreground text-lg leading-relaxed">
						We don&apos;t just teach; we build careers. Join thousands of students who
						have secured their dream jobs at top-tier product and service-based
						companies.
					</p>
				</div>

				<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
					{[
						{ icon: Users, value: `500+`, label: "Total Placed" },
						{ icon: Building2, value: `20+`, label: "Hiring Partners" },
						{ icon: TrendingUp, value: "94%", label: "Placement Rate" },
						{ icon: Trophy, value: "50 LPA", label: "Highest Package" },
					].map((stat, idx) => (
						<div
							key={idx}
							className="brand-panel brand-card-hover rounded-md p-5 text-center"
						>
							<stat.icon className="w-6 h-6 text-primary mx-auto mb-3" />
						<CountUpNumber value={stat.value} className="text-2xl font-bold text-foreground mb-1" />
							<div className="text-xs text-muted-foreground uppercase tracking-widest font-medium">
								{stat.label}
							</div>
						</div>
					))}
				</div>

				{featuredPlacements.length > 0 && (
				<section className="mb-20">
					<div className="flex items-center justify-between mb-8">
						<h2 className="text-2xl font-bold flex items-center gap-2">
							Top Achievers
						</h2>
						<div className="h-px bg-border flex-1 ml-6 hidden sm:block" />
					</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
					{featuredPlacements.map((student) => (
						<PlacementCard
								key={student.id}
								name={student.studentName}
								course={student.courseName}
								position={student.position || ""}
								company={student.companyName || ""}
								image={student.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(student.studentName)}&background=random&size=500`}
								packageVal={student.packageOffered || ""}
								quote={student.dialogue || ""}
							/>
						))}
					</div>
				</section>
				)}

				{normalPlacements.length > 0 && (
				<section>
					<div className="flex items-center justify-between mb-8">
						<h2 className="text-2xl font-bold flex items-center gap-2">
							<Briefcase className="w-5 h-5 text-primary" />
							Recent Placements
						</h2>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
						{normalPlacements.map((student) => (
							<PlacementCard
								key={student.id}
								name={student.studentName}
								course={student.courseName}
								position={student.position || ""}
								company={student.companyName || ""}
								image={student.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(student.studentName)}&background=random&size=400`}
								packageVal={student.packageOffered || ""}
								quote={student.dialogue || ""}
							/>
						))}
					</div>

					{hasMore && (
					<div className="mt-12 text-center">
						<Button
							variant="outline"
							size="lg"
							onClick={loadMore}
							disabled={loadingMore}
						>
							{loadingMore ? "Loading..." : "Load More Success Stories"}
						</Button>
					</div>
					)}
				</section>
				)}

				{placements.length === 0 && (
					<div className="text-center py-16">
						<p className="text-muted-foreground text-lg">No placements data available yet.</p>
					</div>
				)}
			</div>
		</div>
	);
}
