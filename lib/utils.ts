import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * A utility function that combines classnames from different sources
 * and properly merges Tailwind classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')  // Remove special characters
    .replace(/\s+/g, '-')      // Replace spaces with hyphens
    .replace(/--+/g, '-')      // Replace multiple hyphens with a single hyphen
    .substring(0, 100)         // Limit length
    + '-' + Date.now().toString().slice(-4); // Add a timestamp suffix for uniqueness
}
