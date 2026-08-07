"use client";

import { unstable_catchError as catchError, type ErrorInfo } from "next/error";
import { Button } from "@/app/_components/ui/button";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/app/_components/ui/alert";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { logError } from "@/lib/logger";

interface ErrorFallbackProps {
  title?: string;
  description?: string;
}

function ErrorFallback(
  { title = "Something went wrong", description }: ErrorFallbackProps,
  { error, unstable_retry }: ErrorInfo,
) {
  // Log the error
  logError(error, "Component error boundary");

  return (
    <Alert variant="destructive" className="m-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="mt-2 space-y-3">
        <p>
          {description || "An error occurred while loading this component."}
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
          onClick={() => unstable_retry()}
          className="mt-2"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Try again
        </Button>
      </AlertDescription>
    </Alert>
  );
}

// Create the error boundary component using unstable_catchError
export const ErrorBoundary = catchError(ErrorFallback);
