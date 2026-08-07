import { Heading } from "@/app/_components/ui/typography";
import { Metadata } from "next";
import { getAllTodos } from "../actions";
import { TodoForm } from "./_components/TodoForm";
import { TodosList } from "./_components/TodosList";

export const metadata: Metadata = {
  title: "Todos",
  description: "Manage your todos list with DailyFlow.",
};

export default async function TodosPage() {
  const todos = await getAllTodos();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <Heading>Todos List</Heading>
          <p className="text-muted-foreground mt-2">Manages your tasks</p>
        </div>
      </div>
      <TodoForm />
      <TodosList todos={todos} />
    </div>
  );
}
