import Link from "next/link";
import { cn } from "@/lib/utils";
import { MealType } from "@/generated/prisma/enums";
import { Cookie, Croissant, Salad, Soup } from "lucide-react";
import { Meal } from "@/generated/prisma/browser";

const mealConfig = {
  [MealType.breakfast]: { label: "Breakfast", icon: Croissant },
  [MealType.lunch]: { label: "Lunch", icon: Salad },
  [MealType.dinner]: { label: "Dinner", icon: Soup },
  [MealType.snack]: { label: "Snack", icon: Cookie },
};

type Props = {
  type: MealType;
  meal?: Meal;
  onClick?: () => void;
};

export function MealSlot({ type, meal, onClick }: Props) {
  const config = mealConfig[type];
  const Icon = config.icon;
  return (
    <div
      onClick={onClick}
      className={cn(
        "rounded-lg border p-3 transition-all",
        meal
          ? "bg-tertiary-muted/30 border-tertiary/30"
          : "border-dashed border-border/50 bg-muted/10",
        onClick &&
          "cursor-pointer hover:border-tertiary hover:bg-tertiary-muted/50",
      )}
    >
      <div className="flex items-center gap-3">
        <div className="rounded-full p-3 bg-tertiary/10 text-tertiary">
          <Icon />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-0.5">
            {config.label}
          </p>

          {meal ? (
            <>
              <p className="font-medium text-sm truncate">{meal.name}</p>
              {meal.recipeId && (
                <Link
                  href={`/meals/recipes/${meal.recipeId}`}
                  onClick={(e) => e.stopPropagation()}
                  className="text-[11px] text-tertiary hover:underline flex items-center gap-1 mt-1"
                >
                  View recipe
                </Link>
              )}
            </>
          ) : (
            <p className="text-sm text-muted-foreground italic">Not planned</p>
          )}
        </div>
      </div>
    </div>
  );
}
