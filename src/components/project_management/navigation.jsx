"use client"

/**
 * Navigation Component - Updated with lively animations
 * Top bar with role switcher and project overview
 * Allows switching between manager and developer views
 */
export default function Navigation({
  currentView,
  setCurrentView,
  projectCount,
  userRole,
  setUserRole,
  currentDeveloper,
  setCurrentDeveloper,
}) {
  return (
    <nav className="border-b-4 border-primary bg-card sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-6 py-6 flex items-center justify-between">
        <div className="animate-slide-in-down">
          <h1 className="text-4xl font-black tracking-tight">ProjectFlow</h1>
          <p className="text-xs text-muted-foreground font-semibold">Minimal Project Management</p>
        </div>

        <div className="flex items-center gap-8">
          {/* Role Switcher */}
          <div
            className="flex gap-3 border-r-2 border-border pr-8 animate-slide-in-down"
            style={{ animationDelay: "0.1s" }}
          >
            {["manager", "developer"].map((role) => (
              <button
                key={role}
                onClick={() => setUserRole(role)}
                className={`px-4 py-2 font-bold text-sm rounded ${
                  userRole === role
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </button>
            ))}
          </div>

          {/* Developer Selector */}
          {userRole === "developer" && (
            <select
              value={currentDeveloper}
              onChange={(e) => setCurrentDeveloper(e.target.value)}
              className="px-4 py-2 font-bold bg-secondary text-secondary-foreground border-2 border-border hover:border-primary rounded cursor-pointer animate-slide-in-down"
              style={{ animationDelay: "0.2s" }}
            >
              <option value="John">John</option>
              <option value="Sarah">Sarah</option>
              <option value="Mike">Mike</option>
              <option value="Emma">Emma</option>
            </select>
          )}

          {/* Project count and view toggle */}
          {userRole === "manager" && (
            <div className="flex gap-3 animate-slide-in-down" style={{ animationDelay: "0.2s" }}>
              <button
                onClick={() => setCurrentView("dashboard")}
                className={`px-4 py-2 font-bold text-sm rounded ${
                  currentView === "dashboard"
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground"
                }`}
              >
                Projects ({projectCount})
              </button>
              <button
                onClick={() => setCurrentView("new-project")}
                className={`px-4 py-2 font-bold text-sm rounded ${
                  currentView === "new-project"
                    ? "bg-accent text-accent-foreground shadow-md"
                    : "bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                + New Project
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
