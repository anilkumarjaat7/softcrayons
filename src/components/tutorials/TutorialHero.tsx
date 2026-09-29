import { Sparkles } from "lucide-react";

export function TutorialHero() {
  return (
    <section className="relative overflow-hidden border-b border-border/70 brand-section">
      <div className="container relative py-16 md:py-20">
        <div className="mx-auto max-w-4xl text-center">
          <span className="brand-eyebrow mx-auto mb-5 w-fit">
            <Sparkles className="h-3.5 w-3.5" />
            SoftCrayons learning hub
          </span>
          <h1 className="text-4xl font-black leading-tight text-foreground md:text-6xl">
            Practical tutorials for focused, structured learning.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
            Search topics, follow sequenced lessons, and build confidence with clean learning paths.
          </p>
        </div>
      </div>
    </section>
  );
}
