"use client";

import { Button } from "./button";
import { Spinner } from "./spinner";

interface ButtonLoading {
  label: string;
  isLoading: boolean;
}

export function ButtonLoading({ label, isLoading }: ButtonLoading) {
  return (
    <Button disabled={isLoading}>
      {isLoading ? <Spinner color="white" /> : null}
      {label}
    </Button>
  );
}
