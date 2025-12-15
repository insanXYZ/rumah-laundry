import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { DatePicker } from "../ui/date-picker";
import { DateTime } from "luxon";

interface filterDashoardButtonProps {
  setStartDate: (e: string) => void;
  setLastDate: (e: string) => void;
}

export const FilterDashboardButton = ({
  setStartDate,
  setLastDate,
}: filterDashoardButtonProps) => {
  const [filter, setFilter] = useState<string>();

  const handlePreset = (value: string) => {
    const now = DateTime.now();

    switch (value) {
      case "today":
        setStartDate(now.toFormat("yyyy-MM-dd"));
        setLastDate(now.toFormat("yyyy-MM-dd"));
        break;

      case "month":
        setStartDate(now.startOf("month").toFormat("yyyy-MM-dd"));
        setLastDate(now.endOf("month").toFormat("yyyy-MM-dd"));
        break;

      case "custom":
        setStartDate("");
        setLastDate("");
        break;
    }

    setFilter(value);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>
          <Icon icon="mdi:filter" color="white" />
          Filter
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-96" align="start">
        <div className="w-full flex flex-col gap-5 p-2">
          <Select onValueChange={handlePreset}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="today">Hari ini</SelectItem>
                <SelectItem value="month">Bulan ini</SelectItem>
                <SelectItem value="custom">Kustom</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          {filter == "custom" && (
            <div className="flex gap-1 justify-between items-center">
              <DatePicker label="Dari tanggal" onChange={setStartDate} />
              <DatePicker label="Sampai tanggal" onChange={setLastDate} />
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
