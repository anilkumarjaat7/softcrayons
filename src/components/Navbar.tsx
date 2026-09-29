"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect, useCallback } from "react";
import { Menu, X, Sun, Moon, ChevronDown, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useSession } from "@/lib/auth-client";

interface SearchResult {
	id: number;
	title: string;
	slug: string;
	description: string | null;
	thumbnailImage: string | null;
	category: { title: string; slug: string };
	type: string;
	bannerImage?: string | null;
	duration?: string | null;
	difficulty?: string;
	author?: { name: string };
	readTime?: number;
}

const navLinks = [
	{ name: "Home", href: "/" },
	{ name: "Courses", href: "/courses" },
	{ name: "Placements", href: "/placements" },
	{ name: "Blogs", href: "/blogs" },
	{ name: "Reviews", href: "/reviews" },
	{ name: "FAQs", href: "/faqs" },
	{ name: "About Us", href: "/about-us" },
	{ name: "Faculties", href: "/faculties" },
	{ name: "Enterprise Hiring", href: "/enterprise" },
	{ name: "Join as an Instructor", href: "/instructor" },

];

export function Navbar() {
	const [isOpen, setIsOpen] = useState(false);
	const [isMoreOpen, setIsMoreOpen] = useState(false);
	const [mounted, setMounted] = useState(false);
	const { theme, setTheme } = useTheme();
	const dropdownRef = useRef<HTMLDivElement>(null);
	const pathname = usePathname();
	const router = useRouter();
	const { data: session } = useSession();

	const [searchOpen, setSearchOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [searchResults, setSearchResults] = useState<{ blogs: SearchResult[]; courses: SearchResult[] }>({ blogs: [], courses: [] });
	const [isSearching, setIsSearching] = useState(false);
	const [showResults, setShowResults] = useState(false);
	const searchRef = useRef<HTMLDivElement>(null);
	const searchInputRef = useRef<HTMLInputElement>(null);
	const mobileSearchInputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		setMounted(true);
	}, []);

	const visibleLinks = navLinks.slice(0, 4);
	const moreLinks = navLinks.slice(4);

	const isActive = (href: string) => {
		if (href === "/") return pathname === "/";
		return pathname.startsWith(href);
	};

	const toggleTheme = () => {
		setTheme(theme === "dark" ? "light" : "dark");
	};

	useEffect(() => {
		setSearchOpen(false);
		setSearchQuery("");
		setShowResults(false);
	}, [pathname]);

	const performSearch = useCallback(async (query: string) => {
		if (query.trim().length < 2) {
			setSearchResults({ blogs: [], courses: [] });
			setShowResults(false);
			return;
		}
		setIsSearching(true);
		try {
			const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&type=all&limit=5`);
			const data = await response.json();
			if (data.success) {
				setSearchResults(data.data);
				setShowResults(true);
			}
		} catch (error) {
			console.error("Search failed:", error);
		} finally {
			setIsSearching(false);
		}
	}, []);

	useEffect(() => {
		const timeout = setTimeout(() => {
			if (searchQuery) performSearch(searchQuery);
			else { setSearchResults({ blogs: [], courses: [] }); setShowResults(false); }
		}, 300);
		return () => clearTimeout(timeout);
	}, [searchQuery, performSearch]);

	const clearSearch = () => {
		setSearchQuery("");
		setSearchResults({ blogs: [], courses: [] });
		setShowResults(false);
	};

	const handleResultClick = (type: string, slug: string) => {
		clearSearch();
		setSearchOpen(false);
		setIsOpen(false);
		router.push(type === "blog" ? `/blogs/${slug}` : `/courses/${slug}`);
	};

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setIsMoreOpen(false);
			}
			if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
				setShowResults(false);
				setSearchOpen(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	useEffect(() => {
		if (searchOpen && searchInputRef.current) {
			searchInputRef.current.focus();
		}
	}, [searchOpen]);

	const searchDropdown = (
		<>
			{showResults && (searchResults.courses.length > 0 || searchResults.blogs.length > 0) && (
				<div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-lg z-50 max-h-80 overflow-y-auto">
					{searchResults.courses.length > 0 && (
						<div className="p-2">
							<p className="text-xs font-semibold text-muted-foreground px-3 py-1.5 uppercase tracking-wider">Courses</p>
							{searchResults.courses.map((result) => (
								<button
									key={`course-${result.id}`}
									onClick={() => handleResultClick("course", result.slug)}
									className="flex items-center gap-3 w-full p-2.5 rounded-lg hover:bg-muted transition-colors text-left"
								>
									<div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
										{(result.thumbnailImage || result.bannerImage) && (
											<img src={result.thumbnailImage || result.bannerImage!} alt={result.title} className="w-full h-full object-cover" />
										)}
									</div>
									<div className="flex-1 min-w-0">
										<p className="font-medium text-sm truncate">{result.title}</p>
										<p className="text-xs text-muted-foreground">{result.category?.title} • {result.duration || "Self-paced"}</p>
									</div>
								</button>
							))}
						</div>
					)}
					{searchResults.blogs.length > 0 && (
						<div className={cn("p-2", searchResults.courses.length > 0 && "border-t border-border")}>
							<p className="text-xs font-semibold text-muted-foreground px-3 py-1.5 uppercase tracking-wider">Blogs</p>
							{searchResults.blogs.map((result) => (
								<button
									key={`blog-${result.id}`}
									onClick={() => handleResultClick("blog", result.slug)}
									className="flex items-center gap-3 w-full p-2.5 rounded-lg hover:bg-muted transition-colors text-left"
								>
									<div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
										{result.thumbnailImage && (
											<img src={result.thumbnailImage} alt={result.title} className="w-full h-full object-cover" />
										)}
									</div>
									<div className="flex-1 min-w-0">
										<p className="font-medium text-sm truncate">{result.title}</p>
										<p className="text-xs text-muted-foreground">{result.category?.title} • {result.author?.name || ""}</p>
									</div>
								</button>
							))}
						</div>
					)}
				</div>
			)}
			{showResults && searchResults.courses.length === 0 && searchResults.blogs.length === 0 && searchQuery.length >= 2 && !isSearching && (
				<div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-lg z-50 p-6 text-center">
					<p className="text-muted-foreground text-sm">No results found for &ldquo;{searchQuery}&rdquo;</p>
				</div>
			)}
		</>
	);

	return (
		<nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/70 bg-background/90 shadow-[0_8px_30px_hsl(222_47%_11%/0.06)] backdrop-blur-xl">
			<div className="mx-auto w-full max-w-[1500px] px-3 sm:px-5 lg:px-6 2xl:px-8">
				<div className="flex items-center justify-between h-16 md:h-20">
					<Link href="/" className="flex items-center shrink-0">
						<div className="h-10 md:h-14">
							<Image
								src="/logo.png"
								alt="Soft Crayons Logo"
								width={220}
								height={46}
								className="h-full w-auto object-contain"
								priority
							/>
						</div>
					</Link>

					<div className="hidden md:flex items-center gap-4 lg:gap-6 xl:gap-8 ml-8 lg:ml-12">
						{visibleLinks.map((link) => (
							<Link
								key={link.name}
								href={link.href}
								className={cn(
									"transition-colors duration-200 font-bold text-sm",
									isActive(link.href)
										? "text-primary font-semibold"
										: "text-muted-foreground hover:text-foreground"
								)}
							>
								{link.name}
							</Link>
						))}

						{moreLinks.length > 0 && (
							<div className="relative" ref={dropdownRef}>
								<button
									onClick={() => setIsMoreOpen(!isMoreOpen)}
									className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors duration-200 font-bold text-sm"
								>
									More
									<ChevronDown className={cn("w-4 h-4 transition-transform duration-200", isMoreOpen ? "rotate-180" : "")} />
								</button>

								{isMoreOpen && (
									<div className="absolute top-full right-0 mt-2 w-56 rounded-md border border-border bg-popover p-2 shadow-[0_18px_45px_hsl(222_47%_11%/0.14)]">
										<div className="py-1">
											{moreLinks.map((link) => (
												<Link
													key={link.name}
													href={link.href}
													onClick={() => setIsMoreOpen(false)}
													className={cn(
														"block px-4 py-2.5 text-sm rounded-md font-semibold",
														isActive(link.href)
															? "text-primary bg-primary/10 font-semibold"
															: "text-popover-foreground hover:bg-accent hover:text-accent-foreground"
													)}
												>
													{link.name}
												</Link>
											))}
										</div>
									</div>
								)}
							</div>
						)}
					</div>

					<div className="hidden md:flex items-center gap-3">
						<div ref={searchRef} className="relative">
							<div className={cn(
								"flex items-center transition-all duration-300 rounded-md border",
								searchOpen
									? "w-64 lg:w-72 bg-card border-border px-3"
									: "w-10 border-transparent"
							)}>
								<button
									onClick={() => {
										if (searchOpen && !searchQuery) setSearchOpen(false);
										else setSearchOpen(true);
									}}
									className="w-10 h-10 rounded-md flex items-center justify-center hover:bg-muted transition-colors shrink-0"
									aria-label="Search"
								>
									<Search className="w-5 h-5" />
								</button>
								{searchOpen && (
									<>
										<input
											ref={searchInputRef}
											type="text"
											placeholder="Search anything..."
											value={searchQuery}
											onChange={(e) => setSearchQuery(e.target.value)}
											className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground py-2"
										/>
										{isSearching && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground shrink-0" />}
										{searchQuery && !isSearching && (
											<button onClick={clearSearch} className="shrink-0 p-0.5 hover:bg-muted rounded-full">
												<X className="w-4 h-4 text-muted-foreground" />
											</button>
										)}
									</>
								)}
							</div>
							{searchOpen && searchDropdown}
						</div>
						<button
							onClick={toggleTheme}
							className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-muted transition-colors duration-200"
							aria-label="Toggle theme"
						>
							{mounted && theme === "dark" ? (
								<Sun className="w-5 h-5" />
							) : (
								<Moon className="w-5 h-5" />
							)}
						</button>
						<Link href="/query" passHref>
							<Button variant="secondary" size="lg">
								Take Admission
							</Button>
						</Link>
						{session?.user ? (
							<Link href="/dashboard" passHref>
								<Button variant="outline" size="lg" className="flex items-center gap-2">
									{session.user.image ? (
										<Image
											src={session.user.image}
											alt={session.user.name || "Profile"}
											width={24}
											height={24}
											className="w-6 h-6 rounded-full object-cover"
										/>
									) : (
										<span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold">
											{session.user.name?.charAt(0).toUpperCase() || "U"}
										</span>
									)}
									Dashboard
								</Button>
							</Link>
						) : (
							<Link href="/sign-in" passHref>
								<Button variant="outline" size="lg">
									Log In
								</Button>
							</Link>
						)}
						<Link
							href="/tutorials"
							className="flex items-center gap-2 rounded-md border border-primary/15 bg-primary/10 px-4 py-2 text-primary hover:bg-primary/15 transition-colors"
						>
							<span className="text-base font-semibold tracking-tight">
								Tutorials
							</span>
							<span className="text-[9px] uppercase text-muted-foreground">v1.0</span>
						</Link>
					</div>

					<div className="flex items-center gap-2 md:hidden">
						<button
							onClick={toggleTheme}
							className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-muted transition-colors"
							aria-label="Toggle theme"
						>
							{mounted && theme === "dark" ? (
								<Sun className="w-5 h-5" />
							) : (
								<Moon className="w-5 h-5" />
							)}
						</button>
						<button
							onClick={() => setIsOpen(!isOpen)}
							className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-muted transition-colors"
							aria-label="Toggle menu"
						>
							{isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
						</button>
					</div>
				</div>
			</div>

			<div
				className={cn(
					"md:hidden absolute top-full left-0 right-0 bg-background border-b border-border shadow-[0_18px_45px_hsl(222_47%_11%/0.12)] transition-all duration-300 overflow-hidden",
					isOpen ? "max-h-[calc(100dvh-4rem)] opacity-100 overflow-y-auto" : "max-h-0 opacity-0"
				)}
			>
				<div className="container py-4 space-y-2">
					<div className="relative px-1 pb-3">
						<div className="relative flex items-center bg-card border border-border rounded-md px-3">
							<Search className="w-5 h-5 text-muted-foreground shrink-0" />
							<input
								ref={mobileSearchInputRef}
								type="text"
								placeholder="Search anything..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								onFocus={() => setShowResults(true)}
								className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground py-3 px-2"
							/>
							{isSearching && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground shrink-0" />}
							{searchQuery && !isSearching && (
								<button onClick={clearSearch} className="shrink-0 p-1 hover:bg-muted rounded-full">
									<X className="w-4 h-4 text-muted-foreground" />
								</button>
							)}
						</div>
						{showResults && (searchResults.courses.length > 0 || searchResults.blogs.length > 0) && (
							<div className="mt-2 bg-card border border-border rounded-xl shadow-lg max-h-64 overflow-y-auto">
								{searchResults.courses.length > 0 && (
									<div className="p-2">
										<p className="text-xs font-semibold text-muted-foreground px-3 py-1 uppercase tracking-wider">Courses</p>
										{searchResults.courses.map((result) => (
											<button
												key={`m-course-${result.id}`}
												onClick={() => handleResultClick("course", result.slug)}
												className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-muted transition-colors text-left"
											>
												<div className="w-9 h-9 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
													{(result.thumbnailImage || result.bannerImage) && (
														<img src={result.thumbnailImage || result.bannerImage!} alt={result.title} className="w-full h-full object-cover" />
													)}
												</div>
												<div className="flex-1 min-w-0">
													<p className="font-medium text-sm truncate">{result.title}</p>
													<p className="text-xs text-muted-foreground">{result.category?.title}</p>
												</div>
											</button>
										))}
									</div>
								)}
								{searchResults.blogs.length > 0 && (
									<div className={cn("p-2", searchResults.courses.length > 0 && "border-t border-border")}>
										<p className="text-xs font-semibold text-muted-foreground px-3 py-1 uppercase tracking-wider">Blogs</p>
										{searchResults.blogs.map((result) => (
											<button
												key={`m-blog-${result.id}`}
												onClick={() => handleResultClick("blog", result.slug)}
												className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-muted transition-colors text-left"
											>
												<div className="w-9 h-9 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
													{result.thumbnailImage && (
														<img src={result.thumbnailImage} alt={result.title} className="w-full h-full object-cover" />
													)}
												</div>
												<div className="flex-1 min-w-0">
													<p className="font-medium text-sm truncate">{result.title}</p>
													<p className="text-xs text-muted-foreground">{result.category?.title}</p>
												</div>
											</button>
										))}
									</div>
								)}
							</div>
						)}
						{showResults && searchResults.courses.length === 0 && searchResults.blogs.length === 0 && searchQuery.length >= 2 && !isSearching && (
							<div className="mt-2 bg-card border border-border rounded-xl shadow-lg p-4 text-center">
								<p className="text-muted-foreground text-sm">No results for &ldquo;{searchQuery}&rdquo;</p>
							</div>
						)}
					</div>
					{navLinks.map((link) => (
						<Link
							key={link.name}
							href={link.href}
							onClick={() => setIsOpen(false)}
							className={cn(
								"block px-4 py-3 rounded-lg transition-colors font-medium",
								isActive(link.href)
									? "bg-primary/10 text-primary font-semibold"
									: "hover:bg-muted text-muted-foreground hover:text-foreground"
							)}
						>
							{link.name}
						</Link>
					))}
					<div className="px-4 pt-3 flex flex-col gap-2">
						<Link href="/query" passHref onClick={() => setIsOpen(false)}>
							<Button variant="secondary" size="lg" className="w-full">
								Take Admission
							</Button>
						</Link>
						{session?.user ? (
							<Link href="/dashboard" passHref onClick={() => setIsOpen(false)}>
								<Button variant="outline" size="lg" className="w-full flex items-center justify-center gap-2">
									{session.user.image ? (
										<Image
											src={session.user.image}
											alt={session.user.name || "Profile"}
											width={24}
											height={24}
											className="w-6 h-6 rounded-full object-cover"
										/>
									) : (
										<span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold">
											{session.user.name?.charAt(0).toUpperCase() || "U"}
										</span>
									)}
									Dashboard
								</Button>
							</Link>
						) : (
							<Link href="/sign-in" passHref onClick={() => setIsOpen(false)}>
								<Button variant="outline" size="lg" className="w-full">
									Log In
								</Button>
							</Link>
						)}
						<Link
							href="/tutorials"
							onClick={() => setIsOpen(false)}
							className="flex items-center justify-between rounded-lg border border-primary bg-primary/5 px-4 py-3"
						>
							<span className="text-base font-semibold tracking-tight">Tutorials</span>
							<span className="text-[11px] uppercase text-muted-foreground">v1.0</span>
						</Link>
					</div>
				</div>
			</div>
		</nav>
	);
}
