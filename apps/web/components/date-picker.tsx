'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Calendar } from '@repo/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@repo/ui/popover';
import { cn } from '@repo/ui/utils';

interface DatePickerProps {
  selected: Date;
  onSelect: (date: Date) => void;
}

export function DatePicker({ selected, onSelect }: DatePickerProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className={cn(
          'inline-flex items-center justify-start text-left font-normal',
          'h-9 gap-1.5 px-2.5 rounded-md border text-sm',
          'bg-white/10 border-white/20 text-white hover:bg-white/20',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50',
          'disabled:pointer-events-none disabled:opacity-50'
        )}
      >
        <CalendarIcon className="mr-2 w-4 h-4" />
        {format(selected, 'PPP')}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={(date) => {
            if (date) {
              onSelect(date);
              setOpen(false);
            }
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
