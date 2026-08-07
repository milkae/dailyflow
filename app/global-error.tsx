"use client";

import { Button } from "@/app/_components/ui/button";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/app/_components/ui/alert";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { logError } from "@/lib/logger";
import { useEffect } from "react";
import Link from "next/link";
import { buttonVariants } from "@/app/_components/ui/buttonVariants";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logError(error, "Global application error");
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen flex items-center justify-center p-4 bg-background">
        <div className="max-w-md w-full space-y-6">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Application Error</AlertTitle>
            <AlertDescription className="mt-2 space-y-3">
              <p>Something went wrong.</p>
              {process.env.NODE_ENV === "development" && (
                <details className="text-xs">
                  <summary className="cursor-pointer font-medium">
                    Error details
                  </summary>
                  <pre className="mt-2 whitespace-pre-wrap text-xs bg-muted p-2 rounded max-h-32 overflow-y-auto">
                    {error.message}
                    {error.stack && `\n\n${error.stack}`}
                  </pre>
                </details>
              )}
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" onClick={() => reset()}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try again
                </Button>
                <Link
                  href="/"
                  className={buttonVariants({ variant: "default", size: "sm" })}
                >
                  <Home className="h-4 w-4 mr-2" />
                  Go Home
                </Link>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      </body>
    </html>
  );
}
