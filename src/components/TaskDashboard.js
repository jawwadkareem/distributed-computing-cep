const TaskDashboard = ({ stats }) => {
  if (!stats) {
    return (
      <div className="dashboard">
        <h2 className="dashboard-title">Dashboard</h2>
        <div className="stats-grid">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="stat-card" style={{ opacity: 0.5 }}>
              <div className="stat-title">Loading...</div>
              <div className="stat-value">-</div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Ensure all required properties exist with default values
  const safeStats = {
    total: stats.total || 0,
    completed: stats.completed || 0,
    pending: stats.pending || 0,
    priority: stats.priority || { high: 0, medium: 0, low: 0 },
    upcoming: stats.upcoming || 0,
    overdue: stats.overdue || 0,
    categories: stats.categories || [],
  }

  const summaryCards = [
    {
      title: "Total Tasks",
      value: safeStats.total,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#4361ee"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="20" x2="18" y2="10"></line>
          <line x1="12" y1="20" x2="12" y2="4"></line>
          <line x1="6" y1="20" x2="6" y2="14"></line>
        </svg>
      ),
      className: "total",
    },
    {
      title: "Completed",
      value: safeStats.completed,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#4cc9f0"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
      ),
      className: "completed",
    },
    {
      title: "Pending",
      value: safeStats.pending,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#f72585"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10"></circle>
        </svg>
      ),
      className: "pending",
    },
    {
      title: "High Priority",
      value: safeStats.priority.high || 0,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#ff6b6b"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
          <line x1="12" y1="9" x2="12" y2="13"></line>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
      ),
      className: "high-priority",
    },
    {
      title: "Upcoming (7 days)",
      value: safeStats.upcoming || 0,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#7209b7"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
      ),
      className: "upcoming",
    },
    {
      title: "Overdue",
      value: safeStats.overdue || 0,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#f77f00"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
      ),
      className: "overdue",
    },
  ]

  return (
    <div className="dashboard">
      <h2 className="dashboard-title">Dashboard</h2>

      <div className="stats-grid">
        {summaryCards.map((card, index) => (
          <div key={index} className={`stat-card ${card.className}`}>
            <div className="stat-title">
              {card.icon}
              {card.title}
            </div>
            <div className="stat-value">{card.value}</div>
          </div>
        ))}
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h3 className="chart-title">Categories</h3>
          <div className="chart-content">
            {safeStats.categories && safeStats.categories.length > 0 ? (
              safeStats.categories.map((category, index) => (
                <div key={index} className="progress-item">
                  <div className="progress-label">
                    <span style={{ textTransform: "capitalize" }}>{category._id}</span>
                    <span>{category.count}</span>
                  </div>
                  <div className="progress-bar-bg">
                    <div
                      className="progress-bar-fill"
                      style={{
                        width: `${(category.count / safeStats.total) * 100}%`,
                        backgroundColor: getRandomColor(category._id || "default"),
                      }}
                    ></div>
                  </div>
                </div>
              ))
            ) : (
              <p>No categories found</p>
            )}
          </div>
        </div>

        <div className="chart-card">
          <h3 className="chart-title">Priority Distribution</h3>
          <div className="chart-content">
            <div className="progress-item">
              <div className="progress-label">
                <span>High</span>
                <span>{safeStats.priority.high || 0}</span>
              </div>
              <div className="progress-bar-bg">
                <div
                  className="progress-bar-fill high"
                  style={{ width: `${safeStats.total ? (safeStats.priority.high / safeStats.total) * 100 : 0}%` }}
                ></div>
              </div>
            </div>

            <div className="progress-item">
              <div className="progress-label">
                <span>Medium</span>
                <span>{safeStats.priority.medium || 0}</span>
              </div>
              <div className="progress-bar-bg">
                <div
                  className="progress-bar-fill medium"
                  style={{ width: `${safeStats.total ? (safeStats.priority.medium / safeStats.total) * 100 : 0}%` }}
                ></div>
              </div>
            </div>

            <div className="progress-item">
              <div className="progress-label">
                <span>Low</span>
                <span>{safeStats.priority.low || 0}</span>
              </div>
              <div className="progress-bar-bg">
                <div
                  className="progress-bar-fill low"
                  style={{ width: `${safeStats.total ? (safeStats.priority.low / safeStats.total) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper function to generate consistent colors based on category name
const getRandomColor = (str) => {
  if (!str) return "#4361ee" // Default color if string is null or undefined

  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }

  const colors = ["#4361ee", "#3a0ca3", "#7209b7", "#f72585", "#4cc9f0", "#4895ef", "#560bad", "#f77f00"]

  return colors[Math.abs(hash) % colors.length]
}

export default TaskDashboard
