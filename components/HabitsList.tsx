"use client";

import { deleteHabit } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { HabitForm } from "./HabitForm";
import { Edit, Trash2 } from "lucide-react";
import { TypedHabit } from "@/lib/types";

export const HabitsList = ({ habits }: { habits: TypedHabit[] }) => {
  return (
    <>
      <HabitForm />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Habit</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Frequency</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {habits.map((habit) => (
            <TableRow key={habit.id}>
              <TableCell className="font-medium">{habit.name}</TableCell>
              <TableCell>{habit.description}</TableCell>
              <TableCell>{habit.frequency}</TableCell>
              <TableCell className="text-right gap-2">
                <HabitForm
                  habit={habit}
                  trigger={
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 mr-2"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  }
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 hover:text-destructive hover:bg-destructive-muted dark:hover:bg-destructive-muted"
                  onClick={() => {
                    deleteHabit(habit.id);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};
