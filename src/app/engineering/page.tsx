import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Engineering",
  description: "Frontend engineering projects and case studies by Nicolas Van Labeke.",
};

// Stub page — full implementation in Phase C.
export default function EngineeringPage() {
  return (
    <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold text-foreground">Engineering</h1>
      <p className="mt-4 text-foreground-secondary">Coming soon.</p>
    </div>
  );
}
