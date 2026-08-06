"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Plus } from "lucide-react";
import { RecipeForm } from "@/features/recipes/components/RecipeForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog";
import { logError } from "@/lib/logger";
import { ParsedRecipe } from "../types";

export const CreateRecipeDialog = ({
  open,
  onOpenChange,
}: {
  open?: boolean;
  onOpenChange?: (state: boolean) => void;
}) => {
  const [tab, setTab] = useState<"url" | "manual">("url");
  const [url, setUrl] = useState("");
  const [isParsing, setIsParsing] = useState(false);
  const [parsedRecipe, setParsedRecipe] = useState<ParsedRecipe>();
  const [isOpen, setIsOpen] = useState(false);

  const handleParseUrl = async () => {
    if (!url) return;

    setIsParsing(true);
    try {
      const response = await fetch("/api/recipes/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      if (response.ok) {
        const data = (await response.json()) as ParsedRecipe;
        setParsedRecipe(data);
        setTab("manual");
      } else {
        alert(
          "Could not parse this recipe URL. Please enter details manually.",
        );
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      logError(error, "Recipe parse error");
      alert("Failed to import recipe. Please try again or enter manually.");
    }
    setIsParsing(false);
  };

  const handleOpenState = onOpenChange ?? setIsOpen;

  const handleSuccess = () => {
    handleOpenState(false);
    setTab("url");
    setUrl("");
    setParsedRecipe(undefined);
  };

  const handleOpenChange = (open: boolean) => {
    handleOpenState(open);
    if (!open) {
      setTab("url");
      setUrl("");
      setParsedRecipe(undefined);
    }
  };

  return (
    <Dialog open={open || isOpen} onOpenChange={handleOpenChange}>
      {typeof open === "undefined" && (
        <DialogTrigger
          render={
            <Button className="bg-tertiary hover:bg-tertiary/90 text-tertiary-foreground">
              <Plus className="h-4 w-4 mr-2" />
              New Recipe
            </Button>
          }
        />
      )}
      <DialogContent className="sm:max-w-175 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Recipe</DialogTitle>
        </DialogHeader>
        <Tabs value={tab} onValueChange={(v) => setTab(v)} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="url">From URL</TabsTrigger>
            <TabsTrigger value="manual">Manual Entry</TabsTrigger>
          </TabsList>

          <TabsContent value="url" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="recipe-url">Recipe URL</Label>
              <div className="flex gap-2">
                <Input
                  id="recipe-url"
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com/recipe"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleParseUrl();
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={handleParseUrl}
                  disabled={!url || isParsing}
                  className="bg-tertiary hover:bg-tertiary/90 text-tertiary-foreground shrink-0"
                >
                  {isParsing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Parsing...
                    </>
                  ) : (
                    "Import"
                  )}
                </Button>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-500">
                Paste a link from AllRecipes, BBC Good Food, NYT Cooking, and
                more
              </p>
            </div>

            <p className="rounded-lg bg-tertiary/5 border border-tertiary/30 text-sm text-tertiary-foreground p-4">
              Most recipe websites are supported. After importing, you can
              review and edit all details before saving.
            </p>
          </TabsContent>

          <TabsContent value="manual" className="space-y-4 mt-4">
            <RecipeForm parsedRecipe={parsedRecipe} onSuccess={handleSuccess} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
