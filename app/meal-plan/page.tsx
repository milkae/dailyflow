import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { prisma } from "@/lib/prisma";
import { MealForm } from "@/components/MealForm";
import { capitalize } from "@/lib/utils";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { Cookie, Croissant, Salad, Soup } from "lucide-react";
import { MealType } from "@/generated/prisma/enums";

async function getWeekMeals() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const startOfWeek = new Date(today);
  const day = startOfWeek.getDay();
  const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
  startOfWeek.setDate(diff);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(endOfWeek.getDate() + 7);

  return await prisma.meal.findMany({
    include: {
      recipe: true,
    },
    orderBy: [{ date: "asc" }, { type: "asc" }],
  });
}

const days = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

const MealIcons = {
  [MealType.breakfast]: <Croissant />,
  [MealType.lunch]: <Salad />,
  [MealType.snack]: <Cookie />,
  [MealType.dinner]: <Soup />,
};

const mealTypes = Object.values(MealType).map((v) => ({
  value: v,
  label: capitalize(v),
}));

export default async function MealPlanPage() {
  const meals = await getWeekMeals();

  return (
    <main>
      <h1>Weekly Meal Plan</h1>
      <p>Plan your meals for the week ahead</p>
      <Tabs defaultValue="monday">
        <TabsList variant="line">
          {days.map((day) => (
            <TabsTrigger value={day} key={day}>
              {capitalize(day)}
            </TabsTrigger>
          ))}
        </TabsList>
        {days.map((day, index) => {
          const dayMeals = meals.filter((m) => m.date.getDay() === index + 1);
          const dayDate = new Date();
          dayDate.setDate(
            dayDate.getDate() + ((index + 8 - dayDate.getDay()) % 7),
          );
          return (
            <TabsContent value={day} key={day}>
              {mealTypes.map((mealType) => {
                const meal = dayMeals.find((m) => m.type === mealType.value);
                return (
                  <Item key={`${mealType.value}-${day}`}>
                    <ItemMedia variant="icon">
                      {MealIcons[mealType.value]}
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle>{mealType.label}</ItemTitle>
                      <ItemDescription>{meal?.name}</ItemDescription>
                    </ItemContent>
                    <ItemActions>
                      <MealForm meal={meal} date={dayDate} />
                    </ItemActions>
                  </Item>
                );
              })}
            </TabsContent>
          );
        })}
      </Tabs>
    </main>
  );
}
