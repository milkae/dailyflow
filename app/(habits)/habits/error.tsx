"use client";

import { Button } from "@/app/_components/ui/button";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/app/_components/ui/alert";
import { Target, RefreshCw } from "lucide-react";
import { logError } from "@/lib/logger";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logError(error, "Habits page error");
  }, [error]);

  return (
    <div className="space-y-6">
      <Alert variant="destructive">
        <Target className="h-4 w-4" />
        <AlertTitle>Habits Section Error</AlertTitle>
        <AlertDescription className="mt-2 space-y-3">
          <p>
            {
              "We couldn't load your habits right now. This might be due to a network issue or server problem."
            }
          </p>
          {process.env.NODE_ENV === "development" && (
            <details className="text-xs">
              <summary className="cursor-pointer font-medium">
                Error details
              </summary>
              <pre className="mt-2 whitespace-pre-wrap text-xs bg-muted p-2 rounded">
                {error.message}
                {error.stack && `\n\n${error.stack}`}
              </pre>
            </details>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => reset()}
            className="mt-2"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try again
          </Button>
        </AlertDescription>
      </Alert>
    </div>
  );
}
