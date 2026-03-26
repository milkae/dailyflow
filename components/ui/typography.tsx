import { cn } from "@/lib/utils";

type HeadingProps = React.HTMLAttributes<HTMLHeadingElement> & {
  as?: "h1" | "h2" | "h3";
};

const variants = {
  h1: "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
  h2: "scroll-m-20 text-3xl font-semibold tracking-tight",
  h3: "scroll-m-20 text-2xl font-semibold tracking-tight",
};

export function Heading({
  as = "h1",
  className,
  children,
  ...props
}: HeadingProps) {
  const Tag = as;
  return (
    <Tag className={cn(variants[as], className)} {...props}>
      {children}
    </Tag>
  );
}
