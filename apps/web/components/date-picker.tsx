'use client';

import { useState } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Calendar } from '@repo/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@repo/ui/popover';
import { cn } from '@repo/ui/utils';
import { formatDateDisplay } from '@/lib/utils/date-formatters';

interface DatePickerProps {
  selected: Date;
  onSelect: (date: Date) => void;
}

export function DatePicker({ selected, onSelect }: DatePickerProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        aria-label="Select date to view NBA games"
        aria-expanded={open}
        aria-haspopup="dialog"
        className={cn(
          'inline-flex items-center justify-start text-left font-normal',
          'h-10 gap-1.5 px-3 rounded-md border text-sm',
          'bg-white/10 border-white/20 text-white hover:bg-white/20',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50',
          'disabled:pointer-events-none disabled:opacity-50',
          'transition-colors cursor-pointer'
        )}
      >
        <CalendarIcon className="mr-2 w-4 h-4" />
        {formatDateDisplay(selected)}
      </PopoverTrigger>
      <PopoverContent 
        className="w-auto p-3 !bg-slate-900 border-slate-700 shadow-2xl" 
        align="start"
        style={{
          backgroundColor: '#0f172a', // slate-900
        }}
      >
        <div className="[&_.rdp]:!bg-transparent [&_button]:cursor-pointer [&_button:hover]:!bg-white/10 [&_button[data-selected-single=true]]:!bg-blue-600 [&_button[data-selected-single=true]]:!text-white [&_.rdp-weekday]:!text-slate-400 [&_.rdp-caption_label]:!text-white [&_.rdp-caption_label]:font-heading [&_.rdp-caption_label]:!font-bold [&_.cn-calendar-caption-label]:!text-white [&_.cn-calendar-caption-label]:font-heading [&_.rdp-month_caption]:!text-white [&_.rdp-month_caption]:font-heading [&_button]:!text-slate-200 [&_button[aria-disabled=true]]:!text-slate-600 [&_button[aria-disabled=true]]:cursor-not-allowed [&_.rdp-button_previous]:!text-white [&_.rdp-button_next]:!text-white [&_.rdp-button_previous:hover]:!bg-white/10 [&_.rdp-button_next:hover]:!bg-white/10 [&_.rdp-nav~*]:!text-white">
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
        </div>
      </PopoverContent>
    </Popover>
  );
}
