import * as React from "react";
import { cn } from "@/lib/utils";

export type EmptyStateVariant = "empty" | "filtered";

type HeadingLevel = "h2" | "h3" | "h4";

export interface EmptyStateAction {
  label: string;
  onClick?: () => void;
  href?: string;
}

export interface EmptyStateProps {
  variant?: EmptyStateVariant;
  heading: string;
  headingLevel?: HeadingLevel;
  description?: string;
  action?: EmptyStateAction;
  className?: string;
}

export function EmptyState({
  variant = "empty",
  heading,
  headingLevel: Heading = "h3",
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      role="status"
      className={cn(
        "flex flex-col items-center justify-center text-center",
        "px-6 py-12 rounded-lg border border-dashed border-border",
        className
      )}
    >
      <div
        aria-hidden="true"
        className="mb-4 size-10 rounded-full bg-bg-muted flex items-center justify-center text-text-muted"
      >
        {variant === "filtered" ? (
          <svg
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
            className="size-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591L15.75 12v8.25l-7.5-3V12L3.659 7.41A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z"
            />
          </svg>
        ) : (
          <svg
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
            className="size-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H6.911a2.25 2.25 0 0 0-2.15 1.588L2.1 13.177a2.25 2.25 0 0 0-.1.661Z"
            />
          </svg>
        )}
      </div>

      <Heading className="text-base font-medium text-text mb-1">{heading}</Heading>

      {description && (
        <p className="text-sm text-text-muted max-w-xs">{description}</p>
      )}

      {action && (
        <div className="mt-4">
          {action.href ? (
            <a
              href={action.href}
              className="inline-flex items-center text-sm font-medium text-accent hover:text-accent-hover transition-colors duration-150"
            >
              {action.label}
            </a>
          ) : (
            <button
              type="button"
              onClick={action.onClick}
              className="inline-flex items-center text-sm font-medium text-accent hover:text-accent-hover transition-colors duration-150 focus-visible:outline-none"
            >
              {action.label}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
