"use client";

import { Icon } from "@iconify/react";
import { Button } from "../ui/button";
import { HttpMethod, Mutation } from "@/utils/tanstack";

export const ExportExcelButton = () => {
  const onClick = () => {
    window.location.href = "/api/report/order";
  };

  return (
    <Button onClick={onClick}>
      <Icon icon="uil:export" color="white" />
      Laporan Bulanan
    </Button>
  );
};
