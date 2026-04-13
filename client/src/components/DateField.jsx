import React, { useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { DayPicker } from "react-day-picker";
import dayjs from "dayjs";
import { assets } from "../assets/assets";

export const startOfToday = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

const DateField = ({
  label,
  value,
  onChange,
  minDate,
  placeholder = "Select date",
  className = "",
}) => {
  const [open, setOpen] = useState(false);
  const selected = value ? new Date(value) : undefined;

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && <label className="text-sm text-gray-500">{label}</label>}
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger asChild>
          <button
            type="button"
            className="flex items-center justify-between gap-2 border border-borderColor px-3 py-2.5 rounded-lg text-left hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition min-w-44"
          >
            <span className={selected ? "text-gray-800" : "text-gray-400"}>
              {selected ? dayjs(selected).format("ddd, MMM D, YYYY") : placeholder}
            </span>
            <img
              src={assets.calendar_icon_colored}
              alt=""
              className="h-4 opacity-70"
            />
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            sideOffset={6}
            align="start"
            className="z-50 bg-white rounded-xl shadow-xl border border-borderColor p-2"
          >
            <DayPicker
              mode="single"
              selected={selected}
              onSelect={(date) => {
                if (!date) return;
                onChange(dayjs(date).format("YYYY-MM-DD"));
                setOpen(false);
              }}
              disabled={minDate ? { before: minDate } : undefined}
              defaultMonth={selected ?? minDate ?? startOfToday()}
              showOutsideDays
            />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
};

export default DateField;
