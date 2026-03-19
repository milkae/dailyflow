"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { RecipeFormDialog } from "@/components/RecipeFormDialog";

export function CreateRecipeButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="bg-tertiary hover:bg-tertiary/90 text-tertiary-foreground"
      >
        <Plus className="h-4 w-4 mr-2" />
        New Recipe
      </Button>

      <RecipeFormDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
