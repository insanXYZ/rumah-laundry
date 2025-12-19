import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="flex items-center self-center ">
          <Image src={"logo.svg"} alt="logo" width={150} height={200} />
        </div>
        <div className={cn("flex flex-col gap-6")}>
          <Card>{children}</Card>
        </div>
      </div>
    </div>
  );
}
