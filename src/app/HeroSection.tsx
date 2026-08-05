import { Button } from "@/components/ui/Button";

export interface HeroSectionLabels {
  heading: string;
  role: string;
  thesis: string;
  heroNavLabel: string;
  ctaResearch: string;
  ctaEngineering: string;
  ctaCV: string;
}

export function HeroSection({ labels }: { labels: HeroSectionLabels }) {
  return (
    <section
      aria-labelledby="hero-heading"
      className="flex min-h-[calc(100vh-4rem)] items-center py-24"
    >
      <div className="max-w-2xl">
        <h1
          id="hero-heading"
          className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl"
        >
          {labels.heading}
        </h1>
        <p className="mt-3 text-lg text-foreground-secondary">{labels.role}</p>
        <p className="mt-8 text-2xl italic text-foreground">{labels.thesis}</p>
        <nav aria-label={labels.heroNavLabel} className="mt-10 flex flex-wrap gap-3">
          <Button href="/research">{labels.ctaResearch}</Button>
          <Button href="/engineering">{labels.ctaEngineering}</Button>
          <Button href="/cv">{labels.ctaCV}</Button>
        </nav>
      </div>
    </section>
  );
}
