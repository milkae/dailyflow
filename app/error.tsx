"use client";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/typography";
import { logError } from "@/lib/logger";
import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logError(error, "Uncaught error");
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center px-4 py-8 text-center grow">
      <Heading as="h2" className="mb-4">
        Whoops!
      </Heading>
      <Heading as="h3" className="mb-6">
        Something went wrong
      </Heading>
      <Button size="lg" onClick={() => reset()}>
        Try again
      </Button>
    </div>
  );
}
