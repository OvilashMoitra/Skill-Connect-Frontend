/**
 * Project Statistics Component - Updated with lively cards
 * Displays high-level project metrics with enhanced animations
 * Shows budget tracking, milestone progress, and completion rates
 */
export default function ProjectStats({ project }) {
  const completedTasks = project.tasks.filter((t) => t.status === "completed").length
  const totalTasks = project.tasks.length
  const completion = totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100

  // Calculate budget usage (estimate based on time logged)
  const totalHoursLogged = project.tasks.reduce((sum, t) => sum + t.timeLogged, 0)
  const estimatedCost = totalHoursLogged * 100 // $100/hour estimate
  const budgetPercentage = (estimatedCost / project.budget) * 100

  // Check for overdue tasks
  const overdueTasks = project.tasks.filter((t) => new Date(t.deadline) < new Date() && t.status !== "completed")

  /* Removed custom utility classes, using only standard Tailwind */
  const StatCard = ({ label, value, subtext, isAlert, delay }) => (
    <div
      className={`bg-card border-2 p-6 rounded-lg shadow-sm hover:shadow-lg animate-slide-in-up ${
        isAlert ? "border-accent" : "border-border"
      }`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <p className="text-xs text-muted-foreground font-bold mb-3 tracking-wide uppercase">{label}</p>
      <p className={`text-4xl font-black mb-3 ${isAlert ? "text-accent" : "text-foreground"}`}>{value}</p>
      {subtext && <p className="text-xs text-muted-foreground">{subtext}</p>}
    </div>
  )

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <StatCard label="Completion" value={`${completion.toFixed(0)}%`} delay={0} />
      <StatCard label="Tasks" value={`${completedTasks}/${totalTasks}`} subtext="completed" delay={100} />
      <StatCard
        label="Budget"
        value={`${budgetPercentage.toFixed(0)}%`}
        subtext={`$${estimatedCost.toFixed(0)} / $${project.budget}`}
        delay={200}
      />
      <StatCard
        label="Alerts"
        value={overdueTasks.length}
        subtext="overdue tasks"
        isAlert={overdueTasks.length > 0}
        delay={300}
      />
    </div>
  )
}
