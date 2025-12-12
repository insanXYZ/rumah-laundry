import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Icon } from "@iconify/react";
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
        {/* <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex size-10 items-center justify-center rounded-md">
            <Icon
              width={"100px"}
              icon={"material-symbols-light:laundry-outline"}
            />
          </div>
          Rumah Laundry
        </a> */}
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
