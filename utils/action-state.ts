export enum Status {
  SUCCESS = "SUCCESS",
  ERROR = "ERROR",
}

export type ActionState =
  | {
      formErrors?: string[];
      fieldErrors?: Record<string, string[]>;
      status?: Status;
    }
  | null
  | undefined;

type Callbacks<T, R = unknown> = {
  onStart?: () => R;
  onEnd?: (reference: R) => void;
  onSuccess?: (result: T) => void;
  onError?: (result: T) => void;
};

export const withCallbacks = <
  Args extends unknown[],
  T extends ActionState,
  R = unknown,
>(
  fn: (...args: Args) => Promise<T>,
  callbacks: Callbacks<T, R>,
): ((...args: Args) => Promise<T>) => {
  return async (...args: Args) => {
    const promise = fn(...args);

    const reference = callbacks.onStart?.();

    const result = await promise;

    if (reference) {
      callbacks.onEnd?.(reference);
    }

    if (result?.status === Status.SUCCESS) {
      callbacks.onSuccess?.(result);
    }

    if (result?.status === Status.ERROR) {
      callbacks.onError?.(result);
    }

    return promise;
  };
};
