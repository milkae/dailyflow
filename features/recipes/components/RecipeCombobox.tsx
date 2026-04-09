"use client";

import { useState } from "react";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Recipe } from "@/generated/prisma/browser";

type Props = {
  recipes: Recipe[];
  selectedRecipeId?: string;
  onSelectRecipe: (recipeId: string) => void;
  onCreateNew: () => void;
};

export const RecipeCombobox = ({
  recipes,
  selectedRecipeId,
  onSelectRecipe,
  onCreateNew,
}: Props) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const selectedRecipe = recipes.find((r) => r.id === selectedRecipeId);

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          render={
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
            >
              {selectedRecipe ? (
                <span className="truncate">{selectedRecipe.name}</span>
              ) : (
                <span className="text-muted-foreground">
                  Select a recipe...
                </span>
              )}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          }
        />

        <PopoverContent className="w-(--anchor-width) p-0" align="start">
          <Command className="bg-transparent">
            <CommandInput
              placeholder="Search recipes..."
              value={search}
              onValueChange={setSearch}
              className="border-0 focus:ring-0"
            />

            <CommandList>
              <CommandEmpty className="py-6 text-center text-sm">
                <div className="space-y-3">
                  <p className="text-muted-foreground">No recipe found.</p>
                  <Button
                    size="sm"
                    onClick={() => {
                      setOpen(false);
                      onCreateNew();
                    }}
                    className="bg-tertiary hover:bg-tertiary/90 text-tertiary-foreground"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {`Create ${search}`}
                  </Button>
                </div>
              </CommandEmpty>

              <CommandGroup>
                {recipes.map((recipe) => (
                  <CommandItem
                    key={recipe.id}
                    value={recipe.name}
                    onSelect={() => {
                      onSelectRecipe(recipe.id);
                      setOpen(false);
                    }}
                    className="cursor-pointer"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedRecipeId === recipe.id
                          ? "opacity-100"
                          : "opacity-0",
                      )}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{recipe.name}</div>
                      {recipe.description && (
                        <div className="text-xs text-muted-foreground truncate">
                          {recipe.description}
                        </div>
                      )}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>

              {recipes.length > 0 && (
                <>
                  <CommandSeparator />
                  <CommandGroup>
                    <CommandItem
                      onSelect={() => {
                        setOpen(false);
                        onCreateNew();
                      }}
                      className="cursor-pointer text-tertiary"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Create new recipe
                    </CommandItem>
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Info sur la recette sélectionnée */}
      {selectedRecipe && (
        <div className="rounded-lg border p-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{selectedRecipe.name}</p>
              {selectedRecipe.description && (
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {selectedRecipe.description}
                </p>
              )}
            </div>
            {selectedRecipe.sourceUrl && (
              <a
                href={selectedRecipe.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-tertiary hover:underline text-xs shrink-0"
              >
                View recipe →
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
