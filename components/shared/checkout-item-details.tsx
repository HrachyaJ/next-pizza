import { cn } from "@/lib/utils";
import React from "react";

interface Props {
  title?: React.JSX.Element | string;
  value?: React.ReactNode;
  className?: string;
}

export const CheckoutItemDetails: React.FC<Props> = ({ className, title, value }) => {
  return (
    <div className={cn("flex my-4", className)}>
      <span className="flex flex-1 text-lg text-neutral-500">
        {title}
        <div className="flex-1 border-b border-dashed border-b-neutral-200 relative -top-1 mx-2" />
      </span>
      <span className="font-bold text-lg">
        {value}
      </span>
    </div>
  );
};