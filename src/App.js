"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { ThemeProvider } from "./components/ThemeProvider"
import Sidebar from "./components/Sidebar"
import TaskDashboard from "./components/TaskDashboard"
import TaskList from "./components/TaskList"
import TaskForm from "./components/TaskForm"
import ModeToggle from "./components/ModeToggle"
import Toast from "./components/Toast"
import "./App.css"

function App() {
  const [tasks, setTasks] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeView, setActiveView] = useState("all")
  const [filters, setFilters] = useState({
    category: "",
    priority: "",
    completed: undefined,
    search: "",
  })
  const [toast, setToast] = useState({ visible: false, message: "", type: "" })
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Use constants for endpoints to avoid recreating strings
  const endpoint = useMemo(() => "https://dc-backend-black.vercel.app/api/tasks", [])
  const statsEndpoint = useMemo(() => "https://dc-backend-black.vercel.app/api/stats", [])

  const showToast = useCallback((message, type = "success") => {
    setToast({ visible: true, message, type })
    setTimeout(() => {
      setToast((prevToast) => ({ ...prevToast, visible: false }))
    }, 3000)
  }, [])

  const fetchTasks = useCallback(async () => {
    try {
      let url = endpoint

      // Add query parameters for filtering
      const queryParams = new URLSearchParams()
      if (filters.category) queryParams.append("category", filters.category)
      if (filters.priority) queryParams.append("priority", filters.priority)
      if (filters.completed !== undefined) queryParams.append("completed", filters.completed.toString())
      if (filters.search) queryParams.append("search", filters.search)

      if (queryParams.toString()) {
        url += `?${queryParams.toString()}`
      }

      // Removed custom headers that were causing CORS issues
      const res = await fetch(url)

      if (!res.ok) throw new Error("Failed to fetch tasks")

      const data = await res.json()
      setTasks(data)
    } catch (error) {
      console.error("Error fetching tasks:", error)
      showToast("Failed to load tasks. Please try again.", "error")
    } finally {
      setLoading(false)
    }
  }, [endpoint, filters, showToast])

  const fetchStats = useCallback(async () => {
    try {
      // Removed custom headers that were causing CORS issues
      const res = await fetch(statsEndpoint)

      if (!res.ok) throw new Error("Failed to fetch statistics")

      const data = await res.json()

      // Ensure stats has all required properties
      const safeData = {
        total: data.total || 0,
        completed: data.completed || 0,
        pending: data.pending || 0,
        priority: data.priority || { high: 0, medium: 0, low: 0 },
        upcoming: data.upcoming || 0,
        overdue: data.overdue || 0,
        categories: data.categories || [],
      }

      setStats(safeData)
    } catch (error) {
      console.error("Error fetching stats:", error)
      // Set default stats on error
      setStats({
        total: 0,
        completed: 0,
        pending: 0,
        priority: { high: 0, medium: 0, low: 0 },
        upcoming: 0,
        overdue: 0,
        categories: [],
      })
    }
  }, [statsEndpoint])

  useEffect(() => {
    fetchTasks()
    fetchStats()
  }, [fetchTasks, fetchStats])

  const addTask = useCallback(
    async (taskData) => {
      try {
        setLoading(true)
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(taskData),
        })

        if (!res.ok) throw new Error("Failed to add task")

        const newTask = await res.json()
        setTasks((prevTasks) => [newTask, ...prevTasks])
        fetchStats()

        showToast("Task added successfully!")
      } catch (error) {
        console.error("Error adding task:", error)
        showToast("Failed to add task. Please try again.", "error")
      } finally {
        setLoading(false)
      }
    },
    [endpoint, fetchStats, showToast],
  )

  const updateTask = useCallback(
    async (id, taskData) => {
      try {
        setLoading(true)
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, action: "update", ...taskData }),
        })

        if (!res.ok) throw new Error("Failed to update task")

        const updatedTask = await res.json()
        setTasks((prevTasks) => prevTasks.map((task) => (task._id === id ? updatedTask : task)))
        fetchStats()

        showToast("Task updated successfully!")
      } catch (error) {
        console.error("Error updating task:", error)
        showToast("Failed to update task. Please try again.", "error")
      } finally {
        setLoading(false)
      }
    },
    [endpoint, fetchStats, showToast],
  )

  const toggleTask = useCallback(
    async (id) => {
      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, action: "toggle" }),
        })

        if (!res.ok) throw new Error("Failed to toggle task")

        const updatedTask = await res.json()
        setTasks((prevTasks) => prevTasks.map((task) => (task._id === id ? updatedTask : task)))
        fetchStats()
      } catch (error) {
        console.error("Error toggling task:", error)
        showToast("Failed to update task status. Please try again.", "error")
      }
    },
    [endpoint, fetchStats, showToast],
  )

  const deleteTask = useCallback(
    async (id) => {
      if (!window.confirm("Are you sure you want to delete this task?")) return

      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, action: "delete" }),
        })

        if (!res.ok) throw new Error("Failed to delete task")

        setTasks((prevTasks) => prevTasks.filter((task) => task._id !== id))
        fetchStats()

        showToast("Task deleted successfully!")
      } catch (error) {
        console.error("Error deleting task:", error)
        showToast("Failed to delete task. Please try again.", "error")
      }
    },
    [endpoint, fetchStats, showToast],
  )

  const handleFilterChange = useCallback((newFilters) => {
    setFilters((prevFilters) => ({ ...prevFilters, ...newFilters }))
  }, [])

  const handleViewChange = useCallback((view) => {
    setActiveView(view)

    // Set appropriate filters based on view
    setFilters((prevFilters) => {
      const newFilters = { ...prevFilters }

      if (view === "all") {
        newFilters.completed = undefined
        newFilters.priority = ""
      } else if (view === "pending") {
        newFilters.completed = false
        newFilters.priority = ""
      } else if (view === "completed") {
        newFilters.completed = true
        newFilters.priority = ""
      } else if (view === "high-priority") {
        newFilters.priority = "high"
        newFilters.completed = false
      }

      return newFilters
    })

    // Close sidebar on mobile after selection
    if (window.innerWidth < 768) {
      setSidebarOpen(false)
    }
  }, [])

  // Memoize the sidebar component to prevent unnecessary re-renders
  const sidebarComponent = useMemo(
    () => (
      <Sidebar
        activeView={activeView}
        onViewChange={handleViewChange}
        stats={stats}
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />
    ),
    [activeView, handleViewChange, sidebarOpen, stats],
  )

  // Memoize the main content based on activeView
  const mainContent = useMemo(() => {
    if (activeView === "dashboard") {
      return <TaskDashboard stats={stats} />
    } else {
      return (
        <>
          <TaskForm onAddTask={addTask} onFilterChange={handleFilterChange} filters={filters} />
          {loading && tasks.length === 0 ? (
            <div className="loader-container">
              <div className="loader"></div>
            </div>
          ) : (
            <TaskList tasks={tasks} onToggle={toggleTask} onDelete={deleteTask} onUpdate={updateTask} />
          )}
        </>
      )
    }
  }, [activeView, stats, addTask, handleFilterChange, filters, loading, tasks, toggleTask, deleteTask, updateTask])

  return (
    <ThemeProvider>
      <div className="app-container">
        {sidebarComponent}

        {sidebarOpen && window.innerWidth < 768 && (
          <div className="sidebar-overlay active" onClick={() => setSidebarOpen(false)}></div>
        )}

        <main className={`main-content ${sidebarOpen ? "sidebar-open" : ""}`}>
          <div className="header">
            <button className="menu-button" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
            <h1>TaskFlow</h1>
            <ModeToggle />
          </div>

          {mainContent}
        </main>

        {toast.visible && <Toast message={toast.message} type={toast.type} />}
      </div>
    </ThemeProvider>
  )
}

export default App
