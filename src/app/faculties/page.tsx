"use client";
import React, { useState, useEffect } from "react";
import { Star, Users, Award, Code, GraduationCap, Mail, Heart } from "lucide-react";
import { FeaturedFacultyCard } from "@/components/faculties/FeaturedFacultyCard";
import { FacultyCard } from "@/components/faculties/FacultyCard";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SectionLoader } from "@/components/ui/loader";

export interface Faculty {
	id: number;
	name: string;
	designation: string | null;
	domain: string | null;
	avatar: string | null;
	bio: string | null;
	experience: string | null;
	ProjectsHandled: string | null;
	studentsMentored: string | null;
	ratings: number | null;
	technologies: string[] | null;
	locations: string | null;
	isFeatured: boolean;
}

export default function FacultiesPage() {
	const [faculties, setFaculties] = useState<Faculty[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchFaculties = async () => {
			try {
				const response = await fetch("/api/faculties?limit=50");
				const data = await response.json();
				if (data.success) {
					setFaculties(data.data);
				}
			} catch (error) {
				console.error("Failed to fetch faculties:", error);
			} finally {
				setLoading(false);
			}
		};
		fetchFaculties();
	}, []);

	const featuredFaculties = faculties.filter((f) => f.isFeatured);
	const regularFaculties = faculties.filter((f) => !f.isFeatured);

	if (loading) {
		return (
			<div className="min-h-screen bg-background pt-24 pb-16">
				<div className="container">
					<SectionLoader text="faculties" />
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-background pt-24 pb-16 brand-section">
			<div className="container">
				<div className="mb-12 max-w-3xl brand-panel rounded-md p-6 md:p-8">
					<span className="brand-eyebrow mb-4">
						Our Expert Team
					</span>
					<h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4">
						Learn from{" "}
						<span className="text-gradient">Industry Experts</span>
					</h1>
					<p className="text-muted-foreground text-lg">
						Our faculty members bring years of real-world experience to help you
						master the skills that matter. Get mentored by the best in the
						industry.
					</p>
				</div>

				<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
					{[
						{
							icon: Award,
							value: `${faculties.length}+`,
							label: "Expert Mentors",
						},
						{
							icon: Code,
							value: `${faculties.reduce((sum, f) => sum + (parseInt(f.experience || "0") || 0), 0)}+`,
							label: "Years Combined Experience",
						},
						{
							icon: GraduationCap,
							value: `${faculties.reduce((sum, f) => sum + (parseInt(f.studentsMentored || "0") || 0), 0).toLocaleString("en-IN")}+`,
							label: "Students Mentored",
						},
						{
							icon: Star,
							value:
								faculties.filter((f) => f.ratings).length > 0
									? (
											faculties.reduce((sum, f) => sum + (f.ratings || 0), 0) /
											faculties.filter((f) => f.ratings).length
										).toFixed(1)
									: "0",
							label: "Average Rating",
						},
					].map((stat, index) => (
						<div
							key={index}
							className="brand-panel brand-card-hover rounded-md p-5 text-center"
						>
							<stat.icon className="w-6 h-6 text-primary mx-auto mb-2" />
							<div className="text-2xl font-bold text-foreground">
								{stat.value}
							</div>
							<div className="text-muted-foreground text-xs uppercase tracking-wide">
								{stat.label}
							</div>
						</div>
					))}
				</div>

				{featuredFaculties.length > 0 && (
					<section className="mb-16">
						<div className="flex items-center gap-3 mb-8">
							<div className="flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-md px-4 py-1.5">
								<Star className="w-4 h-4 text-primary fill-primary" />
								<span className="text-foreground text-sm font-medium">
									Featured Faculty
								</span>
							</div>
							<div className="flex-1 h-px bg-border" />
						</div>

						<div className="space-y-6">
							{featuredFaculties.map((faculty, index) => (
								<FeaturedFacultyCard
									key={faculty.id}
									faculty={faculty}
									index={index}
								/>
							))}
						</div>
					</section>
				)}

				{regularFaculties.length > 0 && (
					<section className="mb-16">
						<div className="flex items-center gap-3 mb-8">
							<div className="flex items-center gap-2 bg-muted border border-border rounded-md px-4 py-1.5">
								<Users className="w-4 h-4 text-primary" />
								<span className="text-foreground text-sm font-medium">
									All Faculty Members
								</span>
							</div>
							<div className="flex-1 h-px bg-border" />
						</div>

						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
							{regularFaculties.map((faculty) => (
								<FacultyCard key={faculty.id} faculty={faculty} />
							))}
						</div>
					</section>
				)}

				{faculties.length === 0 && !loading && (
					<div className="text-center py-16">
						<Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
						<h3 className="text-lg font-semibold mb-2">
							No Faculty Members Yet
						</h3>
						<p className="text-muted-foreground">
							Check back soon for our expert team.
						</p>
					</div>
				)}

				<section className="brand-panel rounded-md p-8 md:p-12 text-center">
					<div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-md px-4 py-1.5 mb-4">
						<Heart className="w-4 h-4 text-primary" />
						<span className="text-primary text-sm font-medium">
							Join Our Team
						</span>
					</div>

					<h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
						Want to Become a Mentor?
					</h2>

					<p className="text-muted-foreground max-w-xl mx-auto mb-6">
						Are you passionate about teaching and have expertise in technology?
						We&apos;re always looking for talented instructors to join our team.
					</p>

					<div className="flex flex-wrap justify-center gap-3">
						<Link href="/instructor">
							<Button className="w-full sm:w-auto group">
								<Mail className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
								Apply to be an Instructor
							</Button>
						</Link>
					</div>
				</section>
			</div>
		</div>
	);
}
