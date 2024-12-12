"use client";

import React from "react";

import { Command as CommandPrimitive } from "cmdk";

import { cn } from "@lib/utils";

export const Command = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => {
  const classes = cn(
    "flex",
    "h-full",
    "w-full",
    "flex-col",
    "overflow-hidden",
    "rounded-md",
    "bg-popover",
    "text-popover-foreground",
    className,
  );
  return <CommandPrimitive ref={ref} className={classes} {...props} />;
});

Command.displayName = CommandPrimitive.displayName;
