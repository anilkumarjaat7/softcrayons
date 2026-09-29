"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Sun, Moon, Search, Menu, X, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth-client";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { TutorialSearch } from "@/components/tutorials/TutorialSearch";

type FeaturedTopic = {
  title: string;
  slug: string;
};

type TutorialsNavbarProps = {
  featuredTopics?: FeaturedTopic[];
};

export function TutorialsNavbar({ featuredTopics = [] }: TutorialsNavbarProps) {
	const [isOpen, setIsOpen] = useState(false);
	const { theme, setTheme } = useTheme();
	const pathname = usePathname();
	const { data: session } = useSession();

	const pathParts = pathname?.split("/").filter(Boolean) ?? [];
	const activeTopicSlug = pathParts[0] === "tutorials" ? pathParts[1] ?? null : null;
	const isTopicActive = (slug: string) => activeTopicSlug === slug;

	const [searchOpen, setSearchOpen] = useState(false);
	const searchRef = useRef<HTMLDivElement>(null);

	const toggleTheme = () => {
		setTheme(theme === "dark" ? "light" : "dark");
	};

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
				setSearchOpen(false);
			}
		};
		const handleScroll = () => {
			if (searchOpen) setSearchOpen(false);
		};

		document.addEventListener("mousedown", handleClickOutside);
		window.addEventListener("scroll", handleScroll, { passive: true });

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
			window.removeEventListener("scroll", handleScroll);
		};
	}, [searchOpen]);

	return (
		<nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/70 bg-background/90 shadow-[0_8px_30px_hsl(222_47%_11%/0.06)] backdrop-blur-xl">
			<div className="mx-auto w-full max-w-[1500px] px-3 sm:px-5 lg:px-6 2xl:px-8">
				<div className="flex items-center justify-between h-16 md:h-20">
					<Link href="/tutorials" className="flex items-center shrink-0">
					<div className="flex items-center shrink-0">
							<div className="hidden md:flex h-8 md:h-7 items-center">
                                <Image
                                    src="/logo.png"
                                    alt="Soft Crayons Logo"
                                    width={180}
                                    height={50}
                                    className="h-full w-auto object-contain"
                                    priority
                                />
                            </div>
						<span className="hidden md:inline mx-3 text-2xl font-light text-foreground/70 dark:text-muted-foreground select-none">|</span>
							<span className="text-xl md:text-2xl font-black tracking-tight text-primary transition-colors group-hover:text-primary/80">
                                Tutorials
                            </span>
							<span className="ml-1 rounded-md bg-secondary/10 px-2 py-0.5 text-[10px] md:text-[11px] font-black text-secondary mb-0.5 md:mb-1 tracking-wider">
                                v1.0
                            </span>
					</div>
                    </Link>

					<div className="hidden lg:flex flex-1 justify-center items-center gap-4 xl:gap-6">
						{featuredTopics.slice(0, 4).map((topic) => (
							<Link
								key={topic.slug}
								href={`/tutorials/${topic.slug}`}
								className={cn(
									"transition-colors duration-200 font-bold text-sm",
									isTopicActive(topic.slug)
										? "text-primary font-semibold"
										: "text-muted-foreground hover:text-foreground"
								)}
							>
								{topic.title}
							</Link>
						))}
					</div>

					<div className="hidden md:flex items-center gap-3 shrink-0">
						<div className="relative flex items-center" ref={searchRef}>
							<div className={cn(
								"flex items-center transition-all duration-300 rounded-md border",
								searchOpen ? "w-64 lg:w-72 border-border bg-card px-2" : "w-10 border-transparent hover:bg-muted/50"
							)}>
								<button
                                    onClick={() => setSearchOpen(!searchOpen)}
									className="w-10 h-10 rounded-md flex items-center justify-center transition-colors shrink-0"
									aria-label="Search"
								>
									<Search className="w-5 h-5 text-muted-foreground" />
								</button>
								{searchOpen && (
                                    <div className="flex-1 min-w-0 pr-2">
                                        <TutorialSearch variant="navbar" />
                                    </div>
								)}
							</div>
						</div>

						<button
							onClick={toggleTheme}
							className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-muted transition-colors duration-200"
							aria-label="Toggle theme"
						>
							{theme === "dark" ? (
								<Sun className="w-5 h-5" />
							) : (
								<Moon className="w-5 h-5" />
							)}
						</button>

						<Link href="/query" passHref>
							<Button variant="secondary" size="lg" className="hidden lg:flex">
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
							href="/"
							className="flex items-center gap-2 rounded-md border border-border bg-card px-4 py-[10px] hover:bg-muted transition-colors ml-2"
						>
							<ArrowLeft className="h-4 w-4 text-muted-foreground" />
							<span className="text-sm font-semibold text-muted-foreground">Back to Home</span>
						</Link>
					</div>

					<div className="flex items-center gap-2 md:hidden ml-auto">
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
				<div className="container py-4 space-y-4">
                    <div className="px-1 relative z-50">
                        <TutorialSearch />
                    </div>

                    <div className="space-y-1">
                        <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            Featured Topics
                        </div>
						{featuredTopics.slice(0, 4).map((topic) => (
                            <Link
                                key={topic.slug}
                                href={`/tutorials/${topic.slug}`}
                                onClick={() => setIsOpen(false)}
                                className={cn(
                                    "block px-4 py-3 rounded-lg transition-colors font-medium",
									isTopicActive(topic.slug)
                                        ? "bg-primary/10 text-primary font-semibold"
                                        : "hover:bg-muted text-muted-foreground hover:text-foreground"
                                )}
                            >
                                {topic.title}
                            </Link>
                        ))}
                    </div>

					<div className="px-4 pt-3 flex flex-col gap-2 border-t border-border">
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
                        <Link href="/" passHref onClick={() => setIsOpen(false)}>
                            <Button variant="ghost" size="lg" className="w-full text-muted-foreground mt-2 border border-border">
                                Back to Home
                            </Button>
                        </Link>
					</div>
				</div>
			</div>
		</nav>
	);
}
