"use client";

import Link from "next/link";
import { Check, ChevronDown } from "lucide-react";

import { Button } from "@/app/_components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";
import { cn } from "@/utils/cn";
import { buttonVariants } from "@/app/_components/ui/buttonVariants";

type Category = {
  id: string;
  name: string;
  slug: string;
};

type CategoryFilterProps = {
  categories: Category[];
  selectedCategory?: string;
  maxVisible?: number;
};

export function CategoryFilter({
  categories,
  selectedCategory,
  maxVisible = 5,
}: CategoryFilterProps) {
  const visibleCategories = categories.slice(0, maxVisible);
  const moreCategories = categories.slice(maxVisible);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Link
        href="/recipes"
        className={buttonVariants({
          variant: !selectedCategory ? "default" : "outline",
          size: "sm",
        })}
      >
        All
      </Link>

      {visibleCategories.map((category) => {
        const isSelected = category.slug === selectedCategory;

        return (
          <Link
            key={category.id}
            href={`/recipes?category=${encodeURIComponent(category.slug)}`}
            className={buttonVariants({
              variant: isSelected ? "default" : "outline",
              size: "sm",
            })}
          >
            {category.name}
          </Link>
        );
      })}

      {moreCategories.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                size="sm"
                variant={
                  moreCategories.some((c) => c.slug === selectedCategory)
                    ? "default"
                    : "outline"
                }
              >
                More
                <ChevronDown className="ml-1 size-3.5" />
              </Button>
            }
          />

          <DropdownMenuContent align="start">
            {moreCategories.map((category) => {
              const isSelected = category.slug === selectedCategory;

              return (
                <DropdownMenuItem
                  key={category.id}
                  render={
                    <Link
                      href={`/recipes?category=${encodeURIComponent(
                        category.slug,
                      )}`}
                    />
                  }
                >
                  <Check
                    className={cn(
                      "mr-2 size-4",
                      isSelected ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {category.name}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
