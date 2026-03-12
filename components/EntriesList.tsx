import { Entry } from "@/generated/prisma/client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

export const EntriesList = ({ entries }: { entries: Entry[] }) => {
  if (entries.length === 0) {
    return <p className="text-center text-muted-foreground">No entries yet</p>;
  }

  return (
    <Table>
      <TableCaption>History</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Note</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {entries.map((e) => (
          <TableRow key={e.id}>
            <TableCell>
              <time>{e.date.toLocaleDateString()}</time>
            </TableCell>
            <TableCell>{e.note}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
