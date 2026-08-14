import * as React from "react";
import { cn } from "@/lib/utils";

export type SkeletonVariant = "text" | "card" | "timeline-entry";

export interface SkeletonLoaderProps {
  variant?: SkeletonVariant;
  className?: string;
}

function Bone({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded bg-bg-muted animate-pulse",
        className
      )}
    />
  );
}

function TextSkeleton() {
  return (
    <div className="space-y-2">
      <Bone className="h-4 w-3/4" />
      <Bone className="h-4 w-full" />
      <Bone className="h-4 w-5/6" />
    </div>
  );
}

function CardSkeleton() {
  return (
    <div className="rounded-lg border border-border p-4 space-y-3">
      <Bone className="h-5 w-2/3" />
      <Bone className="h-3 w-1/3" />
      <div className="space-y-2 pt-1">
        <Bone className="h-3.5 w-full" />
        <Bone className="h-3.5 w-5/6" />
      </div>
      <div className="flex gap-1.5 pt-1">
        <Bone className="h-5 w-12 rounded-full" />
        <Bone className="h-5 w-16 rounded-full" />
        <Bone className="h-5 w-10 rounded-full" />
      </div>
    </div>
  );
}

function TimelineEntrySkeleton() {
  return (
    <div className="flex gap-4">
      {/* Timeline dot + line */}
      <div className="flex flex-col items-center gap-1 pt-1">
        <Bone className="size-3 rounded-full shrink-0" />
        <Bone className="w-px h-12 rounded-full" />
      </div>
      {/* Content */}
      <div className="flex-1 space-y-2 pb-6">
        <Bone className="h-4 w-1/2" />
        <Bone className="h-3 w-1/3" />
        <Bone className="h-3.5 w-full" />
      </div>
    </div>
  );
}

export function SkeletonLoader({
  variant = "text",
  className,
}: SkeletonLoaderProps) {
  return (
    <div aria-hidden="true" className={className}>
      {variant === "text" && <TextSkeleton />}
      {variant === "card" && <CardSkeleton />}
      {variant === "timeline-entry" && <TimelineEntrySkeleton />}
    </div>
  );
}
