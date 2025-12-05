"use client";

import { Button } from "./button";
import { Spinner } from "./spinner";

interface ButtonLoading {
  label: string;
  isLoading: boolean;
}

export function ButtonLoading({ label, isLoading, ...props }: ButtonLoading) {
  return (
    <Button disabled={isLoading} {...props}>
      {isLoading ? <Spinner color="white" /> : null}
      {label}
    </Button>
  );
}
