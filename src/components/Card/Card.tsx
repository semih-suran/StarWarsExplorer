import React from "react";
import { cn } from "@/utilities/cn";
import { placeholder } from "@/utilities/placeholder";

type Props = {
  className?: string;
  title: string;
  children?: React.ReactNode;
  testId?: string;
};

export const Card = ({ title, children, className, testId }: Props) => {
  return (
    <div
      className={cn(
        "card bg-base-100 border-2 border-[#FFE81F] shadow-[0_0_10px_rgba(255,232,31,0.3)] w-full shadow-sm overflow-hidden",
        className
      )}
      data-testid={testId}
    >
      <figure className="h-40 w-full bg-gray-100">
        <img
          src={placeholder(title, 384)}
          alt={title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </figure>

      <div className="card-body">
        <h2 className="card-title">{title}</h2>
        {children}
      </div>
    </div>
  );
};
