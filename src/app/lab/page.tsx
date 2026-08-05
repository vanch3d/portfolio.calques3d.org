import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lab",
};

// Stub page — full implementation in Phase C.
export default function LabPage() {
  return (
    <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold text-foreground">Lab</h1>
      <p className="mt-4 text-foreground-secondary">Coming soon.</p>
    </div>
  );
}
