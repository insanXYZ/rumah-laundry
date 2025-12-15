"use client";

import { Icon } from "@iconify/react";
import { Button } from "../ui/button";

export const ExportExcelExpendButton = () => {
  const onClick = () => {
    window.location.href = "/api/report/expend";
  };

  return (
    <Button onClick={onClick}>
      <Icon icon="uil:export" color="white" />
      Laporan Bulanan
    </Button>
  );
};
