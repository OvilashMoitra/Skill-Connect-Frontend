/**
 * Developer Performance Component
 * Displays analytics about developer productivity
 * Shows ratings, completion rates, and graphical productivity trends
 */
export default function DeveloperPerformance({ stats, developer }) {
  return (
    <div className="space-y-8">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Tasks Completed", value: stats.totalTasksCompleted, unit: "" },
          { label: "Avg Time/Task", value: stats.averageTimePerTask.toFixed(1), unit: "h" },
          { label: "Rating", value: stats.rating, unit: "/5" },
          { label: "This Week", value: stats.tasksThisWeek, unit: "tasks" },
        ].map((metric, idx) => (
          <div key={idx} className="bg-card border-2 border-border p-6 rounded">
            <p className="text-sm text-muted-foreground font-bold mb-2">{metric.label}</p>
            <p className="text-4xl font-black">
              {metric.value}
              <span className="text-lg ml-1">{metric.unit}</span>
            </p>
          </div>
        ))}
      </div>

      {/* Weekly Productivity Chart */}
      <div className="bg-card border-2 border-border p-8 rounded">
        <h3 className="text-2xl font-bold mb-6">Weekly Productivity</h3>
        <div className="space-y-4">
          {stats.productivity.map((day) => (
            <div key={day.day} className="flex items-center gap-4">
              <span className="w-12 font-bold">{day.day}</span>
              <div className="flex-1 bg-secondary border-2 border-border h-10 rounded relative">
                <div className="bg-primary h-full rounded" style={{ width: `${(day.hours / 8) * 100}%` }} />
              </div>
              <span className="w-12 text-right font-bold">{day.hours}h</span>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Insights */}
      <div className="bg-card border-2 border-border p-8 rounded">
        <h3 className="text-2xl font-bold mb-6">Performance Insights</h3>
        <div className="space-y-4">
          <div className="border-b-2 border-border pb-4 last:border-b-0">
            <p className="font-bold text-lg mb-2">Efficiency</p>
            <p className="text-muted-foreground">
              You're working{" "}
              {stats.averageTimePerTask < 7
                ? "25% faster"
                : stats.averageTimePerTask > 9
                  ? "20% slower"
                  : "at average pace"}{" "}
              than your peers.
            </p>
          </div>
          <div className="border-b-2 border-border pb-4 last:border-b-0">
            <p className="font-bold text-lg mb-2">Quality</p>
            <p className="text-muted-foreground">
              Your {stats.rating >= 4.8 ? "excellent" : stats.rating >= 4.5 ? "good" : "average"} rating reflects strong
              work quality.
            </p>
          </div>
          <div>
            <p className="font-bold text-lg mb-2">Consistency</p>
            <p className="text-muted-foreground">
              Completed {stats.totalTasksCompleted} tasks at an average of {stats.averageTimePerTask.toFixed(1)} hours
              per task.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
