import { type ReactNode } from "react";

declare global {
  namespace JSX {
    type ElementType =
      | keyof JSX.IntrinsicElements
      | React.ComponentType<any>
      | ((props: any) => Promise<ReactNode> | ReactNode);
  }
}
