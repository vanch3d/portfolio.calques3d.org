import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Publications",
};

// Stub page — full implementation in Phase C.
export default function PublicationsPage() {
  return (
    <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold text-foreground">Publications</h1>
      <p className="mt-4 text-foreground-secondary">Coming soon.</p>
    </div>
  );
}
