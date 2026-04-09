import { MealType } from "@/generated/prisma/enums";
import { Cookie, Croissant, Salad, Soup } from "lucide-react";
import { cn } from "@/utils/cn";
import Link from "next/link";
import { MealWithRecipeName } from "@/features/meals/types";

const mealConfig = {
  [MealType.breakfast]: { label: "Breakfast", icon: Croissant },
  [MealType.lunch]: { label: "Lunch", icon: Salad },
  [MealType.dinner]: { label: "Dinner", icon: Soup },
  [MealType.snack]: { label: "Snack", icon: Cookie },
};

type Props = {
  type: MealType;
  meal?: MealWithRecipeName;
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
              {meal.notes && (
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {meal.notes}
                </p>
              )}
              {meal.recipe && (
                <Link
                  href={`/meals/recipes/${meal.recipe.id}`}
                  onClick={(e) => e.stopPropagation()}
                  className="text-sm text-tertiary hover:underline font-medium"
                >
                  {meal.recipe.name}
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
