import { Badge } from "@/app/_components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";
import { Heading } from "@/app/_components/ui/typography";
import { CheckCircle2, CircleAlert, ListTodo, Sparkles } from "lucide-react";
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
  const completedTodos = todos.filter((todo) => todo.isDone).length;
  const pendingTodos = todos.length - completedTodos;
  const urgentTodos = todos.filter((todo) => todo.urgent).length;

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <section className="overflow-hidden rounded-2xl border border-border/70 bg-linear-to-br from-primary/10 via-background to-muted/50 p-6 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <Badge variant="secondary" className="gap-1.5">
              <Sparkles className="size-3" />
              Todo focus
            </Badge>
            <div>
              <Heading as="h2" className="text-3xl sm:text-4xl">
                Keep your day clear and calm
              </Heading>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
                Capture what matters, spot urgent tasks quickly, and celebrate
                progress as you go.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-border/70 bg-background/80 p-3">
              <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-muted-foreground">
                Open
              </p>
              <p className="mt-1 text-2xl font-semibold">{pendingTodos}</p>
            </div>
            <div className="rounded-xl border border-border/70 bg-background/80 p-3">
              <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-muted-foreground">
                Done
              </p>
              <p className="mt-1 text-2xl font-semibold">{completedTodos}</p>
            </div>
            <div className="rounded-xl border border-border/70 bg-background/80 p-3">
              <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-muted-foreground">
                Urgent
              </p>
              <p className="mt-1 text-2xl font-semibold">{urgentTodos}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Card className="border-border/70 bg-background/70 shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <ListTodo className="size-5 text-primary" />
              <CardTitle>Add a task</CardTitle>
            </div>
            <CardDescription>
              Capture the next thing you need to do in a few seconds.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TodoForm />
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-background/70 shadow-sm">
          <CardHeader className="border-b bg-muted/30">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-5 text-primary" />
                <CardTitle>Your tasks</CardTitle>
              </div>
              <Badge variant="outline" className="gap-1.5">
                <CircleAlert className="size-3" />
                {urgentTodos > 0 ? `${urgentTodos} urgent` : "No urgent"}
              </Badge>
            </div>
            <CardDescription>
              Keep momentum going by marking items complete as you finish them.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <TodosList todos={todos} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
