"use client";

import { TypeSpecimen, type SpecimenRole } from "./TypeSpecimen";

const ROLES: SpecimenRole[] = ["display", "headline", "title", "body", "label"];

export function TypeScale() {
  return (
    <ul
      data-testid="type-scale"
      style={{ display: "flex", flexDirection: "column", listStyle: "none", padding: 0, margin: 0 }}
    >
      {ROLES.map((role) => (
        <TypeSpecimen key={role} role={role} />
      ))}
    </ul>
  );
}
