import { MealType } from "@/generated/prisma/enums";
import { Cookie, Croissant, Salad, Soup } from "lucide-react";
import { Meal } from "@/generated/prisma/browser";
import { cn } from "@/lib/utils";
import Link from "next/link";

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
        "rounded-lg border p-3.5 transition-all duration-200",
        meal
          ? "bg-tertiary/5 border-tertiary/30 hover:border-tertiary/50 hover:bg-tertiary/10 cursor-pointer hover:shadow-sm"
          : "border-dashed border-border/50 bg-muted/5",
        onClick && "cursor-pointer",
      )}
    >
      <div className="flex items-center gap-3">
        <div className="text-3xl shrink-0 drop-shadow-sm">
          <Icon />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider opacity-60">
            {config.label}
          </p>

          {meal ? (
            <>
              <p className="font-semibold text-sm text-foreground truncate leading-tight mt-1">
                {meal.name}
              </p>
              {meal.recipeId && (
                <Link
                  href={`/meals/recipes/${meal.recipeId}`}
                  onClick={(e) => e.stopPropagation()}
                  className="text-[11px] text-tertiary hover:underline flex items-center gap-1 mt-1.5 font-medium"
                >
                  View recipe
                </Link>
              )}
            </>
          ) : (
            <p className="text-sm text-muted-foreground mt-1">Not planned</p>
          )}
        </div>
      </div>
    </div>
  );
}
