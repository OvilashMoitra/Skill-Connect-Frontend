"use client"

/**
 * Task Calendar Component
 * Visual calendar showing task deadlines and completion dates
 * Helps developers plan their workload
 */
import { useState } from "react"

export default function TaskCalendar({ tasks }) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  // Get calendar days
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const daysInMonth = getDaysInMonth(currentMonth)
  const firstDay = getFirstDayOfMonth(currentMonth)
  const days = []

  // Populate calendar days
  for (let i = 0; i < firstDay; i++) {
    days.push(null)
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i)
  }

  // Get tasks for a specific day
  const getTasksForDay = (day) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    const dateStr = date.toISOString().split("T")[0]
    return tasks.filter((t) => t.deadline === dateStr)
  }

  const monthName = currentMonth.toLocaleString("default", { month: "long", year: "numeric" })

  return (
    <div className="space-y-6">
      {/* Calendar header */}
      <div className="flex items-center justify-between mb-6 border-b-2 border-border pb-4">
        <button
          onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
          className="px-4 py-2 font-bold bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition"
        >
          ← Previous
        </button>
        <h2 className="text-3xl font-black">{monthName}</h2>
        <button
          onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
          className="px-4 py-2 font-bold bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition"
        >
          Next →
        </button>
      </div>

      {/* Calendar grid */}
      <div className="border-2 border-border">
        {/* Day headers */}
        <div className="grid grid-cols-7 border-b-2 border-border bg-secondary">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="p-4 font-bold text-center border-r-2 border-border last:border-r-0">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7">
          {days.map((day, idx) => {
            const dayTasks = day ? getTasksForDay(day) : []
            return (
              <div
                key={idx}
                className={`min-h-24 p-2 border-r-2 border-b-2 border-border last:border-r-0 ${
                  day ? "bg-background" : "bg-muted"
                }`}
              >
                {day && (
                  <>
                    <p className="font-bold mb-1">{day}</p>
                    <div className="space-y-1">
                      {dayTasks.slice(0, 2).map((task) => (
                        <div key={task.id} className="text-xs bg-accent text-accent-foreground p-1 rounded">
                          {task.title.substring(0, 12)}...
                        </div>
                      ))}
                      {dayTasks.length > 2 && (
                        <p className="text-xs text-muted-foreground">+{dayTasks.length - 2} more</p>
                      )}
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
