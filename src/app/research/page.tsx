/**
 * /research — Research projects listing
 *
 * Rendering: SSG
 * Research content is frozen legacy work — built once at deploy time.
 * No revalidation needed.
 */

import { getAllResearchProjects } from "@/lib/content";
import { ProjectCard } from "./ProjectCard";

// SSG — no dynamic data, no revalidation
export const dynamic = "force-static";

export default function ResearchPage() {
  // SSG: getAllResearchProjects() runs at build time only
  const projects = getAllResearchProjects();

  return (
    <main>
      <h1>Research</h1>
      <p>
        Academic R&amp;D work in AI in Education and learning technologies
        (1996–2017).
      </p>
      <section>
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </section>
    </main>
  );
}
