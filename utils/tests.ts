export const getByNestedText =
  (string: string) => (content: string, element: Element | null) =>
    content !== "" && element?.textContent === string;
