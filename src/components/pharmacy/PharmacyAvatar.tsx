import type { JSX } from "react";
import { cn } from "@/utils/cn";

interface PharmacyAvatarProps {
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

function getInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter((w) => w.length > 0);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return words
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

const sizeClasses: Record<NonNullable<PharmacyAvatarProps["size"]>, string> = {
  sm: "h-9 w-9 rounded-lg text-xs",
  md: "h-11 w-11 rounded-xl text-sm",
  lg: "h-14 w-14 rounded-2xl text-base",
};

export function PharmacyAvatar({
  name,
  size = "md",
  className,
}: PharmacyAvatarProps): JSX.Element {
  return (
    <div
      className={cn(
        "flex flex-shrink-0 items-center justify-center font-semibold",
        "bg-primary/10 text-primary dark:bg-primary/15 dark:text-primary",
        sizeClasses[size],
        className
      )}
    >
      {getInitials(name)}
    </div>
  );
}
