"use client";

interface CalendarViewProps {
  year?: number;
  month?: number;
  appointmentCounts?: Record<number, { count: number; hasEmergency: boolean }>;
  onDayClick?: (day: number) => void;
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function CalendarView({
  year,
  month,
  appointmentCounts = {},
  onDayClick,
}: CalendarViewProps) {
  const now = new Date();
  const displayYear = year ?? now.getFullYear();
  const displayMonth = month ?? now.getMonth();
  const today = now.getDate();
  const isCurrentMonth = displayYear === now.getFullYear() && displayMonth === now.getMonth();

  const firstDay = new Date(displayYear, displayMonth, 1).getDay();
  const daysInMonth = new Date(displayYear, displayMonth + 1, 0).getDate();
  const days: (number | null)[] = Array(firstDay).fill(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);

  return (
    <div>
      <div className="grid grid-cols-7 mb-3">
        {DAYS.map((day) => (
          <div key={day} className="text-center text-xs font-bold text-dark/40 uppercase tracking-wider py-2">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, i) => {
          if (day === null) return <div key={`empty-${i}`} className="h-14" />;

          const isToday = isCurrentMonth && day === today;
          const apptData = appointmentCounts[day];

          return (
            <div
              key={day}
              id={`cal-view-day-${day}`}
              onClick={() => onDayClick?.(day)}
              className={`h-14 rounded-xl p-2 transition-all duration-200 relative ${
                onDayClick ? "cursor-pointer" : ""
              } ${
                isToday
                  ? "bg-hero-gradient text-white shadow-glow"
                  : apptData
                  ? "bg-primary-light hover:bg-primary/10"
                  : "hover:bg-gray-50"
              }`}
            >
              <span className={`text-sm font-bold ${isToday ? "text-white" : "text-dark"}`}>
                {day}
              </span>
              {apptData && (
                <div className="mt-0.5 flex items-center gap-1">
                  <span className={`text-[9px] font-semibold ${isToday ? "text-white/80" : "text-primary"}`}>
                    {apptData.count}
                  </span>
                  {apptData.hasEmergency && <span className="text-[8px]">🚨</span>}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
