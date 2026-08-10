"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/app/_components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/_components/ui/popover";

type CategoryOption = {
  id: string;
  name: string;
  slug: string;
};

type Props = {
  categories: CategoryOption[];
  value?: string[];
  onChange: (value: string[]) => void;
};

export function RecipeCategoryMultiSelect({
  categories,
  value,
  onChange,
}: Props) {
  const selected = categories.filter((category) =>
    value?.includes(category.id),
  );

  function toggleCategory(id: string) {
    if (value?.includes(id)) {
      onChange(value?.filter((value) => value !== id));
    } else {
      onChange([...(value ? value : []), id]);
    }
  }

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button variant="outline" className="w-full justify-between">
            <span className="truncate">
              {selected.length === 0
                ? "Select categories..."
                : selected.map((category) => category.name).join(", ")}
            </span>

            <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
          </Button>
        }
      />

      <PopoverContent className="w-(--anchor-width) p-1">
        <div className="max-h-64 overflow-y-auto">
          {categories.map((category) => {
            const isSelected = value?.includes(category.id);

            return (
              <button
                key={category.id}
                type="button"
                onClick={() => toggleCategory(category.id)}
                className="flex w-full items-center rounded-sm px-2 py-2 text-sm hover:bg-accent"
              >
                <Check
                  className={`mr-2 size-4 ${
                    isSelected ? "opacity-100" : "opacity-0"
                  }`}
                />

                {category.name}
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
