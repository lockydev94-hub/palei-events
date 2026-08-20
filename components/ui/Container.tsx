import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ContainerProps {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  id?: string;
}

export function Container({ as: Component = "div", children, className, id }: ContainerProps) {
  return (
    <Component id={id} className={cn("container-shell", className)}>
      {children}
    </Component>
  );
}