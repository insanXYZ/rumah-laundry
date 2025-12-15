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

export const FilterDashboardButton = (props: filterDashoardButtonProps) => {
  const [filter, setFilter] = useState<string>();
  const [startDate, setStartDate] = useState<string>("");
  const [lastDate, setLastDate] = useState<string>("");

  useEffect(() => {
    if (filter != "custom") {
      const today = new Date();

      switch (filter) {
        case "today":
          props.setStartDate(DateTime.fromJSDate(today).toFormat("yyyy-MM-dd"));
          props.setLastDate(DateTime.fromJSDate(today).toFormat("yyyy-MM-dd"));
          break;
        case "month":
          const date = DateTime.fromJSDate(today);
          const start = date.startOf("month");
          const end = date.endOf("month");
          props.setStartDate(start.toFormat("yyyy-MM-dd"));
          props.setLastDate(end.toFormat("yyyy-MM-dd"));
          break;
      }
    }
  }, [filter]);

  useEffect(() => {
    props.setStartDate(startDate);
    props.setLastDate(lastDate);
  }, [startDate, lastDate]);

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
          <Select onValueChange={(v) => setFilter(v)}>
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
