import { cn } from "@/lib/utils";
import { Tag } from "./Tag";
import type { SkillGroup as SkillGroupData } from "@/types/content";

export interface SkillGroupProps {
  group: SkillGroupData;
  className?: string;
}

export function SkillGroup({ group, className }: SkillGroupProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <h3 className="font-mono text-xs uppercase tracking-widest text-text-muted">
        {group.label}
      </h3>
      <ul className="flex flex-wrap gap-1.5" aria-label={group.label}>
        {group.skills.map((skill) => (
          <li key={skill}>
            <Tag>{skill}</Tag>
          </li>
        ))}
      </ul>
    </div>
  );
}
